import type { SnapshotNodeEntry } from './snapshot-node.ts';

export type ChangeClass =
  | 'token'
  | 'text'
  | 'component-props'
  | 'asset'
  | 'layout'
  | 'structure'
  | 'unknown';

export type ComparisonMode = 'baseline' | 'bootstrap-latest-two';

export interface SnapshotFile {
  fileKey: string;
  fileKeys?: string[];
  timestamp: string;
  source: 'figma-rest';
  tokensHash: string;
  nodes: Record<string, Partial<SnapshotNodeEntry> & Pick<SnapshotNodeEntry, 'id' | 'name'>>;
}

export interface SnapshotPair {
  comparisonMode: ComparisonMode;
  baseFile: string;
  headFile: string;
}

export interface DiffChange {
  key: string;
  nodeId: string | null;
  nodeName: string;
  classes: ChangeClass[];
  reasons: string[];
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}

export interface DiffFile {
  stage: 'diff';
  generatedAt: string;
  fileKey: string;
  fileKeys?: string[];
  comparisonMode: ComparisonMode;
  baseTs: string;
  headTs: string;
  basePath: string;
  headPath: string;
  changes: DiffChange[];
}

interface DiffOptions {
  comparisonMode: ComparisonMode;
  basePath: string;
  headPath: string;
  generatedAt?: string;
}

export function selectSnapshotPair(
  snapshotFiles: string[],
  baselineFiles: string[]
): SnapshotPair | null {
  const snapshots = snapshotFiles.filter(isJsonFile).sort();
  const baselines = baselineFiles.filter(isJsonFile).sort();

  if (snapshots.length === 0) {
    return null;
  }

  const headFile = snapshots.at(-1) as string;
  const baselineFile = baselines.at(-1);
  if (baselineFile) {
    return {
      comparisonMode: 'baseline',
      baseFile: baselineFile,
      headFile,
    };
  }

  if (snapshots.length < 2) {
    return null;
  }

  return {
    comparisonMode: 'bootstrap-latest-two',
    baseFile: snapshots[snapshots.length - 2],
    headFile,
  };
}

export function diffSnapshots(
  base: SnapshotFile,
  head: SnapshotFile,
  options: DiffOptions
): DiffFile {
  const changes: DiffChange[] = [];

  if (base.tokensHash !== head.tokensHash) {
    changes.push({
      key: 'tokens',
      nodeId: null,
      nodeName: 'tokens.json',
      classes: ['token'],
      reasons: ['tokensHash changed'],
      before: { tokensHash: base.tokensHash },
      after: { tokensHash: head.tokensHash },
    });
  }

  for (const key of sortedUniqueKeys(base.nodes, head.nodes)) {
    const beforeNode = base.nodes[key];
    const afterNode = head.nodes[key];

    if (!beforeNode) {
      changes.push({
        key,
        nodeId: afterNode.id,
        nodeName: afterNode.name,
        classes: ['structure'],
        reasons: [`Node '${key}' missing from base snapshot`],
        before: {},
        after: summarizeNode(afterNode),
      });
      continue;
    }

    if (!afterNode) {
      changes.push({
        key,
        nodeId: beforeNode.id,
        nodeName: beforeNode.name,
        classes: ['structure'],
        reasons: [`Node '${key}' missing from head snapshot`],
        before: summarizeNode(beforeNode),
        after: {},
      });
      continue;
    }

    const classes: ChangeClass[] = [];
    const reasons: string[] = [];

    if (hashChanged(beforeNode.textHash, afterNode.textHash)) {
      classes.push('text');
      reasons.push('textHash changed');
    }

    if (hashChanged(beforeNode.componentPropsHash, afterNode.componentPropsHash)) {
      classes.push('component-props');
      reasons.push('componentPropsHash changed');
    }

    if (hashChanged(beforeNode.propsHash, afterNode.propsHash)) {
      classes.push('asset');
      reasons.push('propsHash changed');
    }

    if (beforeNode.boundingBox === null || afterNode.boundingBox === null) {
      if (beforeNode.boundingBox !== afterNode.boundingBox) {
        classes.push('structure');
        reasons.push('boundingBox changed to or from null');
      }
    } else if (!sameBoundingBox(beforeNode.boundingBox, afterNode.boundingBox)) {
      classes.push('layout');
      reasons.push('boundingBox changed');
    }

    if (classes.length > 0) {
      changes.push({
        key,
        nodeId: afterNode.id,
        nodeName: afterNode.name,
        classes: dedupeClasses(classes),
        reasons,
        before: summarizeNode(beforeNode),
        after: summarizeNode(afterNode),
      });
    }
  }

  return {
    stage: 'diff',
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    fileKey: head.fileKey,
    fileKeys: head.fileKeys,
    comparisonMode: options.comparisonMode,
    baseTs: base.timestamp,
    headTs: head.timestamp,
    basePath: options.basePath,
    headPath: options.headPath,
    changes,
  };
}

function summarizeNode(node: Partial<SnapshotNodeEntry> & Pick<SnapshotNodeEntry, 'id' | 'name'>): Record<string, unknown> {
  return {
    id: node.id,
    name: node.name,
    boundingBox: node.boundingBox ?? null,
    textHash: node.textHash ?? null,
    propsHash: node.propsHash ?? null,
    componentPropsHash: node.componentPropsHash ?? null,
  };
}

function sameBoundingBox(
  a: SnapshotNodeEntry['boundingBox'] | undefined,
  b: SnapshotNodeEntry['boundingBox'] | undefined
): boolean {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

function hashChanged(before: string | undefined, after: string | undefined): boolean {
  return typeof before === 'string' && typeof after === 'string' && before !== after;
}

function sortedUniqueKeys(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): string[] {
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
}

function dedupeClasses(classes: ChangeClass[]): ChangeClass[] {
  return [...new Set(classes)];
}

function isJsonFile(file: string): boolean {
  return file.endsWith('.json') && !file.endsWith('-classified.json');
}
