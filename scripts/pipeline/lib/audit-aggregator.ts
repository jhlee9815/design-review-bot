import type {
  DetachedStyleEntry,
  DetachedStyleKind,
} from './compliance-types.ts';
import type { SnapshotNodeEntry } from './snapshot-node.ts';
import type { FigmaMapping } from './config-loader.ts';

export interface TopLevelFrameRef {
  id: string;
  name: string;
}

export interface DetachedStylesSummary {
  total: number;
  byKind: Record<DetachedStyleKind, number>;
  byProperty: Record<string, number>;
  topNodes: Array<{
    nodeId: string;
    nodeName: string;
    nodePath: string[];
    count: number;
  }>;
}

export interface RegisteredRootAudit {
  key: string;
  nodeId: string;
  nodeName: string;
  detachedStyles: DetachedStylesSummary;
  descendantFrameCount: number;
  assetRefCount: number;
}

export interface UnregisteredTopLevelFrame {
  nodeId: string;
  name: string;
}

export interface AuditReport {
  generatedAt: string;
  fileKey: string;
  totalDetachedStyles: number;
  totalUnregisteredTopLevelFrames: number;
  totalRegisteredRoots: number;
  hasViolations: boolean;
  byRegisteredRoot: RegisteredRootAudit[];
  unregisteredTopLevelFrames: UnregisteredTopLevelFrame[];
}

export interface BuildAuditReportInput {
  fileKey: string;
  snapshotNodes: Record<string, SnapshotNodeEntry>;
  mapping: FigmaMapping;
  topLevelFrames: TopLevelFrameRef[];
  generatedAt: string;
}

export function aggregateDetachedStyles(entries: DetachedStyleEntry[]): DetachedStylesSummary {
  const byKind: Record<DetachedStyleKind, number> = { color: 0, typography: 0, effect: 0 };
  const byProperty: Record<string, number> = {};
  const perNode = new Map<string, { nodeId: string; nodeName: string; nodePath: string[]; count: number }>();

  for (const entry of entries) {
    byKind[entry.kind] += 1;
    byProperty[entry.property] = (byProperty[entry.property] ?? 0) + 1;

    const existing = perNode.get(entry.nodeId);
    if (existing) {
      existing.count += 1;
    } else {
      perNode.set(entry.nodeId, {
        nodeId: entry.nodeId,
        nodeName: entry.nodeName,
        nodePath: entry.nodePath,
        count: 1,
      });
    }
  }

  const topNodes = [...perNode.values()].sort((a, b) => b.count - a.count).slice(0, 10);

  return { total: entries.length, byKind, byProperty, topNodes };
}

export function findUnregisteredTopLevelFrames(
  pageFrames: TopLevelFrameRef[],
  mapping: FigmaMapping
): UnregisteredTopLevelFrame[] {
  const registeredIds = collectRegisteredNodeIds(mapping);
  return pageFrames
    .filter(f => !registeredIds.has(f.id))
    .map(f => ({ nodeId: f.id, name: f.name }));
}

export function buildAuditReport(input: BuildAuditReportInput): AuditReport {
  const { fileKey, snapshotNodes, mapping, topLevelFrames, generatedAt } = input;

  const registeredEntries = collectRegisteredEntries(mapping);

  const byRegisteredRoot: RegisteredRootAudit[] = [];
  let totalDetached = 0;

  for (const [key, entry] of Object.entries(snapshotNodes)) {
    const summary = aggregateDetachedStyles(entry.detachedStyles ?? []);
    totalDetached += summary.total;
    byRegisteredRoot.push({
      key,
      nodeId: entry.id,
      nodeName: entry.name,
      detachedStyles: summary,
      descendantFrameCount: (entry.descendantFrames ?? []).length,
      assetRefCount: (entry.assetRefs ?? []).length,
    });
  }
  // Stable sort by detached style count desc
  byRegisteredRoot.sort((a, b) => b.detachedStyles.total - a.detachedStyles.total);

  const unregisteredTopLevelFrames = findUnregisteredTopLevelFrames(topLevelFrames, mapping);

  const hasViolations = totalDetached > 0 || unregisteredTopLevelFrames.length > 0;

  return {
    generatedAt,
    fileKey,
    totalDetachedStyles: totalDetached,
    totalUnregisteredTopLevelFrames: unregisteredTopLevelFrames.length,
    totalRegisteredRoots: registeredEntries.size,
    hasViolations,
    byRegisteredRoot,
    unregisteredTopLevelFrames,
  };
}

