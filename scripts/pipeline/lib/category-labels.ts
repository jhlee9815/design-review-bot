// Single source of truth for Korean labels of the compliance / change classes.
// Both the markdown report (designer-review.ts) and the HTML viewer
// (viewer-generator.ts) translate raw classes (e.g. `detached-style`) through
// this map so the designer sees one consistent vocabulary across Slack, Issue,
// and viewer.

import type { ComplianceSubcategory, DetachedStyleKind } from './compliance-types.ts';

export const CATEGORY_LABEL_KO: Record<ComplianceSubcategory, string> = {
  'text-change': '텍스트 변경',
  'props-change': '속성 변경',
  'image-change': '이미지 변경',
  'detached-style': '디자인 시스템 미사용',
  'new-frame': '새 화면 추가',
};

export const CATEGORY_EMOJI: Record<ComplianceSubcategory, string> = {
  'text-change': '✏️',
  'props-change': '🧩',
  'image-change': '🖼️',
  'detached-style': '🎨',
  'new-frame': '🆕',
};

export const DETACHED_STYLE_KIND_LABEL_KO: Record<DetachedStyleKind, string> = {
  color: '색상',
  typography: '타이포',
  effect: '효과',
};

// Fallback: when a tag from `change.classes[]` doesn't map to a known
// ComplianceSubcategory (older snapshots may emit ad-hoc class names), pass
// the raw value through so we don't silently lose information in the viewer.
export function labelForClass(raw: string): string {
  return (CATEGORY_LABEL_KO as Record<string, string>)[raw] ?? raw;
}

export function emojiForClass(raw: string): string {
  return (CATEGORY_EMOJI as Record<string, string>)[raw] ?? '•';
}
