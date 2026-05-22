import { createHash } from 'node:crypto';
import type { ComplianceDiffSummary } from './compliance-types.ts';
import { CATEGORY_EMOJI, CATEGORY_LABEL_KO, DETACHED_STYLE_KIND_LABEL_KO } from './category-labels.ts';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewFrontmatter {
  changeSetId: string;
  status: ReviewStatus;
  approvedBy: string;
  approvedAt: string;
  reportSha256: string;
  artifactsSha256: string;
  rejectReason: string;
  generatedAt: string;
}

export interface DesignerReportInput {
  changeSetId: string;
  classifiedPath: string;
  applyReportPath: string;
  verifyReportPath: string;
  reportOnlyReportPath?: string;
  classifiedSummary: {
    total: number;
    autoApply: number;
    reportOnly: number;
    unknown: number;
  };
  applyStatus: string;
  verifyStatus: string;
  changedFiles: string[];
  visualReportPath?: string;
  verificationRows: Array<{
    check: string;
    status: string;
    message: string;
  }>;
  generatedAt: string;
  artifactsSha256: string;
  complianceSummary?: ComplianceDiffSummary;
}

export interface ParsedReviewReport {
  path: string;
  frontmatter: ReviewFrontmatter;
  body: string;
  bodySha256: string;
}

export function shouldCreateDesignerReport(summary: DesignerReportInput['classifiedSummary']): boolean {
  return summary.total > 0;
}

export function buildDesignerReport(input: DesignerReportInput): string {
  const body = renderDesignerReportBody(input);
  const frontmatter: ReviewFrontmatter = {
    changeSetId: input.changeSetId,
    status: 'pending',
    approvedBy: 'null',
    approvedAt: 'null',
    reportSha256: sha256(body),
    artifactsSha256: input.artifactsSha256,
    rejectReason: 'null',
    generatedAt: input.generatedAt,
  };
  return serializeReport(frontmatter, body);
}

export function parseReviewReport(markdown: string, path: string): ParsedReviewReport {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Review report missing frontmatter: ${path}`);
  }

  const frontmatter = parseFrontmatter(match[1]);
  const body = markdown.slice(match[0].length);
  return {
    path,
    frontmatter,
    body,
    bodySha256: sha256(body),
  };
}

export function approveReport(
  markdown: string,
  options: { approvedBy: string; approvedAt: string }
): string {
  const parsed = parseReviewReport(markdown, 'report');
  const frontmatter: ReviewFrontmatter = {
    ...parsed.frontmatter,
    status: 'approved',
    approvedBy: options.approvedBy,
    approvedAt: options.approvedAt,
    rejectReason: 'null',
    reportSha256: sha256(parsed.body),
  };
  return serializeReport(frontmatter, parsed.body);
}

export function rejectReport(markdown: string, options: { reason: string }): string {
  const parsed = parseReviewReport(markdown, 'report');
  const frontmatter: ReviewFrontmatter = {
    ...parsed.frontmatter,
    status: 'rejected',
    approvedBy: 'null',
    approvedAt: 'null',
    rejectReason: options.reason,
    reportSha256: sha256(parsed.body),
  };
  return serializeReport(frontmatter, parsed.body);
}

export function sha256(value: string): string {
  return 'sha256:' + createHash('sha256').update(value, 'utf-8').digest('hex');
}

export function hashArtifacts(contents: string[]): string {
  return sha256(contents.join('\n--- artifact boundary ---\n'));
}

function renderDesignerReportBody(input: DesignerReportInput): string {
  return [
    `# Change Set ${input.changeSetId}`,
    '',
    '## 요약',
    '',
    `- Figma/classified 변경: ${input.classifiedSummary.total}건`,
    `- 자동 반영 후보: ${input.classifiedSummary.autoApply}건`,
    `- 디자이너 검토 대상 (report-only): ${input.classifiedSummary.reportOnly}건`,
    `- 미분류: ${input.classifiedSummary.unknown}건`,
    `- 자동 반영 상태: ${input.applyStatus}`,
    `- 검증 상태: ${input.verifyStatus}`,
    '',
    ...renderCategorySummary(input.complianceSummary),
    '## 관련 산출물',
    '',
    `- Classified diff: \`${input.classifiedPath}\``,
    `- Apply report: \`${input.applyReportPath}\``,
    `- Verify report: \`${input.verifyReportPath}\``,
    ...(input.reportOnlyReportPath ? [`- Report-only detail: \`${input.reportOnlyReportPath}\``] : []),
    '',
    '## 코드 변경',
    '',
    ...(input.changedFiles.length > 0 ? input.changedFiles.map(file => `- \`${file}\``) : ['- None']),
    '',
    '## 시각 검증 산출물',
    '',
    input.visualReportPath
      ? `- Visual diff: \`${input.visualReportPath}\``
      : '- None',
    '',
    '## 검증 결과',
    '',
    '| Check | Status | Message |',
    '|---|---|---|',
    ...input.verificationRows.map(row =>
      [row.check, row.status, row.message]
        .map(escapeTableCell)
        .join(' | ')
        .replace(/^/, '| ')
        .replace(/$/, ' |')
    ),
    '',
    ...renderComplianceSections(input.complianceSummary),
    '## 디자이너 액션',
    '',
    `- 승인: \`npm run figma:approve ${input.changeSetId}\``,
    `- 반려: \`npm run figma:reject ${input.changeSetId} "사유"\``,
    '',
  ].join('\n');
}

