'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine } from './types';

interface CartState {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (line) =>
        set((state) => {
          const existingIndex = state.lines.findIndex(
            (l) => l.productId === line.productId && l.size === line.size && l.color === line.color
          );
          if (existingIndex >= 0) {
            const next = [...state.lines];
            next[existingIndex] = {
              ...next[existingIndex],
              quantity: next[existingIndex].quantity + line.quantity
            };
            return { lines: next };
          }
          return { lines: [...state.lines, line] };
        }),
      removeLine: (index) =>
        set((state) => ({ lines: state.lines.filter((_, i) => i !== index) })),
      updateQuantity: (index, quantity) =>
        set((state) => {
          const next = [...state.lines];
          if (next[index]) next[index] = { ...next[index], quantity: Math.max(1, quantity) };
          return { lines: next };
        }),
      clear: () => set({ lines: [] }),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      totalPrice: () => get().lines.reduce((sum, l) => sum + l.quantity * l.price, 0)
    }),
    { name: 'buchas-cart' }
  )
);
