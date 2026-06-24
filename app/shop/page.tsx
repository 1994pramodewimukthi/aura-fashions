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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
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

  const filtered = products.filter(p => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <h1 className="font-display text-4xl md:text-6xl mb-8">Shop</h1>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="flex flex-wrap gap-3">
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

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-ink/20 rounded-full px-5 py-2 text-sm bg-transparent outline-none focus:border-ink w-full sm:w-auto"
          />
          <div className="relative w-full sm:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full border border-ink/20 rounded-full px-5 py-2 text-sm bg-transparent outline-none focus:border-ink appearance-none pr-10 cursor-pointer"
            >
              <option value="newest" className="bg-[#111110] text-[#F1ECE2]">Newest Arrivals</option>
              <option value="price-asc" className="bg-[#111110] text-[#F1ECE2]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#111110] text-[#F1ECE2]">Price: High to Low</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs">▼</div>
          </div>
        </div>
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
