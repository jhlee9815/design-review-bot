import { existsSync } from 'fs';
import { createLogger } from './lib/logger.ts';
import {
  loadFigmaConfig,
  loadFigmaMapping,
  resolveCodePath,
  ConfigError,
} from './lib/config-loader.ts';

const logger = createLogger('preflight');

let fatalCount = 0;

function fatal(msg: string): void {
  logger.error(msg);
  fatalCount++;
}

// Step 2: Load figma.yaml
logger.info('Loading config/figma.yaml...');
let figmaConfig;
try {
  figmaConfig = loadFigmaConfig();
  logger.success(`figma.yaml OK — fileKey: ${figmaConfig.figma.fileKey}, stages: ${figmaConfig.automation.stages.join(', ')}`);
} catch (err) {
  if (err instanceof ConfigError) {
    fatal(err.message);
  } else {
    fatal(`Unexpected error loading figma.yaml: ${String(err)}`);
  }
  process.exit(1);
}

// Step 3: Load figma-mapping.yaml
logger.info('Loading config/figma-mapping.yaml...');
let mapping;
try {
  mapping = loadFigmaMapping();
  logger.success(`figma-mapping.yaml OK — project: ${mapping.project.name}`);
} catch (err) {
  if (err instanceof ConfigError) {
    fatal(err.message);
  } else {
    fatal(`Unexpected error loading figma-mapping.yaml: ${String(err)}`);
  }
  process.exit(1);
}

// Step 4: Iterate all mapping entries
const allEntries = [
  ...Object.entries(mapping.components),
  ...Object.entries(mapping.compositions),
  ...Object.entries(mapping.screens),
];

let totalCount = 0;
let filledCount = 0;
let emptyCount = 0;
let missingFileCount = 0;

for (const [key, entry] of allEntries) {
  totalCount++;
  const absPath = resolveCodePath(entry.code);

  // Check file existence
  if (!existsSync(absPath)) {
    fatal(`[${key}] code file not found: ${absPath}`);
    missingFileCount++;
    continue;
  }

  // Check figmaNode binding state
  const hasId = entry.figmaNodeId !== null && entry.figmaNodeId !== undefined;
  const hasName = entry.figmaNodeName !== null && entry.figmaNodeName !== undefined;
  const hasPath = entry.figmaNodePath !== null && entry.figmaNodePath !== undefined;

  if (!hasId && !hasName && !hasPath) {
    logger.warn(`[${key}] figmaNodeId/Name/Path all null — bind.ts 미실행 상태`);
    emptyCount++;
  } else {
    logger.info(`[${key}] node binding present — id:${String(entry.figmaNodeId)} name:${String(entry.figmaNodeName)}`);
    filledCount++;
  }
}

// Step 5: FIGMA_TOKEN env check
if (!process.env.FIGMA_TOKEN) {
  logger.warn('FIGMA_TOKEN env var not set — Figma API calls will fail (실제 토큰 검증은 5-1-4 단계에서 수행)');
} else {
  logger.info('FIGMA_TOKEN is set');
}

// Step 6: Summary
logger.info('--- Preflight Summary ---');
logger.info(`Total mapping entries: ${totalCount}`);
logger.info(`Filled bindings:       ${filledCount}`);
logger.info(`Empty bindings (warn): ${emptyCount}`);
logger.info(`Missing code files:    ${missingFileCount}`);
logger.info(`Fatal errors:          ${fatalCount}`);

// Step 7: Exit
if (fatalCount > 0) {
  logger.error(`Preflight FAILED — ${fatalCount} fatal error(s). Aborting pipeline.`);
  process.exit(1);
} else {
  logger.success('Preflight PASSED — all code files exist. Warnings above are expected at this stage.');
  process.exit(0);
}
