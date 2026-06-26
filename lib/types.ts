export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  description: string;
  images: string[];
  fitOnImage?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
}

export interface CategoryEntry {
  id: string;
  name: string;
  subCategories: string[];
}

export interface SiteSettings {
  whatsappNumber: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  phone: string;
  address: string;
}

export interface StoreData {
  settings: SiteSettings;
  categories: CategoryEntry[];
  products: Product[];
}

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}
