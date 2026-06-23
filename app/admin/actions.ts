'use server';

import { readStore, writeStore, slugify } from '@/lib/data';
import type { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
  const store = readStore();
  return store.products;
}

export async function addProduct(data: Partial<Product>) {
  const store = readStore();
  const newProduct: Product = {
    id: Math.random().toString(36).substring(2, 11),
    slug: slugify(data.name || ''),
    name: data.name || '',
    category: data.category || 'Men',
    subCategory: data.subCategory || '',
    price: Number(data.price) || 0,
    description: data.description || '',
    images: data.images?.length ? data.images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop'],
    sizes: data.sizes?.length ? data.sizes : ['S', 'M', 'L'],
    colors: data.colors?.length ? data.colors : ['Black'],
    stock: Number(data.stock) || 10,
    featured: Boolean(data.featured)
  };
  
  store.products.push(newProduct);
  writeStore(store);
  revalidatePath('/');
  revalidatePath('/admin');
  return newProduct;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const store = readStore();
  const index = store.products.findIndex(p => p.id === id);
  if (index !== -1) {
    store.products[index] = { 
      ...store.products[index], 
      ...data, 
      price: Number(data.price), 
      stock: Number(data.stock) 
    };
    if (data.name) store.products[index].slug = slugify(data.name);
    writeStore(store);
    revalidatePath('/');
    revalidatePath('/admin');
  }
}

export async function deleteProduct(id: string) {
  const store = readStore();
  store.products = store.products.filter(p => p.id !== id);
  writeStore(store);
  revalidatePath('/');
  revalidatePath('/admin');
}
