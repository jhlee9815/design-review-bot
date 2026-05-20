import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { loadFigmaConfig, loadFigmaMapping } from './lib/config-loader.ts';
import { fetchFigmaJson, type FigmaFileResponse } from './lib/figma-api.ts';
import { createLogger } from './lib/logger.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const CONFIG_DIR = resolve(REPO_ROOT, 'config');
const FIGMA_CONFIG_PATH = resolve(CONFIG_DIR, 'figma.yaml');
const FIGMA_MAPPING_PATH = resolve(CONFIG_DIR, 'figma-mapping.yaml');
const PACKAGE_JSON_PATH = resolve(REPO_ROOT, 'package.json');
const BACKUP_DIR = resolve(REPO_ROOT, '.automation/backups');
const TRACKING_CODE_PATH = '../src/screens/FigmaFrameTracking.ts';
const DESIGN_SYSTEM_TRACKING_CODE_PATH = '../src/design-system/FigmaDesignSystemTracking.ts';

const logger = createLogger('register-file');

interface TopLevelFrame {
  id: string;
  name: string;
  pageName: string;
  type: string;
}

interface TrackingMappingEntry {
  figmaFileKey?: string;
  figmaNodeId: string;
  figmaNodeName: string;
  figmaNodePath: string[];
  code: string;
  targetType: string;
  automation: {
    apply: 'report-only';
    allowedClasses: string[];
  };
}

function usage(): string {
  return [
    'Usage: npm run figma:register-file -- <figma-url-or-file-key> [options]',
    '',
    'Options:',
    '  --project-name "Name"                 Display name stored in figma-mapping.yaml',
    '  --package-name "package-name"         npm package name stored in package.json',
    '  --design-system-url "<url-or-key>"    Optional separate Figma design-system file',
    '',
    'This switches config/figma.yaml and config/figma-mapping.yaml to a new project/Figma file.',
    'The generated mapping is tracking-only: app frames become report-only screens.',
    'If --design-system-url is provided, top-level design-system nodes become report-only components.',
    'Existing config files are backed up under .automation/backups/ before writing.',
  ].join('\n');
}

