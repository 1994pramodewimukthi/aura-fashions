import { readStore } from '@/lib/data';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const store = readStore();
  
  return (
    <div className="min-h-screen bg-bone text-ink p-6 md:p-10 font-body relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 pb-6 border-b border-ink/10">
          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight">Admin Dashboard</h1>
          <p className="text-ink/60 mt-2">Manage products, pricing, and inventory in real-time.</p>
        </div>
        
        <AdminDashboard initialProducts={store.products} />
      </div>
    </div>
  );
}
