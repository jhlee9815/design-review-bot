import { createHash } from 'node:crypto';

export interface FigmaBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigmaPaint {
  type: string;
  color?: { r: number; g: number; b: number; a: number };
  opacity?: number;
  visible?: boolean;
}

export interface FigmaEffect {
  type: string;
  visible?: boolean;
  radius?: number;
  color?: { r: number; g: number; b: number; a: number };
}

export interface FigmaComponentProperty {
  type?: string;
  value?: unknown;
  defaultValue?: unknown;
}

export interface FigmaNodeDetail {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  absoluteBoundingBox?: FigmaBoundingBox;
  fills?: FigmaPaint[];
  effects?: FigmaEffect[];
  characters?: string;
  componentProperties?: Record<string, FigmaComponentProperty>;
  componentPropertyDefinitions?: Record<string, FigmaComponentProperty>;
  variantProperties?: Record<string, unknown>;
  children?: ReadonlyArray<FigmaNodeDetail>;
}

export interface SnapshotTextLeaf {
  nodeId: string;
  nodeName: string;
  path: string[];
  value: string;
}

export interface SnapshotComponentPropLeaf {
  nodeId: string;
  nodeName: string;
  path: string[];
  source: 'componentProperties' | 'componentPropertyDefinitions' | 'variantProperties';
  propName: string;
  propType: string;
  value: unknown;
}

export interface SnapshotNodeEntry {
  id: string;
  name: string;
  lastModified: string;
  visible: boolean;
  boundingBox: FigmaBoundingBox | null;
  textHash: string;
  propsHash: string;
  componentPropsHash: string;
  texts: SnapshotTextLeaf[];
  componentProps: SnapshotComponentPropLeaf[];
}

export function sha256(data: string): string {
  return 'sha256:' + createHash('sha256').update(data, 'utf-8').digest('hex');
}

export function collectTextLeaves(
  node: FigmaNodeDetail,
  path: string[] = [node.name]
): SnapshotTextLeaf[] {
  const leaves: SnapshotTextLeaf[] = [];

  if (node.type === 'TEXT' && node.characters !== undefined) {
    leaves.push({
      nodeId: node.id,
      nodeName: node.name,
      path,
      value: node.characters,
    });
  }

  for (const child of node.children ?? []) {
    leaves.push(...collectTextLeaves(child, [...path, child.name]));
  }

  return leaves;
}

export function collectComponentPropLeaves(
  node: FigmaNodeDetail,
  path: string[] = [node.name]
): SnapshotComponentPropLeaf[] {
  const leaves: SnapshotComponentPropLeaf[] = [];

  for (const [propName, prop] of sortedObjectEntries(node.componentPropertyDefinitions)) {
    leaves.push({
      nodeId: node.id,
      nodeName: node.name,
      path,
      source: 'componentPropertyDefinitions',
      propName,
      propType: prop.type ?? 'UNKNOWN',
      value: prop.defaultValue ?? prop.value ?? null,
    });
  }

  for (const [propName, prop] of sortedObjectEntries(node.componentProperties)) {
    leaves.push({
      nodeId: node.id,
      nodeName: node.name,
      path,
      source: 'componentProperties',
      propName,
      propType: prop.type ?? 'UNKNOWN',
      value: prop.value ?? prop.defaultValue ?? null,
    });
  }

  for (const [propName, value] of sortedObjectEntries(node.variantProperties)) {
    leaves.push({
      nodeId: node.id,
      nodeName: node.name,
      path,
      source: 'variantProperties',
      propName,
      propType: 'VARIANT',
      value,
    });
  }

  for (const child of node.children ?? []) {
    leaves.push(...collectComponentPropLeaves(child, [...path, child.name]));
  }

  return leaves;
}

export function buildSnapshotNodeEntry(
  node: FigmaNodeDetail,
  lastModified: string
): SnapshotNodeEntry {
  const texts = collectTextLeaves(node);
  const componentProps = collectComponentPropLeaves(node);

  return {
    id: node.id,
    name: node.name,
    lastModified,
    visible: node.visible !== false,
    boundingBox: node.absoluteBoundingBox ?? null,
    textHash: hashTextLeaves(texts),
    propsHash: hashVisualProps(node),
    componentPropsHash: hashComponentPropLeaves(componentProps),
    texts,
    componentProps,
  };
}

export function buildMissingSnapshotNodeEntry(
  id: string,
  name: string,
  lastModified: string
): SnapshotNodeEntry {
  return {
    id,
    name,
    lastModified,
    visible: false,
    boundingBox: null,
    textHash: sha256(''),
    propsHash: sha256(''),
    componentPropsHash: sha256(''),
    texts: [],
    componentProps: [],
  };
}

function hashTextLeaves(texts: SnapshotTextLeaf[]): string {
  const joined = [...texts]
    .sort((a, b) => a.nodeId.localeCompare(b.nodeId))
    .map(text => text.value)
    .join('\n');
  return sha256(joined);
}

function hashComponentPropLeaves(componentProps: SnapshotComponentPropLeaf[]): string {
  const payload = [...componentProps]
    .sort(compareComponentProps)
    .map(prop => ({
      nodeId: prop.nodeId,
      source: prop.source,
      propName: prop.propName,
      propType: prop.propType,
      value: prop.value,
    }));
  return sha256(JSON.stringify(payload));
}

function hashVisualProps(node: FigmaNodeDetail): string {
  const payload = JSON.stringify({
    type: node.type,
    fills: node.fills ?? [],
    effects: node.effects ?? [],
  });
  return sha256(payload);
}

function sortedObjectEntries<T>(value: Record<string, T> | undefined): [string, T][] {
  return Object.entries(value ?? {}).sort(([a], [b]) => a.localeCompare(b));
}

function compareComponentProps(
  a: SnapshotComponentPropLeaf,
  b: SnapshotComponentPropLeaf
): number {
  return (
    a.nodeId.localeCompare(b.nodeId) ||
    a.source.localeCompare(b.source) ||
    a.propName.localeCompare(b.propName)
  );
}
