import fs from 'fs';
import path from 'path';
import type { StoreData } from './types';
import staticStore from '@/data/store.json';

const DATA_PATH = path.join(process.cwd(), 'data', 'store.json');

export function readStore(): StoreData {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      return JSON.parse(raw) as StoreData;
    }
  } catch (err) {
    console.warn("Failed to read store from filesystem, falling back to bundled static store:", err);
  }
  return staticStore as StoreData;
}

export function writeStore(data: StoreData): void {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to write store to filesystem (expected in read-only serverless environments like Vercel):", err);
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
