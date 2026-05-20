export interface MissingMarkerFollowUp {
  kind: 'text' | 'component-props';
  code: string;
  nodeIds: string[];
}

export interface ApplyReportInput {
  changeSetId: string;
  classifiedPath: string;
  status: 'noop' | 'applied';
  changedFiles: string[];
  message: string;
  missingMarkers?: MissingMarkerFollowUp[];
}

export function renderApplyReport(input: ApplyReportInput): string {
  const missingMarkers = input.missingMarkers ?? [];
  return [
    '---',
    `changeSetId: ${input.changeSetId}`,
    `status: ${input.status}`,
    `classifiedPath: ${input.classifiedPath}`,
    '---',
    '',
    '# Apply Report',
    '',
    input.message,
    '',
    '## Changed Files',
    '',
    ...(input.changedFiles.length > 0 ? input.changedFiles.map(file => `- \`${file}\``) : ['- None']),
    '',
    '## Manual Follow-up',
    '',
    ...(missingMarkers.length > 0
      ? [
          'The following auto-apply candidates could not be patched because no matching source marker was found.',
          '',
          '| Kind | Code | Node IDs | Reason |',
          '|---|---|---|---|',
          ...missingMarkers.map(item =>
            [
              item.kind,
              `\`${item.code}\``,
              item.nodeIds.map(nodeId => `\`${nodeId}\``).join(', '),
              'No marker found',
            ]
              .map(escapeTableCell)
              .join(' | ')
              .replace(/^/, '| ')
              .replace(/$/, ' |')
          ),
        ]
      : ['- None']),
    '',
  ].join('\n');
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}
