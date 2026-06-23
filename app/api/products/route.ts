import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore, slugify } from '@/lib/data';
import { ADMIN_COOKIE } from '@/lib/auth';
import type { Product } from '@/lib/types';

export async function GET() {
  const store = readStore();
  return NextResponse.json(store.products);
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get(ADMIN_COOKIE);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const store = readStore();

  const newProduct: Product = {
    id: `p-${Date.now()}`,
    slug: slugify(body.name || 'product'),
    name: body.name,
    category: body.category,
    subCategory: body.subCategory,
    price: Number(body.price) || 0,
    description: body.description || '',
    images: body.images?.length ? body.images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop'],
    sizes: body.sizes?.length ? body.sizes : ['One Size'],
    colors: body.colors?.length ? body.colors : ['Default'],
    stock: Number(body.stock) || 0,
    featured: !!body.featured
  };

  store.products.push(newProduct);
  writeStore(store);

  return NextResponse.json(newProduct, { status: 201 });
}
