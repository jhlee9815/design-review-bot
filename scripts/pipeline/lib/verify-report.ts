export type ApplyStatus = 'noop' | 'applied';
export type CheckStatus = 'passed' | 'failed' | 'skipped';
export type VerifyStatus = 'passed' | 'failed';

export interface ApplyReportMetadata {
  path: string;
  changeSetId: string;
  status: ApplyStatus;
  classifiedPath: string;
}

export interface VerificationCheck {
  name: string;
  command: string;
  status: CheckStatus;
  exitCode?: number;
  message?: string;
}

export interface VerificationSummary {
  apply: ApplyReportMetadata;
  status: VerifyStatus;
  generatedAt: string;
  checks: VerificationCheck[];
  blockingFailures: number;
  skipped: number;
}

export function parseApplyReport(markdown: string, path: string): ApplyReportMetadata {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    throw new Error(`Apply report missing frontmatter: ${path}`);
  }

  const fields = new Map<string, string>();
  for (const line of frontmatter[1].split('\n')) {
    const index = line.indexOf(':');
    if (index === -1) {
      continue;
    }
    fields.set(line.slice(0, index).trim(), line.slice(index + 1).trim());
  }

  const changeSetId = fields.get('changeSetId');
  const status = fields.get('status');
  const classifiedPath = fields.get('classifiedPath');

  if (!changeSetId || !status || !classifiedPath) {
    throw new Error(`Apply report frontmatter missing required fields: ${path}`);
  }
  if (status !== 'noop' && status !== 'applied') {
    throw new Error(`Unsupported apply status '${status}' in ${path}`);
  }

  return {
    path,
    changeSetId,
    status,
    classifiedPath,
  };
}

export function summarizeVerification(input: {
  apply: ApplyReportMetadata;
  checks: VerificationCheck[];
  generatedAt?: string;
}): VerificationSummary {
  const blockingFailures = input.checks.filter(check => check.status === 'failed').length;
  const skipped = input.checks.filter(check => check.status === 'skipped').length;

  return {
    apply: input.apply,
    status: blockingFailures > 0 ? 'failed' : 'passed',
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    checks: input.checks,
    blockingFailures,
    skipped,
  };
}

export function renderVerifyReport(summary: VerificationSummary): string {
  return [
    '---',
    `changeSetId: ${summary.apply.changeSetId}`,
    `status: ${summary.status}`,
    `applyStatus: ${summary.apply.status}`,
    `applyReport: ${summary.apply.path}`,
    `classifiedPath: ${summary.apply.classifiedPath}`,
    `generatedAt: ${summary.generatedAt}`,
    '---',
    '',
    '# Verify Report',
    '',
    `Overall status: **${summary.status}**`,
    '',
    '| Check | Command | Status | Exit | Message |',
    '|---|---|---|---:|---|',
    ...summary.checks.map(renderCheckRow),
    '',
  ].join('\n');
}

function renderCheckRow(check: VerificationCheck): string {
  return [
    check.name,
    `\`${check.command}\``,
    check.status,
    check.exitCode === undefined ? '' : String(check.exitCode),
    check.message ?? '',
  ]
    .map(escapeTableCell)
    .join(' | ')
    .replace(/^/, '| ')
    .replace(/$/, ' |');
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}
