import { HeroSection, HorizontalProductRow, MarqueeProductRow, BannerSection } from '@/components/HomeSections';
import { readStore } from '@/lib/data';

export default function Home() {
  const store = readStore();
  const allProducts = store.products;
  const categories = store.categories;

  const latestStyles = allProducts.filter(p => p.featured);

  return (
    <main className="flex flex-col w-full overflow-hidden">
      <HeroSection />
      
      {latestStyles.length > 0 && (
        <MarqueeProductRow title="Shop The Latest Styles" products={latestStyles} />
      )}
      
      <BannerSection 
        image="https://images.unsplash.com/photo-1512353087810-254cb3617d12?q=80&w=2000&auto=format&fit=crop"
        title="Urban Utility"
        buttonText="Discover Collection"
        link="/shop"
      />
      
      {categories.map((cat) => {
        const catProducts = allProducts.filter(p => p.category === cat.name);
        if (catProducts.length === 0) return null;
        
        return (
          <HorizontalProductRow 
            key={cat.id} 
            title={cat.name} 
            products={catProducts} 
            aspectRatio={cat.name.toLowerCase() === 'accessories' ? "aspect-square" : undefined}
          />
        );
      })}

      <BannerSection 
        image="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=2000&auto=format&fit=crop"
        title="New Season Arrivals"
        buttonText="Shop Now"
        link="/shop"
      />
    </main>
  );
}
