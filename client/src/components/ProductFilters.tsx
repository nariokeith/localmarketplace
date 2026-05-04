'use client';

export type ProductFilters = {
  category: string;
  seller: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  fields: string;
  limit: string;
};

type ProductFiltersProps = {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onSubmit: () => void;
};

const categories = ['Electronics', 'Clothes', 'Books', 'Food', 'Home', 'Services', 'Sports', 'Others'];

export function ProductFilters({ filters, onChange, onSubmit }: ProductFiltersProps) {
  function update(key: keyof ProductFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <form
      className="surface mb-6 grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4"
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label>
        <span className="field-label">Category</span>
        <select className="form-select" value={filters.category} onChange={event => update('category', event.target.value)}>
          <option value="">All categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="field-label">Seller</span>
        <input className="form-input" value={filters.seller} onChange={event => update('seller', event.target.value)} />
      </label>

      <label>
        <span className="field-label">Min Price</span>
        <input className="form-input" type="number" min="1" value={filters.minPrice} onChange={event => update('minPrice', event.target.value)} />
      </label>

      <label>
        <span className="field-label">Max Price</span>
        <input className="form-input" type="number" min="1" value={filters.maxPrice} onChange={event => update('maxPrice', event.target.value)} />
      </label>

      <label>
        <span className="field-label">Sort</span>
        <select className="form-select" value={filters.sort} onChange={event => update('sort', event.target.value)}>
          <option value="-postedDate">Newest first</option>
          <option value="postedDate">Oldest first</option>
          <option value="price">Lowest price</option>
          <option value="-price">Highest price</option>
          <option value="name">Name A-Z</option>
        </select>
      </label>

      <label>
        <span className="field-label">Fields</span>
        <select className="form-select" value={filters.fields} onChange={event => update('fields', event.target.value)}>
          <option value="">Full response</option>
          <option value="name,price,category,seller,postedDate,priceDiscount,productSlug">Compact</option>
          <option value="name,price,priceDiscount,category,postedDate">Price fields</option>
        </select>
      </label>

      <label>
        <span className="field-label">Limit</span>
        <input className="form-input" type="number" min="1" max="30" value={filters.limit} onChange={event => update('limit', event.target.value)} />
      </label>

      <button type="submit" className="btn btn-primary self-end">
        <i className="ri-filter-3-line ri text-lg" aria-hidden="true" />
        Apply Filters
      </button>
    </form>
  );
}
