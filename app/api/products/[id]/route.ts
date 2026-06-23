import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/data';
import { ADMIN_COOKIE } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = readStore();
  const product = store.products.find((p) => p.id === id || p.slug === id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = req.cookies.get(ADMIN_COOKIE);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const store = readStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  store.products[index] = { ...store.products[index], ...body };
  writeStore(store);

  return NextResponse.json(store.products[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = req.cookies.get(ADMIN_COOKIE);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const store = readStore();
  store.products = store.products.filter((p) => p.id !== id);
  writeStore(store);

  return NextResponse.json({ ok: true });
}
