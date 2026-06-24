'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function CartPage() {
  const { lines, removeLine, updateQuantity, totalPrice } = useCart();
  const [whatsappNumber, setWhatsappNumber] = useState('94770000000');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setWhatsappNumber(data.settings.whatsappNumber))
      .catch(() => {});
  }, []);

  if (!mounted) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 md:px-10 py-16 min-h-[60vh]">
      <h1 className="font-display text-4xl md:text-6xl mb-10">Your Bag</h1>

      {lines.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-steel mb-6">Your bag is empty.</p>
          <Link
            href="/shop"
            className="font-display uppercase tracking-widest2 text-sm bg-ink text-bone rounded-full px-8 py-4 hover:bg-clay transition-colors"
          >
            Browse the Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {lines.map((line, i) => (
            <div
              key={`${line.productId}-${line.size}-${line.color}`}
              className="flex gap-4 sm:gap-5 items-start sm:items-center border-b border-ink/10 pb-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={line.image} alt={line.name} className="w-20 h-24 sm:w-24 sm:h-28 object-cover bg-ink/5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <p className="font-display text-base sm:text-lg truncate">{line.name}</p>
                    <p className="text-xs uppercase tracking-widest2 text-steel mt-1">
                      {line.color} / {line.size}
                    </p>
                  </div>
                  <p className="font-display text-base sm:text-lg text-clay sm:text-ink shrink-0 mt-1 sm:mt-0">
                    LKR {(line.price * line.quantity).toLocaleString('en-US')}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-3">
                  <div className="flex items-center gap-3 border border-ink/20 rounded-full px-2">
                    <button
                      onClick={() => updateQuantity(i, line.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm">{line.quantity}</span>
                    <button
                      onClick={() => updateQuantity(i, line.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeLine(i)}
                    className="text-xs uppercase tracking-widest2 text-steel hover:text-clay"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <p className="font-display text-2xl">Total</p>
            <p className="font-display text-2xl text-clay">LKR {totalPrice().toLocaleString('en-US')}</p>
          </div>

          <a
            href={buildWhatsAppUrl(lines, whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center font-display uppercase tracking-widest2 text-sm bg-moss text-bone rounded-full py-4 hover:bg-ink transition-colors mt-6"
          >
            Order via WhatsApp
          </a>
          <p className="text-center text-xs text-steel mt-3">
            Opens WhatsApp with your order summary pre-filled. Nothing is charged here.
          </p>
        </div>
      )}
    </main>
  );
}
