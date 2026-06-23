'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import type { Product } from '@/lib/types';

export function AddToCartPanel({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addLine = useCart((s) => s.addLine);

  function handleAdd() {
    addLine({
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      color,
      quantity,
      image: product.images[0]
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest2 text-steel mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                size === s ? 'bg-ink text-bone border-ink' : 'border-ink/20 hover:border-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest2 text-steel mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                color === c ? 'bg-ink text-bone border-ink' : 'border-ink/20 hover:border-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest2 text-steel mb-2">Quantity</p>
        <div className="flex items-center gap-4 border border-ink/20 rounded-full w-fit px-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-lg"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAdd}
        className="w-full font-display uppercase tracking-widest2 text-sm bg-ink text-bone rounded-full py-4 hover:bg-clay transition-colors"
      >
        {added ? 'Added to bag ✓' : 'Add to Bag'}
      </motion.button>
    </div>
  );
}
