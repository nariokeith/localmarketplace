'use client';

import Link from 'next/link';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency, productId, type Product } from '../lib/api';

type ProductCardProps = {
  product: Product;
  onDelete: (product: Product) => void;
};

export function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <article className="surface flex min-h-[280px] flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="badge badge-outline mb-2">{product.category}</div>
          <h2 className="text-xl font-black leading-tight">{product.name}</h2>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-primary">{formatCurrency(product.price)}</p>
          {product.priceDiscount ? <p className="text-xs text-success">Discount {formatCurrency(product.priceDiscount)}</p> : null}
        </div>
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-6 text-neutral/65">{product.description || 'No description provided.'}</p>

      <div className="mt-auto grid gap-2 text-sm text-neutral/65">
        <div className="flex items-center gap-2">
          <i className="ri-user-smile-line ri text-base text-secondary" aria-hidden="true" />
          <span>{product.seller}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="ri-links-line ri text-base text-secondary" aria-hidden="true" />
          <span className="truncate">{product.productSlug || 'slug pending'}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="ri-calendar-line ri text-base text-secondary" aria-hidden="true" />
          <span>{product.daysPosted ?? 0} days posted</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/products/${productId(product)}/edit`} className="btn btn-outline btn-sm gap-2">
          <PencilSquareIcon className="h-4 w-4" />
          Edit
        </Link>
        <button type="button" className="btn btn-error btn-outline btn-sm gap-2" onClick={() => onDelete(product)}>
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
}
