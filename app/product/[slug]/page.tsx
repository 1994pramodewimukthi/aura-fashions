import { notFound } from 'next/navigation';
import { readStore } from '@/lib/data';
import { AddToCartPanel } from '@/components/AddToCartPanel';
import { ImageGallery } from '@/components/ImageGallery';
import { VirtualTryOn } from '@/components/VirtualTryOn';

export function generateStaticParams() {
  const { products } = readStore();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { products } = readStore();
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <ImageGallery images={product.images} alt={product.name} />
        <div>
          <p className="text-xs uppercase tracking-widest2 text-steel mb-3">
            {product.category} / {product.subCategory}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
          <p className="font-display text-2xl text-clay mt-4">
            LKR {product.price.toLocaleString('en-US')}
          </p>
          <p className="font-accent italic text-ink/70 mt-6 max-w-md">{product.description}</p>

          <div className="mt-10">
            <AddToCartPanel product={product} />
            <VirtualTryOn product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
