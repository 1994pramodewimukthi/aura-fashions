'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/types';

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <h1 className="font-display text-4xl md:text-6xl mb-8">Shop</h1>

      <div className="flex flex-wrap gap-3 mb-12">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-sm uppercase tracking-widest2 rounded-full px-5 py-2 border transition-colors ${
            !activeCategory ? 'bg-ink text-bone border-ink' : 'border-ink/20 hover:border-ink'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm uppercase tracking-widest2 rounded-full px-5 py-2 border transition-colors ${
              activeCategory === cat ? 'bg-ink text-bone border-ink' : 'border-ink/20 hover:border-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-steel">Loading the rack…</p>
      ) : filtered.length === 0 ? (
        <p className="text-steel">Nothing here yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
