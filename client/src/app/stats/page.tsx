'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { StatsCards } from '../../components/StatsCards';
import { StatusAlert } from '../../components/StatusAlert';
import { apiRequest, formatCurrency, type Product, type ProductStats } from '../../lib/api';

export default function StatsPage() {
  const [stats, setStats] = useState<ProductStats[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    Promise.all([
      apiRequest<{ data: { stats: ProductStats[] } }>('/api/v1/products/product-category'),
      apiRequest<{ data: { products: Product[] } }>('/api/v1/products/top-3-cheapest')
    ])
      .then(([statsData, productsData]) => {
        setStats(statsData.data.stats);
        setTopProducts(productsData.data.products);
      })
      .catch(error => setStatus({ message: error instanceof Error ? error.message : 'Unable to load stats.', type: 'error' }));
  }, []);

  return (
    <AppShell>
      <PageHeader title="Marketplace Stats" />
      <StatusAlert message={status?.message} type={status?.type} />

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-black">Category Statistics</h2>
        <StatsCards stats={stats} />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-black">Top Cheapest Alias Route</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {topProducts.map(product => (
            <article key={product._id} className="surface p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="font-black">{product.name}</h3>
                <i className="ri-price-tag-3-line ri text-2xl text-secondary" aria-hidden="true" />
              </div>
              <p className="text-2xl font-black text-primary">{formatCurrency(product.price)}</p>
              <p className="text-sm text-neutral/60">{product.category}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
