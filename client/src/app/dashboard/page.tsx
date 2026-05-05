'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { StatusAlert } from '../../components/StatusAlert';
import { StatsCards } from '../../components/StatsCards';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest, formatCurrency, type Product, type ProductStats } from '../../lib/api';

export default function DashboardPage() {
  const { token } = useAuth();
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats[]>([]);
  const [protectedCount, setProtectedCount] = useState(0);
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      apiRequest<{ data: { products: Product[] } }>('/api/v1/products/top-3-cheapest'),
      apiRequest<{ data: { stats: ProductStats[] } }>('/api/v1/products/product-category'),
      apiRequest<{ results: number }>('/api/v1/products?limit=100', { token })
    ])
      .then(([topData, statsData, productsData]) => {
        setTopProducts(topData.data.products);
        setStats(statsData.data.stats);
        setProtectedCount(productsData.results);
      })
      .catch(error => setStatus({ message: error instanceof Error ? error.message : 'Unable to load dashboard.', type: 'error' }));
  }, [token]);

  return (
    <AppShell>
      <PageHeader
        title="Marketplace Dashboard"
        action={
          <Link href="/products/new" className="btn btn-primary">
            <i className="ri-add-circle-line ri text-lg" aria-hidden="true" />
            Create Product
          </Link>
        }
      />

      <StatusAlert message={status?.message} type={status?.type} />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-sm font-bold uppercase text-neutral/60">Visible Products</p>
          <h2 className="mt-2 text-3xl font-black">{protectedCount}</h2>
          <p className="text-sm text-neutral/60">Protected read endpoint</p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-bold uppercase text-neutral/60">Categories</p>
          <h2 className="mt-2 text-3xl font-black">{stats.length}</h2>
          <p className="text-sm text-neutral/60">Aggregation groups</p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-bold uppercase text-neutral/60">Top Cheapest</p>
          <h2 className="mt-2 text-3xl font-black">{topProducts.length}</h2>
          <p className="text-sm text-neutral/60">Alias route results</p>
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black">Top Cheapest Products</h2>
          <Link href="/stats" className="btn btn-ghost btn-sm">
            View Stats
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {topProducts.map(product => (
            <article key={product._id} className="surface p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h3 className="font-black">{product.name}</h3>
                <i className="ri-price-tag-3-line ri text-2xl text-secondary" aria-hidden="true" />
              </div>
              <p className="text-2xl font-black text-primary">{formatCurrency(product.price)}</p>
              <p className="text-sm text-neutral/60">{product.category}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black">Category Aggregation</h2>
        </div>
        <StatsCards stats={stats} />
      </section>
    </AppShell>
  );
}