export function renderAuditMarkdown(report: AuditReport): string {
  const lines: string[] = [];
  lines.push('# Figma Design System Audit Report');
  lines.push('');
  lines.push(`- Generated: \`${report.generatedAt}\``);
  lines.push(`- Figma file: \`${report.fileKey}\``);
  lines.push(`- Registered roots: ${report.totalRegisteredRoots}`);
  lines.push(`- Total detached styles: **${report.totalDetachedStyles}**`);
  lines.push(`- Unregistered top-level frames: **${report.totalUnregisteredTopLevelFrames}**`);
  lines.push('');

  if (!report.hasViolations) {
    lines.push('✅ No violations found.');
    return lines.join('\n');
  }

  // Unregistered frames
  if (report.unregisteredTopLevelFrames.length > 0) {
    lines.push('## Unregistered top-level frames');
    lines.push('');
    lines.push('이 프레임들은 `config/figma-mapping.yaml`에 등록되지 않아 detection 대상에서 빠져 있습니다. 의도된 화면이면 mapping에 추가하고, 임시 작업물이면 Figma에서 정리하세요.');
    lines.push('');
    lines.push('| Node ID | Name |');
    lines.push('|---|---|');
    for (const f of report.unregisteredTopLevelFrames) {
      lines.push(`| \`${f.nodeId}\` | ${f.name} |`);
    }
    lines.push('');
  }

  // Detached styles per root
  if (report.totalDetachedStyles > 0) {
    lines.push('## Detached styles per registered root');
    lines.push('');
    lines.push('Figma 변수/스타일에 바인딩 안 된 raw 값입니다. 토큰화 필요.');
    lines.push('');
    lines.push('| Root | Node | color | typography | effect | Total |');
    lines.push('|---|---|---:|---:|---:|---:|');
    for (const root of report.byRegisteredRoot) {
      const s = root.detachedStyles.byKind;
      lines.push(`| \`${root.key}\` | ${root.nodeName} (\`${root.nodeId}\`) | ${s.color} | ${s.typography} | ${s.effect} | **${root.detachedStyles.total}** |`);
    }
    lines.push('');

    for (const root of report.byRegisteredRoot) {
      if (root.detachedStyles.total === 0) continue;
      lines.push(`### ${root.nodeName} (\`${root.nodeId}\`) — top offenders`);
      lines.push('');
      lines.push('| Node ID | Node path | Count |');
      lines.push('|---|---|---:|');
      for (const top of root.detachedStyles.topNodes) {
        const path = top.nodePath.join(' / ');
        lines.push(`| \`${top.nodeId}\` | ${path} | ${top.count} |`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('_Generated by `npm run figma:audit`_');
  return lines.join('\n');
}

// ──────────────────────────────────────────────────────────────────────────────
// helpers
// ──────────────────────────────────────────────────────────────────────────────

function collectRegisteredNodeIds(mapping: FigmaMapping): Set<string> {
  const ids = new Set<string>();
  for (const e of collectRegisteredEntries(mapping).values()) {
    if (e.figmaNodeId) ids.add(e.figmaNodeId);
  }
  return ids;
}

function collectRegisteredEntries(mapping: FigmaMapping): Map<string, { figmaNodeId: string | null }> {
  const all = new Map<string, { figmaNodeId: string | null }>();
  for (const [k, v] of Object.entries(mapping.components)) all.set(k, v);
  for (const [k, v] of Object.entries(mapping.compositions)) all.set(k, v);
  for (const [k, v] of Object.entries(mapping.screens)) all.set(k, v);
  return all;
}
