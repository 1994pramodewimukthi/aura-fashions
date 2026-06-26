import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/data';
import { ADMIN_COOKIE } from '@/lib/auth';

export async function GET(req: NextRequest) {
  req.cookies.get('dummy-no-cache');
  const store = readStore();
  return NextResponse.json({ settings: store.settings, categories: store.categories });
}

export async function PUT(req: NextRequest) {
  const session = req.cookies.get(ADMIN_COOKIE);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const store = readStore();

  if (body.settings) store.settings = { ...store.settings, ...body.settings };
  if (body.categories) store.categories = body.categories;

  writeStore(store);
  return NextResponse.json({ settings: store.settings, categories: store.categories });
}
