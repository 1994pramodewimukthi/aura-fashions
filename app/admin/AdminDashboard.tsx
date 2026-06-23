'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { addProduct, updateProduct, deleteProduct } from './actions';

export default function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Men',
    subCategory: '',
    price: 0,
    stock: 10,
    featured: false,
    images: ['']
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, images: [e.target.value] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateProduct(editingId, formData);
      setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
      setEditingId(null);
    } else {
      const newProduct = await addProduct(formData);
      setProducts([...products, newProduct]);
    }
    setFormData({ name: '', category: 'Men', subCategory: '', price: 0, stock: 10, featured: false, images: [''] });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="flex-1 bg-ink/5 p-6 rounded-lg border border-ink/10 h-fit">
        <h2 className="font-display text-2xl mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1 uppercase tracking-widest2 text-ink/70">Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-ink/20 rounded bg-transparent focus:outline-none focus:border-clay" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1 uppercase tracking-widest2 text-ink/70">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border border-ink/20 rounded bg-transparent focus:outline-none focus:border-clay">
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1 uppercase tracking-widest2 text-ink/70">Sub-Category</label>
              <input required type="text" name="subCategory" value={formData.subCategory} onChange={handleInputChange} className="w-full p-2 border border-ink/20 rounded bg-transparent focus:outline-none focus:border-clay" placeholder="e.g. Oversized Tees" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1 uppercase tracking-widest2 text-ink/70">Price (LKR)</label>
              <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border border-ink/20 rounded bg-transparent focus:outline-none focus:border-clay" />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1 uppercase tracking-widest2 text-ink/70">Stock</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-2 border border-ink/20 rounded bg-transparent focus:outline-none focus:border-clay" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 uppercase tracking-widest2 text-ink/70">Image URL</label>
            <input required type="text" value={formData.images?.[0] || ''} onChange={handleImageChange} className="w-full p-2 border border-ink/20 rounded bg-transparent focus:outline-none focus:border-clay" placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-4 h-4 accent-clay" />
            <label htmlFor="featured" className="text-sm uppercase tracking-widest2 text-ink/70">Featured (Latest Styles Row)</label>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button type="submit" className="flex-1 bg-ink text-bone py-3 rounded uppercase tracking-widest2 font-display text-sm hover:bg-clay transition-colors">
              {editingId ? 'Update' : 'Add'} Product
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', category: 'Men', subCategory: '', price: 0, stock: 10, featured: false, images: [''] }); }} className="flex-1 border border-ink/20 text-ink py-3 rounded uppercase tracking-widest2 font-display text-sm hover:bg-ink/5 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="flex-[2] flex flex-col gap-4">
        <h2 className="font-display text-2xl mb-2">Inventory ({products.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-ink/5 border border-ink/10 rounded-lg overflow-hidden flex flex-col">
              <div className="aspect-[3/4] relative bg-ink/10">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                {p.featured && <span className="absolute top-2 right-2 bg-clay text-bone text-xs px-2 py-1 font-display uppercase">Featured</span>}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display text-lg leading-tight">{p.name}</h3>
                <p className="text-sm text-ink/60 mt-1">{p.category} / {p.subCategory}</p>
                <p className="font-display text-lg mt-2">LKR {p.price}</p>
                
                <div className="flex gap-2 mt-auto pt-4">
                  <button onClick={() => handleEdit(p)} className="flex-1 bg-ink/10 text-ink py-2 rounded text-xs uppercase tracking-widest font-bold hover:bg-ink hover:text-bone transition-colors">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-500/10 text-red-600 py-2 rounded text-xs uppercase tracking-widest font-bold hover:bg-red-500 hover:text-white transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
