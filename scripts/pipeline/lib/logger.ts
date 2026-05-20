import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const LOGS_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../.automation/logs'
);

function safeTimestamp(): string {
  return new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
}

function ensureLogsDir(): void {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
  }
}

export interface Logger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  success(msg: string): void;
}

export function createLogger(stageName: string): Logger {
  ensureLogsDir();
  const timestamp = safeTimestamp();
  const logFile = resolve(LOGS_DIR, `${stageName}-${timestamp}.log`);

  function write(level: string, msg: string): void {
    const line = `[${new Date().toISOString()}] ${level}: ${msg}`;
    appendFileSync(logFile, line + '\n', 'utf-8');
  }

  return {
    info(msg: string): void {
      console.log(`\x1b[36m[${stageName}] INFO:\x1b[0m ${msg}`);
      write('INFO', msg);
    },
    warn(msg: string): void {
      console.warn(`\x1b[33m[${stageName}] WARN:\x1b[0m ${msg}`);
      write('WARN', msg);
    },
    error(msg: string): void {
      console.error(`\x1b[31m[${stageName}] ERROR:\x1b[0m ${msg}`);
      write('ERROR', msg);
    },
    success(msg: string): void {
      console.log(`\x1b[32m[${stageName}] SUCCESS:\x1b[0m ${msg}`);
      write('SUCCESS', msg);
    },
  };
}
