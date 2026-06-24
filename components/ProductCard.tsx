'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/types';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-bone border border-ink rounded-full px-3 py-1 -rotate-6 shadow-sm">
            <span className="font-display text-xs">LKR {product.price.toLocaleString('en-US')}</span>
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between">
          <div>
            <p className="font-display text-lg leading-tight">{product.name}</p>
            <p className="text-xs uppercase tracking-widest2 text-steel mt-1">
              {product.category} / {product.subCategory}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
