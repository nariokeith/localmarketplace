'use client';

import { useMemo, useState } from 'react';
import { type Product, type ProductPayload } from '../lib/api';
import { StatusAlert } from './StatusAlert';

const categories = ['Electronics', 'Clothes', 'Books', 'Food', 'Home', 'Services', 'Sports', 'Others'];

type ProductFormProps = {
  initialProduct?: Product;
  submitLabel: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
};

export function ProductForm({ initialProduct, submitLabel, onSubmit }: ProductFormProps) {
  const initialState = useMemo(
    () => ({
      name: initialProduct?.name || '',
      price: String(initialProduct?.price || ''),
      category: initialProduct?.category || 'Others',
      seller: initialProduct?.seller || '',
      description: initialProduct?.description || '',
      priceDiscount: initialProduct?.priceDiscount ? String(initialProduct.priceDiscount) : '',
      premiumProducts: Boolean(initialProduct?.premiumProducts)
    }),
    [initialProduct]
  );

  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm(current => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      const payload: ProductPayload = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category,
        seller: form.seller.trim(),
        description: form.description.trim(),
        premiumProducts: form.premiumProducts
      };

      if (form.priceDiscount) {
        payload.priceDiscount = Number(form.priceDiscount);
      }

      await onSubmit(payload);
      setStatus({ message: 'Product saved successfully.', type: 'success' });
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : 'Unable to save product.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="surface grid gap-5 p-5" onSubmit={handleSubmit}>
      <StatusAlert message={status?.message} type={status?.type} />

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="field-label">Product Name</span>
          <input className="form-input" minLength={3} maxLength={80} required value={form.name} onChange={event => update('name', event.target.value)} />
        </label>
        <label>
          <span className="field-label">Seller</span>
          <input className="form-input" minLength={2} maxLength={80} required value={form.seller} onChange={event => update('seller', event.target.value)} />
        </label>
        <label>
          <span className="field-label">Price</span>
          <input className="form-input" type="number" min="1" required value={form.price} onChange={event => update('price', event.target.value)} />
        </label>
        <label>
          <span className="field-label">Discount Price</span>
          <input className="form-input" type="number" min="0" value={form.priceDiscount} onChange={event => update('priceDiscount', event.target.value)} />
        </label>
        <label>
          <span className="field-label">Category</span>
          <select className="form-select" required value={form.category} onChange={event => update('category', event.target.value)}>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-3 pb-3">
          <input
            className="toggle toggle-primary"
            type="checkbox"
            checked={form.premiumProducts}
            onChange={event => update('premiumProducts', event.target.checked)}
          />
          <span>
            <span className="block font-bold">Premium hidden product</span>
            <span className="text-sm text-neutral/60">Shows query middleware filtering during demos.</span>
          </span>
        </label>
      </div>

      <label>
        <span className="field-label">Description</span>
        <textarea
          className="form-textarea"
          rows={5}
          maxLength={160}
          value={form.description}
          onChange={event => update('description', event.target.value)}
        />
      </label>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? <span className="loading loading-spinner" /> : <i className="ri-save-3-line ri text-lg" aria-hidden="true" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