function renderCategorySummary(summary: ComplianceDiffSummary | undefined): string[] {
  // Top-level "변경 분류" chip block. Three buckets that the designer should
  // care about most: 새 화면 추가, 디자인 시스템 미사용, 이미지 변경. Each is
  // labeled via CATEGORY_LABEL_KO so the markdown / Slack / viewer agree.
  if (!summary) return [];
  const newFrames = summary.newFrames.length;
  const detached = summary.newDetachedStyles.length;
  const images = summary.changedImageRefs.length;
  if (newFrames === 0 && detached === 0 && images === 0) return [];

  const detachedBreakdown = summarizeDetachedByKind(summary);
  const detachedSuffix = detachedBreakdown ? ` (${detachedBreakdown})` : '';

  return [
    '## 변경 분류',
    '',
    `- ${CATEGORY_EMOJI['new-frame']} ${CATEGORY_LABEL_KO['new-frame']}: ${newFrames}건`,
    `- ${CATEGORY_EMOJI['detached-style']} ${CATEGORY_LABEL_KO['detached-style']}: ${detached}건${detachedSuffix}`,
    `- ${CATEGORY_EMOJI['image-change']} ${CATEGORY_LABEL_KO['image-change']}: ${images}건`,
    '',
  ];
}

function summarizeDetachedByKind(summary: ComplianceDiffSummary): string {
  const counts: Record<string, number> = {};
  for (const e of summary.newDetachedStyles) {
    counts[e.kind] = (counts[e.kind] ?? 0) + 1;
  }
  const parts = Object.entries(counts).map(([kind, n]) => {
    const label = DETACHED_STYLE_KIND_LABEL_KO[kind as keyof typeof DETACHED_STYLE_KIND_LABEL_KO] ?? kind;
    return `${label} ${n}`;
  });
  return parts.join(', ');
}

