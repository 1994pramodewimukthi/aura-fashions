import { notFound } from 'next/navigation';
import { readStore } from '@/lib/data';
import { AddToCartPanel } from '@/components/AddToCartPanel';

export function generateStaticParams() {
  const { products } = readStore();
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { products } = readStore();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <div className="aspect-[4/5] overflow-hidden bg-ink/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest2 text-steel mb-3">
            {product.category} / {product.subCategory}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
          <p className="font-display text-2xl text-clay mt-4">
            LKR {product.price.toLocaleString()}
          </p>
          <p className="font-accent italic text-ink/70 mt-6 max-w-md">{product.description}</p>

          <div className="mt-10">
            <AddToCartPanel product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
