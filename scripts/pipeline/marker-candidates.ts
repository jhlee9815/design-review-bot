import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, relative, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger } from './lib/logger.ts';
import { loadFigmaMapping, resolveCodePath, type MappingEntry } from './lib/config-loader.ts';
import { extractCodeTextCandidates, matchFigmaTextsToCode, type TextMarkerMatch } from './lib/code-candidates.ts';
import type { SnapshotNodeEntry } from './lib/snapshot-node.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const SNAPSHOTS_DIR = resolve(REPO_ROOT, '.automation/snapshots');
const REPORTS_DIR = resolve(REPO_ROOT, '.automation/reports');

const logger = createLogger('marker-candidates');

interface SnapshotFile {
  fileKey: string;
  timestamp: string;
  source: 'figma-rest';
  tokensHash: string;
  nodes: Record<string, SnapshotNodeEntry>;
}

interface MappingTuple {
  section: 'components' | 'compositions' | 'screens';
  key: string;
  entry: MappingEntry;
}

interface EntryReport {
  section: string;
  key: string;
  figmaNodeName: string;
  codePath: string;
  apply: string;
  matches: TextMarkerMatch[];
}

function main(): void {
  logger.info('Starting marker-candidates.ts — read-only text marker inventory');

  const mapping = loadFigmaMapping();
  const snapshot = loadLatestSnapshot();
  const entries = collectMappingEntries(mapping);

  const reports: EntryReport[] = [];

  for (const { section, key, entry } of entries) {
    const node = snapshot.nodes[key];
    if (!node || node.texts.length === 0) {
      continue;
    }

    const codeAbsPath = resolveCodePath(entry.code);
    if (!existsSync(codeAbsPath)) {
      logger.warn(`[${key}] code file missing: ${codeAbsPath}`);
      continue;
    }

    const sourceText = readFileSync(codeAbsPath, 'utf-8');
    const codePath = relative(REPO_ROOT, codeAbsPath);
    const candidates = extractCodeTextCandidates(sourceText, codePath);
    const matches = matchFigmaTextsToCode(node.texts, candidates);

    reports.push({
      section,
      key,
      figmaNodeName: node.name,
      codePath,
      apply: entry.automation.apply,
      matches,
    });
  }

  const markdown = renderReport(snapshot, reports);
  mkdirSync(REPORTS_DIR, { recursive: true });

  const timestamp = new Date().toISOString();
  const safeTs = timestamp.replace(/:/g, '-').replace(/\..+$/, '');
  const outputPath = resolve(REPORTS_DIR, `marker-candidates-${safeTs}.md`);
  writeFileSync(outputPath, markdown, 'utf-8');

  logger.success(`Marker candidate report written: ${outputPath}`);
  logger.info(`Entries reported: ${reports.length}`);
}

function loadLatestSnapshot(): SnapshotFile {
  const files = readdirSync(SNAPSHOTS_DIR)
    .filter(file => file.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    throw new Error(`No snapshot files found in ${SNAPSHOTS_DIR}. Run npm run figma:snapshot first.`);
  }

  const latestPath = resolve(SNAPSHOTS_DIR, files[0]);
  logger.info(`Using snapshot: ${latestPath}`);
  return JSON.parse(readFileSync(latestPath, 'utf-8')) as SnapshotFile;
}

function collectMappingEntries(mapping: ReturnType<typeof loadFigmaMapping>): MappingTuple[] {
  return [
    ...Object.entries(mapping.components).map(([key, entry]) => ({
      section: 'components' as const,
      key,
      entry,
    })),
    ...Object.entries(mapping.compositions).map(([key, entry]) => ({
      section: 'compositions' as const,
      key,
      entry,
    })),
    ...Object.entries(mapping.screens).map(([key, entry]) => ({
      section: 'screens' as const,
      key,
      entry,
    })),
  ];
}

function renderReport(snapshot: SnapshotFile, reports: EntryReport[]): string {
  const totals = summarizeReports(reports);
  const lines: string[] = [
    '# Figma Text Marker Candidates',
    '',
    `Snapshot: \`${basename(snapshot.timestamp)}\``,
    `Generated: \`${new Date().toISOString()}\``,
    '',
    'This is a read-only inventory. Use it to decide where to add `figma:text` markers before enabling M2 text auto-apply.',
    '',
    '## Summary',
    '',
    '| Metric | Count |',
    '|---|---:|',
    `| Entries with text | ${reports.length} |`,
    `| Figma text leaves | ${totals.total} |`,
    `| Matched exactly | ${totals.matched} |`,
    `| Ambiguous | ${totals.ambiguous} |`,
    `| Missing code candidate | ${totals.missing} |`,
    '',
    '## Entries',
    '',
  ];

  for (const report of reports) {
    const summary = summarizeMatches(report.matches);
    lines.push(
      `### ${report.section}.${report.key}`,
      '',
      `- Figma node: \`${report.figmaNodeName}\``,
      `- Code: \`${report.codePath}\``,
      `- Current apply mode: \`${report.apply}\``,
      `- Text leaves: ${summary.total}, matched: ${summary.matched}, ambiguous: ${summary.ambiguous}, missing: ${summary.missing}`,
      '',
      '| Status | Figma value | Figma leaf | Code candidates | Suggested marker |',
      '|---|---|---|---|---|'
    );

    for (const match of report.matches) {
      lines.push(renderMatchRow(report.key, match));
    }

    lines.push('');
  }

  return lines.join('\n');
}

function renderMatchRow(entryKey: string, match: TextMarkerMatch): string {
  const figma = match.figmaText;
  const code = match.codeCandidates
    .map(candidate => `${candidate.file}:${candidate.line} (${candidate.context})`)
    .join('<br>');
  const suggestedId = `${entryKey}.${slugify(figma.path.at(-1) ?? figma.nodeName)}`;
  const suggestedMarker = `figma:text id="${suggestedId}" node="${figma.nodeId}"`;

  return [
    match.status,
    escapeTableCell(figma.value),
    escapeTableCell(`${figma.path.join(' / ')} (${figma.nodeId})`),
    escapeTableCell(code || '-'),
    escapeTableCell(suggestedMarker),
  ].join(' | ').replace(/^/, '| ').replace(/$/, ' |');
}

function summarizeReports(reports: EntryReport[]): ReturnType<typeof summarizeMatches> {
  return summarizeMatches(reports.flatMap(report => report.matches));
}

function summarizeMatches(matches: TextMarkerMatch[]): {
  total: number;
  matched: number;
  ambiguous: number;
  missing: number;
} {
  return {
    total: matches.length,
    matched: matches.filter(match => match.status === 'matched').length,
    ambiguous: matches.filter(match => match.status === 'ambiguous').length,
    missing: matches.filter(match => match.status === 'missing-code-candidate').length,
  };
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .replace(/[‘’]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return slug || 'text';
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

main();
