'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, SiteSettings, CategoryEntry } from '@/lib/types';

const emptyForm = {
  name: '',
  category: 'Men',
  subCategory: '',
  price: '',
  description: '',
  images: '',
  sizes: '',
  colors: '',
  stock: '',
  featured: false
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<CategoryEntry[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<'products' | 'settings' | 'categories'>('products');
  const [savedMsg, setSavedMsg] = useState('');
  
  // Modal state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [subCatModalTarget, setSubCatModalTarget] = useState<string | null>(null);
  const [modalInput, setModalInput] = useState('');

  // Catalog filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  async function loadProducts() {
    const res = await fetch('/api/products');
    setProducts(await res.json());
  }

  async function loadSettings() {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data.settings);
    setCategories(data.categories || []);
  }

  useEffect(() => {
    loadProducts();
    loadSettings();
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function loadIntoForm(p: Product) {
    setForm({
      name: p.name,
      category: p.category,
      subCategory: p.subCategory,
      price: String(p.price),
      description: p.description,
      images: p.images.join('\n'),
      sizes: p.sizes.join(', '),
      colors: p.colors.join(', '),
      stock: String(p.stock),
      featured: p.featured
    });
    setEditingId(p.id);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      subCategory: form.subCategory,
      price: Number(form.price),
      description: form.description,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      featured: form.featured
    };

    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    resetForm();
    loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    loadProducts();
  }

  async function handleSettingsSave(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    });
    setSavedMsg('Saved.');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  async function saveCategoriesToApi(newCats: CategoryEntry[]) {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: newCats })
    });
    setCategories(newCats);
    setSavedMsg('Categories updated.');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  function handleAddCategorySubmit(e: FormEvent) {
    e.preventDefault();
    if (!modalInput.trim()) return;
    const newCats = [...categories, { id: 'cat-' + Date.now(), name: modalInput.trim(), subCategories: [] }];
    saveCategoriesToApi(newCats);
    setCatModalOpen(false);
    setModalInput('');
  }

  function deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const newCats = categories.filter(c => c.id !== id);
    saveCategoriesToApi(newCats);
  }

  function handleAddSubCategorySubmit(e: FormEvent) {
    e.preventDefault();
    if (!modalInput.trim() || !subCatModalTarget) return;
    const newCats = categories.map(c => {
      if (c.id === subCatModalTarget) {
        return { ...c, subCategories: [...c.subCategories, modalInput.trim()] };
      }
      return c;
    });
    saveCategoriesToApi(newCats);
    setSubCatModalTarget(null);
    setModalInput('');
  }

  function deleteSubCategory(catId: string, sub: string) {
    if (!confirm(`Delete sub-category "${sub}"?`)) return;
    const newCats = categories.map(c => {
      if (c.id === catId) {
        return { ...c, subCategories: c.subCategories.filter(s => s !== sub) };
      }
      return c;
    });
    saveCategoriesToApi(newCats);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setForm(prev => ({ 
          ...prev, 
          images: prev.images ? prev.images + '\n' + dataUrl : dataUrl 
        }));
        
        // Reset the file input so the same file can be uploaded again if needed
        e.target.value = '';
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  const filteredProducts = products.filter(p => {
    if (filterCategory && p.category !== filterCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0; // default (newest)
  });

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl md:text-4xl">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-xs uppercase tracking-widest2 border border-ink rounded-full px-5 py-2 hover:bg-ink hover:text-bone transition-colors"
        >
          Log Out
        </button>
      </div>

      <div className="flex gap-3 mb-10">
        <button
          onClick={() => setTab('products')}
          className={`text-sm uppercase tracking-widest2 rounded-full px-5 py-2 border ${
            tab === 'products' ? 'bg-ink text-bone border-ink' : 'border-ink/20'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`text-sm uppercase tracking-widest2 rounded-full px-5 py-2 border ${
            tab === 'settings' ? 'bg-ink text-bone border-ink' : 'border-ink/20'
          }`}
        >
          Site Settings
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`text-sm uppercase tracking-widest2 rounded-full px-5 py-2 border ${
            tab === 'categories' ? 'bg-ink text-bone border-ink' : 'border-ink/20'
          }`}
        >
          Categories
        </button>
      </div>

      {tab === 'products' && (
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-xl mb-4">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="border border-ink/20 rounded-lg px-3 py-2 bg-bone text-ink"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <select
                  required
                  value={form.subCategory}
                  onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                  className="border border-ink/20 rounded-lg px-3 py-2 bg-bone text-ink"
                >
                  <option value="" disabled>Select Sub-category</option>
                  {categories.find(c => c.name === form.category)?.subCategories.map(sc => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="number"
                  placeholder="Price (LKR)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="border border-ink/20 rounded-lg px-3 py-2 bg-bone"
                />
                <input
                  required
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="border border-ink/20 rounded-lg px-3 py-2 bg-bone"
                />
              </div>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
                rows={3}
              />
              <div className="flex flex-col gap-2 p-3 border border-ink/20 rounded-lg bg-bone">
                <label className="text-xs uppercase tracking-widest2 text-steel">Upload Image OR Paste Link</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-display file:bg-ink file:text-bone hover:file:bg-clay cursor-pointer"
                />
                <textarea
                  placeholder="Image URLs (one per line)"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="w-full border-t border-ink/10 pt-2 mt-2 bg-transparent outline-none"
                  rows={3}
                />
              </div>
              <input
                placeholder="Sizes, comma separated (S, M, L)"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
              />
              <input
                placeholder="Colors, comma separated"
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
                className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured on homepage
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="font-display uppercase tracking-widest2 text-sm bg-ink text-bone rounded-full px-6 py-3 hover:bg-clay transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Add Product'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm uppercase tracking-widest2 px-6 py-3"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="flex flex-col border-t md:border-t-0 md:border-l border-ink/10 pt-8 md:pt-0 md:pl-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-4">
              <h2 className="font-display text-xl whitespace-nowrap">Catalog ({filteredProducts.length})</h2>
              
              <div className="flex flex-wrap lg:flex-nowrap gap-2">
                <input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border border-ink/20 rounded-full px-4 py-2 text-sm bg-bone w-full lg:w-40"
                />
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="border border-ink/20 rounded-full px-4 py-2 text-sm bg-bone text-ink"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as any)}
                  className="border border-ink/20 rounded-full px-4 py-2 text-sm bg-bone text-ink"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low-High</option>
                  <option value="price-desc">Price: High-Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border border-ink/10 rounded-lg p-3 hover:bg-ink/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {p.images[0] && (
                      <div className="w-12 h-16 shrink-0 bg-ink/10 rounded overflow-hidden">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-display leading-tight">{p.name}</p>
                      <p className="text-xs text-steel uppercase tracking-widest2 mt-1">
                        {p.category} / {p.subCategory} — LKR {p.price.toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => loadIntoForm(p)}
                      className="text-[10px] uppercase tracking-widest2 border border-ink/20 rounded-full px-3 py-1 hover:border-ink hover:bg-ink hover:text-bone transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-[10px] uppercase tracking-widest2 border border-clay text-clay rounded-full px-3 py-1 hover:bg-clay hover:text-bone transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-steel text-center py-10 border border-dashed border-ink/20 rounded-lg">
                  No products match your search.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && settings && (
        <form onSubmit={handleSettingsSave} className="max-w-md space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest2 text-steel block mb-2">
              WhatsApp Number (no + or spaces)
            </label>
            <input
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest2 text-steel block mb-2">
              Phone (display)
            </label>
            <input
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest2 text-steel block mb-2">
              Address
            </label>
            <input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest2 text-steel block mb-2">
              Instagram URL
            </label>
            <input
              value={settings.instagram}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest2 text-steel block mb-2">
              TikTok URL
            </label>
            <input
              value={settings.tiktok}
              onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest2 text-steel block mb-2">
              Facebook URL
            </label>
            <input
              value={settings.facebook}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
            />
          </div>
          <button
            type="submit"
            className="font-display uppercase tracking-widest2 text-sm bg-ink text-bone rounded-full px-6 py-3 hover:bg-clay transition-colors"
          >
            Save Settings
          </button>
          {savedMsg && <p className="text-moss text-sm">{savedMsg}</p>}
        </form>
      )}

      {tab === 'categories' && (
        <div className="max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl">Manage Categories</h2>
            <button onClick={() => { setModalInput(''); setCatModalOpen(true); }} className="text-xs uppercase tracking-widest2 bg-ink text-bone px-4 py-2 rounded-full hover:bg-clay transition-colors">
              + New Category
            </button>
          </div>
          
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.id} className="border border-ink/20 rounded-lg p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display text-xl">{cat.name}</h3>
                  <button onClick={() => deleteCategory(cat.id)} className="text-xs uppercase tracking-widest2 text-clay hover:underline">
                    Delete Category
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.subCategories.map(sub => (
                    <div key={sub} className="bg-ink/5 border border-ink/10 rounded-full px-3 py-1 flex items-center gap-2 text-sm">
                      {sub}
                      <button onClick={() => deleteSubCategory(cat.id, sub)} className="text-clay font-bold hover:text-red-600 ml-1">×</button>
                    </div>
                  ))}
                  {cat.subCategories.length === 0 && <span className="text-steel text-sm">No sub-categories yet.</span>}
                </div>
                
                <button onClick={() => { setModalInput(''); setSubCatModalTarget(cat.id); }} className="text-xs uppercase tracking-widest2 border border-ink/20 px-3 py-1 rounded-full hover:border-ink">
                  + Add Sub-category
                </button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-steel">No categories defined.</p>}
          </div>
          {savedMsg && <p className="text-moss text-sm mt-4">{savedMsg}</p>}
        </div>
      )}

      {/* Modals */}
      {(catModalOpen || subCatModalTarget) && (
        <div className="fixed inset-0 bg-ink/80 z-50 flex items-center justify-center p-4">
          <div className="bg-bone text-ink p-8 rounded-2xl w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => { setCatModalOpen(false); setSubCatModalTarget(null); }}
              className="absolute top-4 right-4 text-steel hover:text-ink text-2xl leading-none"
            >
              ×
            </button>
            <h3 className="font-display text-3xl mb-6">
              {catModalOpen ? 'Add Category' : 'Add Sub-category'}
            </h3>
            <form onSubmit={catModalOpen ? handleAddCategorySubmit : handleAddSubCategorySubmit}>
              <input
                autoFocus
                required
                placeholder={catModalOpen ? 'e.g. Footwear' : 'e.g. Sneakers'}
                value={modalInput}
                onChange={e => setModalInput(e.target.value)}
                className="w-full border border-ink/20 rounded-lg px-4 py-3 bg-transparent outline-none focus:border-ink mb-6"
              />
              <button type="submit" className="w-full font-display uppercase tracking-widest2 text-sm bg-ink text-bone rounded-full py-3 hover:bg-clay transition-colors">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
