'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-store';

export function Navbar() {
  const totalItems = useCart((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-bone/95 backdrop-blur border-b border-ink/10 group/header">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between relative">
        <Link href="/" className="font-display text-2xl tracking-wide z-10 relative">
          BUCHA&apos;S
        </Link>
        
        <nav className="hidden md:flex items-center h-full gap-8 text-sm uppercase tracking-widest2">
          {/* Shop with Mega Menu */}
          <div className="group/shop h-full flex items-center">
            <Link href="/shop" className="hover:text-clay transition-colors flex items-center h-full z-10 relative">
              Shop
            </Link>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-0 w-full bg-bone border-b border-ink/10 shadow-2xl opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-300 ease-out z-0 transform -translate-y-2 group-hover/shop:translate-y-0 origin-top">
              <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex gap-16">
                
                {/* Navigation Columns */}
                <div className="flex-[2] grid grid-cols-3 gap-8 border-r border-ink/10 pr-8">
                  <div>
                    <h4 className="font-display text-lg mb-6 text-ink/50">Men</h4>
                    <ul className="space-y-4 font-body normal-case tracking-normal text-base text-ink">
                      <li><Link href="/shop?category=Men" className="hover:text-clay transition-colors block">All Men</Link></li>
                      <li><Link href="/shop?category=Men&sub=Oversized Tees" className="hover:text-clay transition-colors block">Oversized Tees</Link></li>
                      <li><Link href="/shop?category=Men&sub=Jackets" className="hover:text-clay transition-colors block">Jackets</Link></li>
                      <li><Link href="/shop?category=Men&sub=Trousers" className="hover:text-clay transition-colors block">Trousers</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display text-lg mb-6 text-ink/50">Women</h4>
                    <ul className="space-y-4 font-body normal-case tracking-normal text-base text-ink">
                      <li><Link href="/shop?category=Women" className="hover:text-clay transition-colors block">All Women</Link></li>
                      <li><Link href="/shop?category=Women&sub=Dresses" className="hover:text-clay transition-colors block">Dresses</Link></li>
                      <li><Link href="/shop?category=Women&sub=Tops" className="hover:text-clay transition-colors block">Tops</Link></li>
                      <li><Link href="/shop?category=Women&sub=Co-ords" className="hover:text-clay transition-colors block">Co-ords</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display text-lg mb-6 text-ink/50">Accessories</h4>
                    <ul className="space-y-4 font-body normal-case tracking-normal text-base text-ink">
                      <li><Link href="/shop?category=Accessories" className="hover:text-clay transition-colors block">All Accessories</Link></li>
                      <li><Link href="/shop?category=Accessories&sub=Caps" className="hover:text-clay transition-colors block">Caps</Link></li>
                      <li><Link href="/shop?category=Accessories&sub=Bags" className="hover:text-clay transition-colors block">Bags</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Featured Products Showcase */}
                <div className="flex-[3] grid grid-cols-2 gap-8">
                  <Link href="/product/ash-oversized-tee" className="group/item block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-ink/5 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop" 
                        alt="Ash Oversized Tee" 
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4 bg-bone text-ink text-xs px-2 py-1 uppercase tracking-widest font-display">Featured</div>
                    </div>
                    <h5 className="font-display text-base group-hover/item:text-clay transition-colors">Ash Oversized Tee</h5>
                    <p className="font-body normal-case text-sm text-ink/60 mt-1 tracking-normal">Heavyweight 280gsm cotton</p>
                  </Link>
                  <Link href="/product/clay-field-jacket" className="group/item block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-ink/5 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop" 
                        alt="Clay Field Jacket" 
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <h5 className="font-display text-base group-hover/item:text-clay transition-colors">Clay Field Jacket</h5>
                    <p className="font-body normal-case text-sm text-ink/60 mt-1 tracking-normal">Cotton-canvas with brass hardware</p>
                  </Link>
                </div>

              </div>
            </div>
          </div>

          <Link href="/shop?category=Men" className="hover:text-clay transition-colors h-full flex items-center z-10 relative">
            Men
          </Link>
          <Link href="/shop?category=Women" className="hover:text-clay transition-colors h-full flex items-center z-10 relative">
            Women
          </Link>
          <Link href="/shop?category=Accessories" className="hover:text-clay transition-colors h-full flex items-center z-10 relative">
            Accessories
          </Link>
        </nav>

        <div className="flex items-center gap-4 z-20 relative">
          <Link
            href="/cart"
            className="relative font-display text-sm uppercase tracking-widest2 border border-ink rounded-full px-5 py-2 hover:bg-ink hover:text-bone transition-colors"
          >
            Cart
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-clay text-bone text-xs rounded-full w-5 h-5 flex items-center justify-center font-body">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-ink hover:text-clay transition-colors flex items-center justify-center"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-20 bg-bone z-40 md:hidden flex flex-col overflow-y-auto border-t border-ink/10 transition-all duration-300 ease-out">
            <div className="flex-1 px-6 py-10 flex flex-col justify-between">
              <nav className="flex flex-col gap-8 text-2xl font-display uppercase tracking-wider">
                <Link 
                  href="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-clay transition-colors py-2 border-b border-ink/5"
                >
                  Shop All
                </Link>
                
                {/* Men Section */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-steel uppercase tracking-widest2">Men</span>
                  <div className="flex flex-col gap-3 pl-4 font-body text-lg normal-case tracking-normal text-ink">
                    <Link href="/shop?category=Men" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">All Men</Link>
                    <Link href="/shop?category=Men&sub=Oversized Tees" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">Oversized Tees</Link>
                    <Link href="/shop?category=Men&sub=Jackets" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">Jackets</Link>
                    <Link href="/shop?category=Men&sub=Trousers" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">Trousers</Link>
                  </div>
                </div>

                {/* Women Section */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-steel uppercase tracking-widest2">Women</span>
                  <div className="flex flex-col gap-3 pl-4 font-body text-lg normal-case tracking-normal text-ink">
                    <Link href="/shop?category=Women" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">All Women</Link>
                    <Link href="/shop?category=Women&sub=Dresses" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">Dresses</Link>
                    <Link href="/shop?category=Women&sub=Tops" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">Tops</Link>
                    <Link href="/shop?category=Women&sub=Co-ords" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">Co-ords</Link>
                  </div>
                </div>

                {/* Accessories Section */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-steel uppercase tracking-widest2">Accessories</span>
                  <div className="flex flex-col gap-3 pl-4 font-body text-lg normal-case tracking-normal text-ink">
                    <Link href="/shop?category=Accessories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">All Accessories</Link>
                    <Link href="/shop?category=Accessories&sub=Caps" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">Caps</Link>
                    <Link href="/shop?category=Accessories&sub=Bags" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-clay transition-colors">Bags</Link>
                  </div>
                </div>
              </nav>

              <div className="mt-12 pt-8 border-t border-ink/10 text-xs text-steel uppercase tracking-widest2 flex flex-col gap-2">
                <p>No. 14, Galle Road, Colombo 03</p>
                <p>+94 77 000 0000</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
