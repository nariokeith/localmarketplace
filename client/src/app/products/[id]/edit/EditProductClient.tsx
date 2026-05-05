'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../../components/AppShell';
import { PageHeader } from '../../../../components/PageHeader';
import { ProductForm } from '../../../../components/ProductForm';
import { StatusAlert } from '../../../../components/StatusAlert';
import { useAuth } from '../../../../contexts/AuthContext';
import { apiRequest, type Product, type ProductPayload } from '../../../../lib/api';

export function EditProductClient({ id }: { id: string }) {
  const router = useRouter();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    apiRequest<{ data: { product: Product } }>(`/api/v1/products/${id}`)
      .then(data => setProduct(data.data.product))
      .catch(error => setStatus({ message: error instanceof Error ? error.message : 'Unable to load product.', type: 'error' }));
  }, [id]);

  async function updateProduct(payload: ProductPayload) {
    await apiRequest(`/api/v1/products/${id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload)
    });

    router.push('/products');
  }

  return (
    <AppShell>
      <PageHeader title="Edit Product" />
      <StatusAlert message={status?.message} type={status?.type} />
      {product ? <ProductForm initialProduct={product} submitLabel="Update Product" onSubmit={updateProduct} /> : null}
    </AppShell>
  );
}
