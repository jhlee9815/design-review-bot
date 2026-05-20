import ts from 'typescript';
import type { SnapshotTextLeaf } from './snapshot-node.ts';

export interface CodeTextCandidate {
  value: string;
  file: string;
  line: number;
  column: number;
  kind: 'jsx-text' | 'jsx-attribute' | 'binding-default' | 'string-literal';
  context: string;
}

export interface TextMarkerMatch {
  figmaText: SnapshotTextLeaf;
  status: 'matched' | 'ambiguous' | 'missing-code-candidate';
  codeCandidates: CodeTextCandidate[];
}

export function extractCodeTextCandidates(
  sourceText: string,
  file: string
): CodeTextCandidate[] {
  const sourceFile = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const candidates: CodeTextCandidate[] = [];

  function visit(node: ts.Node): void {
    if (ts.isJsxText(node)) {
      const value = normalizeWhitespace(node.getText(sourceFile));
      if (value) {
        candidates.push(createCandidate(sourceFile, node, file, value, 'jsx-text', jsxTagContext(node)));
      }
    } else if (isStringLike(node)) {
      const value = node.text;
      if (value) {
        candidates.push(createCandidate(sourceFile, node, file, value, kindForStringNode(node), contextForStringNode(node)));
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return candidates.sort((a, b) => a.line - b.line || a.column - b.column || a.value.localeCompare(b.value));
}

export function matchFigmaTextsToCode(
  figmaTexts: SnapshotTextLeaf[],
  codeCandidates: CodeTextCandidate[]
): TextMarkerMatch[] {
  return figmaTexts.map(figmaText => {
    const target = comparableText(figmaText.value);
    const matches = codeCandidates.filter(candidate => comparableText(candidate.value) === target);

    return {
      figmaText,
      status:
        matches.length === 0
          ? 'missing-code-candidate'
          : matches.length === 1
            ? 'matched'
            : 'ambiguous',
      codeCandidates: matches,
    };
  });
}

function createCandidate(
  sourceFile: ts.SourceFile,
  node: ts.Node,
  file: string,
  value: string,
  kind: CodeTextCandidate['kind'],
  context: string
): CodeTextCandidate {
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return {
    value,
    file,
    line: pos.line + 1,
    column: pos.character + 1,
    kind,
    context,
  };
}

function isStringLike(node: ts.Node): node is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

function kindForStringNode(node: ts.StringLiteral | ts.NoSubstitutionTemplateLiteral): CodeTextCandidate['kind'] {
  if (ts.isJsxAttribute(node.parent)) {
    return 'jsx-attribute';
  }
  if (ts.isJsxExpression(node.parent) && ts.isJsxAttribute(node.parent.parent)) {
    return 'jsx-attribute';
  }
  if (ts.isBindingElement(node.parent) && node.parent.initializer === node) {
    return 'binding-default';
  }
  return 'string-literal';
}

function contextForStringNode(node: ts.StringLiteral | ts.NoSubstitutionTemplateLiteral): string {
  if (ts.isJsxAttribute(node.parent)) {
    return `prop:${node.parent.name.getText()}`;
  }
  if (ts.isJsxExpression(node.parent) && ts.isJsxAttribute(node.parent.parent)) {
    return `prop:${node.parent.parent.name.getText()}`;
  }
  if (ts.isBindingElement(node.parent) && node.parent.initializer === node) {
    return `default:${node.parent.name.getText()}`;
  }
  return 'string-literal';
}

function jsxTagContext(node: ts.Node): string {
  let current: ts.Node | undefined = node.parent;
  while (current) {
    if (ts.isJsxElement(current)) {
      return `jsx:${current.openingElement.tagName.getText()}`;
    }
    current = current.parent;
  }
  return 'jsx';
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function comparableText(value: string): string {
  return normalizeWhitespace(value).replace(/[‘’]/g, "'");
}
