'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '../../../components/AppShell';
import { PageHeader } from '../../../components/PageHeader';
import { ProductForm } from '../../../components/ProductForm';
import { useAuth } from '../../../contexts/AuthContext';
import { apiRequest, type ProductPayload } from '../../../lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAuth();

  async function createProduct(payload: ProductPayload) {
    await apiRequest('/api/v1/products', {
      method: 'POST',
      token,
      body: JSON.stringify(payload)
    });

    router.push('/products');
  }

  return (
    <AppShell>
      <PageHeader title="Create Product" />
      <ProductForm submitLabel="Create Product" onSubmit={createProduct} />
    </AppShell>
  );
}
