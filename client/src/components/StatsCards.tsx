import { formatCurrency, type ProductStats } from '../lib/api';

export function StatsCards({ stats }: { stats: ProductStats[] }) {
  if (!stats.length) {
    return <div className="surface p-6 text-center text-neutral/60">No category stats are available yet.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map(stat => (
        <article key={stat._id} className="metric-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black">{stat._id}</h2>
            <i className="ri-pie-chart-2-line ri text-2xl text-secondary" aria-hidden="true" />
          </div>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral/60">Products</dt>
              <dd className="font-bold">{stat.numProducts}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral/60">Average</dt>
              <dd className="font-bold">{formatCurrency(stat.avgPrice)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral/60">Min</dt>
              <dd className="font-bold">{formatCurrency(stat.minPrice)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral/60">Max</dt>
              <dd className="font-bold">{formatCurrency(stat.maxPrice)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
