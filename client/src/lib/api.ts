import { API_BASE_URL } from './config';

export type ApiError = Error & { statusCode?: number };

export type User = {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

export type Product = {
  _id: string;
  id?: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  seller: string;
  postedDate?: string;
  productSlug?: string;
  premiumProducts?: boolean;
  priceDiscount?: number;
  daysPosted?: number;
};

export type ProductPayload = {
  name: string;
  price: number;
  category: string;
  seller: string;
  description?: string;
  premiumProducts?: boolean;
  priceDiscount?: number;
};

export type ProductStats = {
  _id: string;
  numProducts: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
};

type RequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : {};

  if (!response.ok) {
    const error = new Error(data.message || `${response.status} ${response.statusText}`) as ApiError;
    error.statusCode = response.status;
    throw error;
  }

  return data as T;
}

export function productId(product: Product) {
  return product.id || product._id;
}

export function formatCurrency(value = 0) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(value);
}
