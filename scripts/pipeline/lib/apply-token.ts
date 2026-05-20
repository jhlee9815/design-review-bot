import type { ClassifiedDiffFile } from './classify-diff.ts';

export function shouldApplyTokens(classified: ClassifiedDiffFile): boolean {
  return classified.changes.some(
    change =>
      change.key === 'tokens' &&
      change.decision === 'auto-apply' &&
      change.classes.includes('token') &&
      change.target.section === 'tokens'
  );
}
