import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import type { FigmaMapping } from './config-loader.ts';

export interface ScreenTarget {
  key: string;
  route: string;
  fileName: string;
}

export interface PngCompareOptions {
  threshold: number;
  maxDiffRatio?: number;
}

export interface PngCompareResult {
  changedPixels: number;
  totalPixels: number;
  diffRatio: number;
  passed: boolean;
  diffPng: Buffer;
}

export interface VisualDiffResult {
  key: string;
  route: string;
  status: 'passed' | 'failed' | 'missing-baseline';
  diffRatio: number;
  changedPixels: number;
  totalPixels: number;
  beforePath: string;
  afterPath: string;
  diffPath: string;
  message?: string;
}

export interface VisualDiffReportInput {
  changeSetId: string;
  threshold: number;
  results: VisualDiffResult[];
}

export function collectScreenTargets(mapping: FigmaMapping): ScreenTarget[] {
  return Object.entries(mapping.screens)
    .filter(([, entry]) => typeof entry.route === 'string' && entry.route.length > 0)
    .map(([key, entry]) => ({
      key,
      route: entry.route as string,
      fileName: `${key}.png`,
    }));
}

export function comparePngBuffers(
  beforeBuffer: Buffer,
  afterBuffer: Buffer,
  options: PngCompareOptions
): PngCompareResult {
  const before = PNG.sync.read(beforeBuffer);
  const after = PNG.sync.read(afterBuffer);

  if (before.width !== after.width || before.height !== after.height) {
    throw new Error(
      `PNG dimensions differ: before=${before.width}x${before.height}, after=${after.width}x${after.height}`
    );
  }

  const diff = new PNG({ width: before.width, height: before.height });
  const changedPixels = pixelmatch(
    before.data,
    after.data,
    diff.data,
    before.width,
    before.height,
    { threshold: options.threshold }
  );
  const totalPixels = before.width * before.height;
  const diffRatio = totalPixels === 0 ? 0 : changedPixels / totalPixels;

  return {
    changedPixels,
    totalPixels,
    diffRatio,
    passed: diffRatio <= (options.maxDiffRatio ?? 0.01),
    diffPng: PNG.sync.write(diff),
  };
}

export function comparePngFiles(input: {
  key: string;
  route: string;
  beforePath: string;
  afterPath: string;
  diffPath: string;
  threshold: number;
  maxDiffRatio: number;
}): VisualDiffResult {
  const result = comparePngBuffers(readFileSync(input.beforePath), readFileSync(input.afterPath), {
    threshold: input.threshold,
    maxDiffRatio: input.maxDiffRatio,
  });

  mkdirSync(dirname(input.diffPath), { recursive: true });
  writeFileSync(input.diffPath, result.diffPng);

  return {
    key: input.key,
    route: input.route,
    status: result.passed ? 'passed' : 'failed',
    diffRatio: result.diffRatio,
    changedPixels: result.changedPixels,
    totalPixels: result.totalPixels,
    beforePath: input.beforePath,
    afterPath: input.afterPath,
    diffPath: input.diffPath,
  };
}

export function renderVisualDiffMarkdown(input: VisualDiffReportInput): string {
  const failed = input.results.filter(result => result.status !== 'passed').length;
  const lines = [
    '# Visual Diff Report',
    '',
    `Change set: \`${input.changeSetId}\``,
    `Threshold: \`${formatPercent(input.threshold)}\``,
    `Status: \`${failed === 0 ? 'passed' : 'failed'}\``,
    '',
    '| Target | Route | Status | Diff | Pixels | Before | After | Diff Image | Message |',
    '|---|---|---|---:|---:|---|---|---|---|',
  ];

  for (const result of input.results) {
    lines.push(
      [
        result.key,
        `\`${result.route}\``,
        result.status,
        formatPercent(result.diffRatio),
        `${result.changedPixels}/${result.totalPixels}`,
        pathCell(result.beforePath),
        pathCell(result.afterPath),
        pathCell(result.diffPath),
        result.message ?? '',
      ]
        .map(escapeTableCell)
        .join(' | ')
        .replace(/^/, '| ')
        .replace(/$/, ' |')
    );
  }

  lines.push('');
  return lines.join('\n');
}

export function visualReportPaths(reportRoot: string, target: ScreenTarget): {
  beforePath: string;
  afterPath: string;
  diffPath: string;
} {
  return {
    beforePath: resolve(reportRoot, 'before', target.fileName),
    afterPath: resolve(reportRoot, 'after', target.fileName),
    diffPath: resolve(reportRoot, 'diff', target.fileName),
  };
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function pathCell(path: string): string {
  return path ? `\`${path}\`` : '';
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}