function renderComplianceSections(summary: ComplianceDiffSummary | undefined): string[] {
  if (!summary) return [];
  const lines: string[] = [];

  if (summary.newDetachedStyles.length > 0) {
    lines.push(`## ${CATEGORY_EMOJI['detached-style']} ${CATEGORY_LABEL_KO['detached-style']} (Detached Styles)`, '');
    lines.push('| 노드 | 종류 | 속성 | 입력값 |', '|---|---|---|---|');
    for (const e of summary.newDetachedStyles) {
      const path = e.nodePath.join(' › ');
      const raw = typeof e.rawValue === 'object' ? JSON.stringify(e.rawValue) : String(e.rawValue);
      const kindKo = DETACHED_STYLE_KIND_LABEL_KO[e.kind] ?? e.kind;
      lines.push(
        [
          `${e.nodeName} (${e.nodeId})<br><sub>${path}</sub>`,
          kindKo,
          e.property,
          raw,
        ]
          .map(escapeTableCell)
          .join(' | ')
          .replace(/^/, '| ')
          .replace(/$/, ' |')
      );
    }
    lines.push('');
  }

  if (summary.newFrames.length > 0) {
    lines.push(`## ${CATEGORY_EMOJI['new-frame']} ${CATEGORY_LABEL_KO['new-frame']} (등록된 화면 안)`, '');
    lines.push('| 프레임 | 상위 등록 화면 | 경로 |', '|---|---|---|');
    for (const f of summary.newFrames) {
      lines.push(
        [
          `${f.name} (${f.nodeId})`,
          f.parentRegisteredKey,
          f.nodePath.join(' › '),
        ]
          .map(escapeTableCell)
          .join(' | ')
          .replace(/^/, '| ')
          .replace(/$/, ' |')
      );
    }
    lines.push('');
  }

  if (summary.changedImageRefs.length > 0) {
    lines.push(`## ${CATEGORY_EMOJI['image-change']} ${CATEGORY_LABEL_KO['image-change']}`, '');
    lines.push('| 노드 | paintIndex | 이전 ref | 현재 ref |', '|---|---|---|---|');
    for (const c of summary.changedImageRefs) {
      const node = c.after;
      lines.push(
        [
          `${node.nodeName} (${node.nodeId})<br><sub>${node.nodePath.join(' › ')}</sub>`,
          String(node.paintIndex),
          c.before?.ref ?? '(없음)',
          c.after.ref,
        ]
          .map(escapeTableCell)
          .join(' | ')
          .replace(/^/, '| ')
          .replace(/$/, ' |')
      );
    }
    lines.push('');
  }

  return lines;
}

function serializeReport(frontmatter: ReviewFrontmatter, body: string): string {
  return [
    '---',
    `changeSetId: ${frontmatter.changeSetId}`,
    `status: ${frontmatter.status}`,
    `approvedBy: ${frontmatter.approvedBy}`,
    `approvedAt: ${frontmatter.approvedAt}`,
    `reportSha256: ${frontmatter.reportSha256}`,
    `artifactsSha256: ${frontmatter.artifactsSha256}`,
    `rejectReason: ${frontmatter.rejectReason}`,
    `generatedAt: ${frontmatter.generatedAt}`,
    '---',
    body,
  ].join('\n');
}

function parseFrontmatter(raw: string): ReviewFrontmatter {
  const fields = new Map<string, string>();
  for (const line of raw.split('\n')) {
    const index = line.indexOf(':');
    if (index === -1) {
      continue;
    }
    fields.set(line.slice(0, index).trim(), line.slice(index + 1).trim());
  }

  const status = required(fields, 'status');
  if (status !== 'pending' && status !== 'approved' && status !== 'rejected') {
    throw new Error(`Unsupported review status: ${status}`);
  }

  return {
    changeSetId: required(fields, 'changeSetId'),
    status,
    approvedBy: required(fields, 'approvedBy'),
    approvedAt: required(fields, 'approvedAt'),
    reportSha256: required(fields, 'reportSha256'),
    artifactsSha256: required(fields, 'artifactsSha256'),
    rejectReason: required(fields, 'rejectReason'),
    generatedAt: required(fields, 'generatedAt'),
  };
}

function required(fields: Map<string, string>, key: string): string {
  const value = fields.get(key);
  if (!value) {
    throw new Error(`Review report frontmatter missing '${key}'`);
  }
  return value;
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}
