import { HeroSection, HorizontalProductRow, BannerSection } from '@/components/HomeSections';
import { readStore } from '@/lib/data';

export default function Home() {
  const store = readStore();
  const allProducts = [...store.products, ...store.products.map(p => ({...p, id: p.id + '_dup1'})), ...store.products.map(p => ({...p, id: p.id + '_dup2'}))];

  const latestStyles = allProducts.filter(p => p.featured);
  const menProducts = allProducts.filter(p => p.category === 'Men');
  const womenProducts = allProducts.filter(p => p.category === 'Women');
  const accessories = allProducts.filter(p => p.category === 'Accessories');

  return (
    <main className="flex flex-col w-full overflow-hidden">
      <HeroSection />
      
      <HorizontalProductRow title="Shop The Latest Styles" products={latestStyles} />
      
      <BannerSection 
        image="https://images.unsplash.com/photo-1512353087810-254cb3617d12?q=80&w=2000&auto=format&fit=crop"
        title="Urban Utility"
        buttonText="Discover Collection"
        link="/shop"
      />
      
      <HorizontalProductRow title="Menswear" products={menProducts} />
      <HorizontalProductRow title="Womenswear" products={womenProducts} />
      <HorizontalProductRow title="Accessories" products={accessories} aspectRatio="aspect-square" />

      <BannerSection 
        image="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=2000&auto=format&fit=crop"
        title="New Season Arrivals"
        buttonText="Shop Now"
        link="/shop?category=new"
      />
    </main>
  );
}
