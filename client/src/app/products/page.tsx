'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../../components/AppShell';
import { PageHeader } from '../../components/PageHeader';
import { ProductCard } from '../../components/ProductCard';
import { ProductFilters, type ProductFilters as ProductFilterState } from '../../components/ProductFilters';
import { StatusAlert } from '../../components/StatusAlert';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest, productId, type Product } from '../../lib/api';

const defaultFilters: ProductFilterState = {
  category: '',
  seller: '',
  minPrice: '',
  maxPrice: '',
  sort: '-postedDate',
  fields: '',
  limit: '6'
};

export default function ProductsPage() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.seller.trim()) params.set('seller', filters.seller.trim());
      if (filters.minPrice) params.set('price[gte]', filters.minPrice);
      if (filters.maxPrice) params.set('price[lte]', filters.maxPrice);
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.fields) params.set('fields', filters.fields);
      params.set('page', String(page));
      params.set('limit', filters.limit || '6');

      const data = await apiRequest<{ results: number; data: { products: Product[] } }>(`/api/v1/products?${params.toString()}`, { token });
      setProducts(data.data.products);
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : 'Unable to load products.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function confirmDeleteProduct() {
    if (!pendingDelete) return;

    setIsDeleting(true);
    try {
      const deletedProductName = pendingDelete.name;
      await apiRequest(`/api/v1/products/${productId(pendingDelete)}`, { method: 'DELETE', token });
      setPendingDelete(null);
      await fetchProducts();
      setStatus({ message: `${deletedProductName} deleted successfully.`, type: 'success' });
    } catch (error) {
      setStatus({
        message:
          error instanceof Error
            ? `${error.message}${user?.role !== 'admin' ? ' Normal users should receive 403 here.' : ''}`
            : 'Delete failed.',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Products"
        action={
          <Link href="/products/new" className="btn btn-primary">
            <i className="ri-add-circle-line ri text-lg" aria-hidden="true" />
            New Product
          </Link>
        }
      />

      <StatusAlert message={status?.message} type={status?.type} />
      <ProductFilters
        filters={filters}
        onChange={nextFilters => {
          setFilters(nextFilters);
          setPage(1);
        }}
        onSubmit={fetchProducts}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-neutral/60">
          Page {page} {isLoading ? '- loading' : ''}
        </div>
        <div className="join">
          <button className="btn join-item" disabled={page === 1 || isLoading} onClick={() => setPage(current => Math.max(current - 1, 1))}>
            Prev
          </button>
          <button
            className="btn join-item"
            disabled={isLoading || products.length < Number(filters.limit || 6)}
            onClick={() => setPage(current => current + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {products.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map(product => (
            <ProductCard key={product._id} product={product} onDelete={setPendingDelete} />
          ))}
        </section>
      ) : (
        <div className="surface p-8 text-center text-neutral/60">{isLoading ? 'Loading products...' : 'No products found.'}</div>
      )}

      {pendingDelete ? (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box max-w-md">
            <h3 className="text-lg font-black">Delete Product</h3>
            <p className="py-4 text-neutral/70">
              Delete <span className="font-bold text-neutral">{pendingDelete.name}</span>? Only admin accounts can complete this action.
            </p>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button type="button" className="btn btn-error gap-2" onClick={confirmDeleteProduct} disabled={isDeleting}>
                {isDeleting ? <span className="loading loading-spinner loading-sm" /> : <i className="ri-delete-bin-line ri text-lg" aria-hidden="true" />}
                Delete
              </button>
            </div>
          </div>
          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close delete dialog"
            onClick={() => setPendingDelete(null)}
            disabled={isDeleting}
          />
        </div>
      ) : null}
    </AppShell>
  );
}
