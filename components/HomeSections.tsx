'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const maskSize = useTransform(scrollYProgress, [0, 1], ["100%", "40%"]);
  const maskRadius = useTransform(scrollYProgress, [0, 1], ["0px", "100px"]);
  const maskY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative h-[115vh] bg-bone">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-bone">
        <motion.div 
          className="absolute z-0 overflow-hidden shadow-2xl"
          style={{
            width: maskSize,
            height: maskSize,
            borderRadius: maskRadius,
            y: maskY,
          }}
        >
          <video 
            src="/003f23ef-e16b-4b8a-8f14-8d183299fc94.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>
        
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 flex flex-col items-center justify-center text-ink text-center px-6 pointer-events-none"
        >
          <h1 className="font-display text-[20vw] md:text-[14vw] leading-[0.8] tracking-tight uppercase drop-shadow-xl">
            Bucha&apos;s
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-2xl font-body font-light tracking-wide drop-shadow-md">
            Heavyweight basics and outerwear, garment-dyed by hand in small batches.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function HorizontalProductRow({ title, products, aspectRatio = "aspect-[3/4]" }: { title: string; products: Product[]; aspectRatio?: string }) {
  return (
    <section className="w-full flex flex-col bg-bone pt-16 pb-8 md:pt-24 md:pb-12 border-b border-ink/10">
      <div className="px-6 md:px-10 mb-8 shrink-0 flex justify-between items-end">
        <h2 className="font-display text-4xl md:text-6xl text-ink uppercase tracking-tight">{title}</h2>
        <Link href="/shop" className="text-sm font-bold uppercase tracking-widest2 text-ink hover:text-clay transition-colors">
          View all →
        </Link>
      </div>
      
      {/* 
        Using native CSS snap scrolling for high performance and mobile-friendliness.
        Hidden scrollbar class is typically added via global css or tailwind plugin.
      */}
      <div className="flex overflow-x-auto gap-6 md:gap-10 px-6 md:px-10 pb-8 snap-x snap-mandatory hide-scrollbar relative">
        {products.map((p, i) => (
          <div key={p.id} className="w-[80vw] md:w-[28vw] shrink-0 snap-center">
            <Link href={`/product/${p.slug}`} className="group block flex flex-col">
              <div className={`relative ${aspectRatio} overflow-hidden bg-ink/5 rounded-lg`}>
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-bone border border-ink rounded-full px-4 py-2 -rotate-3 shadow-md">
                  <span className="font-display text-sm">LKR {p.price.toLocaleString('en-US')}</span>
                </div>
              </div>
              <div className="mt-6 shrink-0 flex justify-between items-start">
                <div>
                  <p className="font-display text-2xl md:text-3xl leading-tight text-ink">{p.name}</p>
                  <p className="text-sm uppercase tracking-widest2 text-steel mt-2">
                    {p.category} / {p.subCategory}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MarqueeProductRow({ title, products, aspectRatio = "aspect-[3/4]" }: { title: string; products: Product[]; aspectRatio?: string }) {
  // Duplicate the products so the marquee fills the screen and loops seamlessly
  const displayProducts = products.length < 4 ? [...products, ...products, ...products, ...products] : [...products, ...products];

  return (
    <section className="w-full flex flex-col bg-bone pt-16 pb-8 md:pt-24 md:pb-12 border-b border-ink/10 overflow-hidden">
      <div className="px-6 md:px-10 mb-8 shrink-0 flex justify-between items-end relative z-10">
        <h2 className="font-display text-4xl md:text-6xl text-ink uppercase tracking-tight">{title}</h2>
        <Link href="/shop" className="text-sm font-bold uppercase tracking-widest2 text-ink hover:text-clay transition-colors">
          View all →
        </Link>
      </div>
      
      <div className="w-full overflow-hidden pb-8 group">
        <div className="marquee-track group-hover:[animation-play-state:paused]" style={{ animationDuration: '30s' }}>
          {[0, 1].map((rep) => (
            <div key={rep} className="flex shrink-0 gap-6 md:gap-10 pr-6 md:pr-10">
              {displayProducts.map((p, i) => (
                <div key={`${p.id}-${rep}-${i}`} className="w-[70vw] md:w-[25vw] shrink-0">
                  <Link href={`/product/${p.slug}`} className="block flex flex-col group/item">
                    <div className={`relative ${aspectRatio} overflow-hidden bg-ink/5 rounded-lg`}>
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-bone border border-ink rounded-full px-4 py-2 -rotate-3 shadow-md opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <span className="font-display text-sm">LKR {p.price.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                    <div className="mt-6 shrink-0 flex justify-between items-start">
                      <div>
                        <p className="font-display text-2xl md:text-3xl leading-tight text-ink group-hover/item:text-clay transition-colors">{p.name}</p>
                        <p className="text-sm uppercase tracking-widest2 text-steel mt-2">
                          {p.category} / {p.subCategory}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BannerSection({ image, title, buttonText, link }: { image: string, title: string, buttonText: string, link: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-bone">
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img src={image} alt={title} className="w-full h-[140%] object-cover object-center -top-[20%] relative opacity-70" />
      </motion.div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-bone/80 via-transparent to-bone/30" />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-ink px-6">
        <h2 className="font-display text-6xl md:text-8xl leading-[0.9] uppercase tracking-tighter mb-10 drop-shadow-lg">
          {title}
        </h2>
        <Link href={link} className="font-display uppercase tracking-widest2 text-sm bg-ink text-bone hover:bg-clay hover:text-ink rounded-full px-10 py-5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          {buttonText}
        </Link>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="bg-bone text-ink py-16 md:py-24 px-6 md:px-10 border-t border-ink/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <h2 className="font-display text-4xl mb-6">BUCHA&apos;S</h2>
          <p className="text-steel font-body text-sm leading-relaxed">
            Heavyweight basics and outerwear. Designed and crafted with meticulous attention to detail.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="font-display uppercase tracking-widest2 text-sm text-steel">Shop</h3>
            <Link href="/shop" className="hover:text-clay transition-colors">All Products</Link>
            <Link href="/shop?category=tees" className="hover:text-clay transition-colors">Tees</Link>
            <Link href="/shop?category=outerwear" className="hover:text-clay transition-colors">Outerwear</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-display uppercase tracking-widest2 text-sm text-steel">Social</h3>
            <a href="#" className="hover:text-clay transition-colors">Instagram</a>
            <a href="#" className="hover:text-clay transition-colors">Tiktok</a>
            <a href="#" className="hover:text-clay transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-steel/20 flex justify-between items-center text-xs text-steel">
        <p suppressHydrationWarning>© {new Date().getFullYear()} Bucha&apos;s. All rights reserved.</p>
        <p>Premium Quality</p>
      </div>
    </footer>
  );
}