function extractFileKey(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/figma\.com\/(?:design|file)\/([^/?#]+)/);
  if (match?.[1]) return match[1];
  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;
  throw new Error(`Cannot extract Figma file key from: ${input}`);
}

function parseOption(args: string[], name: string): string | null {
  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function parseProjectName(args: string[], fallback: string): string {
  return parseOption(args, '--project-name') ?? fallback;
}

function collectTopLevelNodes(file: FigmaFileResponse, allowedTypes: Set<string>): TopLevelFrame[] {
  const pages = file.document.children ?? [];
  const frames: TopLevelFrame[] = [];

  for (const page of pages) {
    const children = page.children ?? [];
    for (const node of children) {
      if (allowedTypes.has(node.type)) {
        frames.push({
          id: node.id,
          name: node.name,
          pageName: page.name,
          type: node.type,
        });
      }
    }
  }

  return frames;
}

function makeSafeKey(frame: TopLevelFrame, usedKeys: Set<string>): string {
  const baseName = frame.name
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part, index) => {
      const lower = part.toLowerCase();
      return index === 0 ? lower : `${lower.slice(0, 1).toUpperCase()}${lower.slice(1)}`;
    })
    .join('');

  const nodeSuffix = frame.id.replace(/[^A-Za-z0-9]+/g, '_');
  const baseKey = `figma_${baseName || 'frame'}_${nodeSuffix}`;
  let key = baseKey;
  let suffix = 2;
  while (usedKeys.has(key)) {
    key = `${baseKey}_${suffix}`;
    suffix++;
  }
  usedKeys.add(key);
  return key;
}

function buildScreens(frames: TopLevelFrame[]): Record<string, TrackingMappingEntry> {
  const usedKeys = new Set<string>();
  const screens: Record<string, TrackingMappingEntry> = {};

  for (const frame of frames) {
    screens[makeSafeKey(frame, usedKeys)] = {
      figmaNodeId: frame.id,
      figmaNodeName: frame.name,
      figmaNodePath: [frame.pageName],
      code: TRACKING_CODE_PATH,
      targetType: 'screen',
      automation: {
        apply: 'report-only',
        allowedClasses: ['token', 'text', 'layout', 'structure'],
      },
    };
  }

  return screens;
}

function buildDesignSystemComponents(
  nodes: TopLevelFrame[],
  fileKey: string
): Record<string, TrackingMappingEntry> {
  const usedKeys = new Set<string>();
  const components: Record<string, TrackingMappingEntry> = {};

  for (const node of nodes) {
    components[makeSafeKey({ ...node, name: `ds ${node.name}` }, usedKeys)] = {
      figmaFileKey: fileKey,
      figmaNodeId: node.id,
      figmaNodeName: node.name,
      figmaNodePath: [node.pageName],
      code: DESIGN_SYSTEM_TRACKING_CODE_PATH,
      targetType: `design-system-${node.type.toLowerCase().replace(/_/g, '-')}`,
      automation: {
        apply: 'report-only',
        allowedClasses: ['token', 'text', 'component-props', 'asset', 'layout', 'structure'],
      },
    };
  }

  return components;
}

function backupConfigFiles(timestamp: string): void {
  mkdirSync(BACKUP_DIR, { recursive: true });
  copyFileSync(FIGMA_CONFIG_PATH, resolve(BACKUP_DIR, `figma.${timestamp}.yaml`));
  copyFileSync(FIGMA_MAPPING_PATH, resolve(BACKUP_DIR, `figma-mapping.${timestamp}.yaml`));
  copyFileSync(PACKAGE_JSON_PATH, resolve(BACKUP_DIR, `package.${timestamp}.json`));
}

function writeYaml(filePath: string, value: unknown): void {
  writeFileSync(
    filePath,
    yaml.dump(value, {
      lineWidth: 120,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
    }),
    'utf-8'
  );
}

function updatePackageName(packageName: string): void {
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8')) as Record<string, unknown>;
  pkg.name = packageName;
  writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(pkg, null, 2)}\n`, 'utf-8');
}

function toPackageName(projectName: string, fallback: string): string {
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9._~-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  return slug || fallback;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const target = args[0];
  if (!target || target === '--help' || target === '-h') {
    console.log(usage());
    process.exit(target ? 0 : 1);
  }

  const fileKey = extractFileKey(target);
  const fileUrl = `https://www.figma.com/design/${fileKey}`;
  const designSystemInput = parseOption(args, '--design-system-url');
  const designSystemFileKey = designSystemInput ? extractFileKey(designSystemInput) : null;
  const designSystemFileUrl = designSystemFileKey
    ? `https://www.figma.com/design/${designSystemFileKey}`
    : null;

  const currentConfig = loadFigmaConfig();
  const currentMapping = loadFigmaMapping();

  logger.info(`Fetching Figma file tree: ${fileKey}`);
  const figmaFile = await fetchFigmaJson<FigmaFileResponse>(
    `https://api.figma.com/v1/files/${fileKey}?depth=2`
  );
  const frames = collectTopLevelNodes(figmaFile, new Set(['FRAME']));
  if (frames.length === 0) {
    logger.error('No top-level FRAME nodes found. Mapping was not changed.');
    process.exit(1);
  }

  const projectName = parseProjectName(args, figmaFile.name || currentMapping.project.name);
  const currentPackage = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8')) as { name?: string };
  const packageName =
    parseOption(args, '--package-name') ??
    toPackageName(projectName, currentPackage.name ?? 'figma-project');

  let designSystemComponents: Record<string, TrackingMappingEntry> = {};
  if (designSystemFileKey) {
    logger.info(`Fetching Figma design-system file tree: ${designSystemFileKey}`);
    const designSystemFile = await fetchFigmaJson<FigmaFileResponse>(
      `https://api.figma.com/v1/files/${designSystemFileKey}?depth=2`
    );
    const designSystemNodes = collectTopLevelNodes(
      designSystemFile,
      new Set(['FRAME', 'COMPONENT', 'COMPONENT_SET'])
    );
    if (designSystemNodes.length === 0) {
      logger.warn('No top-level FRAME/COMPONENT/COMPONENT_SET nodes found in design-system file.');
    }
    designSystemComponents = buildDesignSystemComponents(designSystemNodes, designSystemFileKey);
    logger.info(`Design-system tracking nodes: ${designSystemNodes.length}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  backupConfigFiles(timestamp);

  writeYaml(FIGMA_CONFIG_PATH, {
    figma: {
      fileKey,
      fileUrl,
      ...(designSystemFileKey && designSystemFileUrl
        ? { designSystemFileKey, designSystemFileUrl }
        : {}),
    },
    automation: currentConfig.automation,
  });
  updatePackageName(packageName);

  writeYaml(FIGMA_MAPPING_PATH, {
    version: currentMapping.version,
    project: {
      name: projectName,
      figmaFileKey: fileKey,
    },
    pathResolution: currentMapping.pathResolution,
    tokens: currentMapping.tokens,
    components: designSystemComponents,
    compositions: {},
    screens: buildScreens(frames),
  });

  logger.success(`Registered ${frames.length} top-level frames from ${figmaFile.name}`);
  if (designSystemFileKey) {
    logger.success(`Registered ${Object.keys(designSystemComponents).length} design-system nodes`);
  }
  logger.info(`Project name: ${projectName}`);
  logger.info(`Package name: ${packageName}`);
  logger.info(`Backups written: ${BACKUP_DIR}`);
  logger.info('Next: npm run figma:preflight && npm run figma:run');
  logger.info('Approve/promote the first registration change-set to establish the new baseline.');
}

main().catch(err => {
  logger.error(String(err));
  process.exit(1);
});
