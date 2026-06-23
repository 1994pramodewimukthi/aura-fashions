'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, SiteSettings } from '@/lib/types';

const emptyForm = {
  name: '',
  category: '',
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
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<'products' | 'settings'>('products');
  const [savedMsg, setSavedMsg] = useState('');

  async function loadProducts() {
    const res = await fetch('/api/products');
    setProducts(await res.json());
  }

  async function loadSettings() {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data.settings);
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
      images: p.images.join(', '),
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
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
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
                <input
                  required
                  placeholder="Category (e.g. Men)"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="border border-ink/20 rounded-lg px-3 py-2 bg-bone"
                />
                <input
                  required
                  placeholder="Sub-category"
                  value={form.subCategory}
                  onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                  className="border border-ink/20 rounded-lg px-3 py-2 bg-bone"
                />
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
              <input
                placeholder="Image URLs, comma separated"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="w-full border border-ink/20 rounded-lg px-3 py-2 bg-bone"
              />
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

          <div>
            <h2 className="font-display text-xl mb-4">Catalog ({products.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border border-ink/10 rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-display">{p.name}</p>
                    <p className="text-xs text-steel uppercase tracking-widest2">
                      {p.category} / {p.subCategory} — LKR {p.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadIntoForm(p)}
                      className="text-xs uppercase tracking-widest2 border border-ink/20 rounded-full px-3 py-1 hover:border-ink"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs uppercase tracking-widest2 border border-clay text-clay rounded-full px-3 py-1 hover:bg-clay hover:text-bone"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
    </main>
  );
}
