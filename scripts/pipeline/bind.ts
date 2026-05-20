import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from './lib/logger.ts';
import { loadFigmaConfig, loadFigmaMapping, ConfigError } from './lib/config-loader.ts';
import { fetchFigmaFile, flattenTree, FlatNode, FigmaApiError } from './lib/figma-api.ts';

const CONFIG_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../config'
);
const MAPPING_FILE = resolve(CONFIG_DIR, 'figma-mapping.yaml');

const logger = createLogger('bind');

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s\-_/]/g, '');
}

interface ConflictRecord {
  key: string;
  candidates: Array<{ id: string; name: string; path: string[] }>;
}

// Apply patches one-by-one in key order to correctly match the first occurrence
// YAML structure uses 2-space indent for keys, 4-space indent for fields:
//   icon:
//     figmaNodeId: null
function patchSingleEntry(key: string, nodeId: string, nodeName: string, nodePath: string[]): void {
  let content = readFileSync(MAPPING_FILE, 'utf-8');

  // Match: "  key:\n    figmaNodeId: null" (2-space key, 4-space fields)
  const keyPattern = new RegExp(`(  ${key}:\\n    figmaNodeId:) null`);
  if (keyPattern.test(content)) {
    content = content.replace(keyPattern, `$1 "${nodeId}"`);
    writeFileSync(MAPPING_FILE, content, 'utf-8');
    content = readFileSync(MAPPING_FILE, 'utf-8');
  }

  const namePattern = new RegExp(`(  ${key}:\\n    figmaNodeId:[^\\n]*\\n    figmaNodeName:) null`);
  if (namePattern.test(content)) {
    content = content.replace(namePattern, `$1 "${nodeName}"`);
    writeFileSync(MAPPING_FILE, content, 'utf-8');
    content = readFileSync(MAPPING_FILE, 'utf-8');
  }

  const pathYaml = nodePath.length > 0 ? `["${nodePath.join('", "')}"]` : '[]';
  const pathPattern = new RegExp(
    `(  ${key}:\\n    figmaNodeId:[^\\n]*\\n    figmaNodeName:[^\\n]*\\n    figmaNodePath:) null`
  );
  if (pathPattern.test(content)) {
    content = content.replace(pathPattern, `$1 ${pathYaml}`);
    writeFileSync(MAPPING_FILE, content, 'utf-8');
  }
}

async function main(): Promise<void> {
  logger.info('Starting bind.ts — Figma node ID auto-fill');

  // 1. Load config
  let figmaConfig;
  try {
    figmaConfig = loadFigmaConfig();
  } catch (err) {
    if (err instanceof ConfigError) {
      logger.error(err.message);
    } else {
      logger.error(`Unexpected error loading figma.yaml: ${String(err)}`);
    }
    process.exit(1);
  }

  let mapping;
  try {
    mapping = loadFigmaMapping();
  } catch (err) {
    if (err instanceof ConfigError) {
      logger.error(err.message);
    } else {
      logger.error(`Unexpected error loading figma-mapping.yaml: ${String(err)}`);
    }
    process.exit(1);
  }

  const { fileKey } = figmaConfig.figma;
  logger.info(`Fetching Figma file tree for fileKey: ${fileKey}`);

  // 2. Fetch Figma tree
  let figmaFile;
  try {
    figmaFile = await fetchFigmaFile(fileKey);
  } catch (err) {
    if (err instanceof FigmaApiError) {
      logger.error(err.message);
    } else {
      logger.error(`Unexpected error fetching Figma file: ${String(err)}`);
    }
    process.exit(1);
  }

  logger.success(`Fetched Figma file: "${figmaFile.name}"`);

  // 3. Flatten tree
  const allNodes = flattenTree(figmaFile.document, ['COMPONENT', 'COMPONENT_SET', 'FRAME']);
  logger.info(`Flattened tree: ${allNodes.length} nodes (COMPONENT/COMPONENT_SET/FRAME)`);

  // Build normalized lookup map: normalized name → matching nodes
  const normalizedMap = new Map<string, FlatNode[]>();
  for (const node of allNodes) {
    const key = normalize(node.name);
    const existing = normalizedMap.get(key) ?? [];
    existing.push(node);
    normalizedMap.set(key, existing);
  }

  // 4. Iterate mapping entries
  type CategoryEntry = [string, 'component' | 'screen'];
  const entries: CategoryEntry[] = [
    ...Object.keys(mapping.components).map(k => [k, 'component'] as CategoryEntry),
    ...Object.keys(mapping.compositions).map(k => [k, 'component'] as CategoryEntry),
    ...Object.keys(mapping.screens).map(k => [k, 'screen'] as CategoryEntry),
  ];

  let matchCount = 0;
  let conflictCount = 0;
  let notFoundCount = 0;
  const conflicts: ConflictRecord[] = [];

  for (const [key, category] of entries) {
    const normKey = normalize(key);
    const candidates = normalizedMap.get(normKey) ?? [];

    // Filter by preferred type
    const preferredTypes = category === 'screen' ? ['FRAME'] : ['COMPONENT', 'COMPONENT_SET'];
    const preferred = candidates.filter(n => preferredTypes.includes(n.type));
    const pool = preferred.length > 0 ? preferred : candidates;

    if (pool.length === 0) {
      logger.warn(`[${key}] not found in Figma tree (normalized: "${normKey}")`);
      notFoundCount++;
    } else if (pool.length > 1) {
      logger.warn(
        `[${key}] CONFLICT — ${pool.length} candidates: ${pool.map(n => `${n.id}:${n.name}`).join(', ')}`
      );
      logger.warn(`  Add figmaNodePath to yaml to disambiguate.`);
      conflicts.push({
        key,
        candidates: pool.map(n => ({ id: n.id, name: n.name, path: n.path })),
      });
      conflictCount++;
    } else {
      const node = pool[0];
      logger.info(`[${key}] matched → id:${node.id} name:"${node.name}" path:[${node.path.join(' > ')}]`);
      patchSingleEntry(key, node.id, node.name, node.path);
      matchCount++;
    }
  }

  // 5. Summary
  const total = entries.length;
  logger.info('--- Bind Summary ---');
  logger.info(`Total entries:   ${total}`);
  logger.success(`Matched:         ${matchCount}`);
  if (notFoundCount > 0) {
    logger.warn(`Not found:       ${notFoundCount} (component may not exist in Figma yet)`);
  } else {
    logger.info(`Not found:       ${notFoundCount}`);
  }
  if (conflictCount > 0) {
    logger.error(`Conflicts:       ${conflictCount} (add figmaNodePath to yaml to disambiguate)`);
    for (const c of conflicts) {
      logger.error(`  [${c.key}] candidates: ${c.candidates.map(n => `${n.id}:"${n.name}"`).join(', ')}`);
    }
  } else {
    logger.info(`Conflicts:       ${conflictCount}`);
  }

  if (conflictCount > 0) {
    logger.error('Bind FAILED — resolve conflicts above then re-run.');
    process.exit(1);
  } else {
    logger.success('Bind COMPLETE — figma-mapping.yaml updated. Run `npm run figma:preflight` to verify.');
    process.exit(0);
  }
}

main().catch(err => {
  logger.error(`Unhandled error: ${String(err)}`);
  process.exit(1);
});
