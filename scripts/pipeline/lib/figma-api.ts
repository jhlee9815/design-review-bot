export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

export interface FigmaFileResponse {
  name: string;
  document: FigmaNode;
}

export class FigmaApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FigmaApiError';
  }
}

interface FetchFigmaJsonOptions {
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  maxAttempts?: number;
}

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

export async function fetchFigmaJson<T>(
  url: string,
  options: FetchFigmaJsonOptions = {}
): Promise<T> {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new FigmaApiError('FIGMA_TOKEN environment variable is not set');
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const sleep = options.sleep ?? defaultSleep;
  const maxAttempts = options.maxAttempts ?? 4;

  let lastError: FigmaApiError | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response: Response;
    try {
      response = await fetchImpl(url, {
        headers: { 'X-Figma-Token': token },
      });
    } catch (err) {
      lastError = new FigmaApiError(`Network error fetching Figma API: ${String(err)}`);
      if (attempt < maxAttempts) {
        await sleep(backoffMs(attempt));
        continue;
      }
      throw lastError;
    }

    if (response.ok) {
      let data: unknown;
      try {
        data = await response.json();
      } catch (err) {
        throw new FigmaApiError(`Failed to parse Figma API response: ${String(err)}`);
      }
      return data as T;
    }

    const body = await safeReadBody(response);
    lastError = new FigmaApiError(
      `Figma API error ${response.status} ${response.statusText}: ${body}`
    );

    if (!RETRYABLE_STATUS.has(response.status) || attempt === maxAttempts) {
      throw lastError;
    }

    await sleep(retryDelayMs(response, attempt));
  }

  throw lastError ?? new FigmaApiError('Figma API request failed');
}

export async function fetchFigmaFile(fileKey: string): Promise<FigmaFileResponse> {
  const url = `https://api.figma.com/v1/files/${fileKey}`;
  return fetchFigmaJson<FigmaFileResponse>(url);
}

export interface FlatNode extends FigmaNode {
  path: string[];
}

export function flattenTree(root: FigmaNode, allowedTypes: string[]): FlatNode[] {
  const result: FlatNode[] = [];

  function traverse(node: FigmaNode, ancestorNames: string[]): void {
    if (allowedTypes.includes(node.type)) {
      result.push({ ...node, path: ancestorNames });
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child, [...ancestorNames, node.name]);
      }
    }
  }

  // Start from document's children to exclude the root document node from path
  if (root.children) {
    for (const child of root.children) {
      traverse(child, []);
    }
  }

  return result;
}

function retryDelayMs(response: Response, attempt: number): number {
  const retryAfter = response.headers.get('retry-after');
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) {
      return Math.max(0, seconds * 1000);
    }
  }
  return backoffMs(attempt);
}

function backoffMs(attempt: number): number {
  return Math.min(1000 * 2 ** (attempt - 1), 8000);
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeReadBody(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '';
  }
}
