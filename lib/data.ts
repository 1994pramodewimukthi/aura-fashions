import fs from 'fs';
import path from 'path';
import type { StoreData } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'store.json');

export function readStore(): StoreData {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as StoreData;
}

export function writeStore(data: StoreData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
