// "Raiting" spelling comes from the API
export type Product = {
  id: number;
  categoryId: number;
  type?: string;
  Raiting: number;
  name: string;
  price: string;
  img: string;
  gender?: string; // one of GENDERS; "All" = suits anyone
  occasionIds?: number[];
  description?: string;
  highlights?: string[];
};
export type Category = { id: number; name: string };
export type Occasion = { id: number; name: string };

export const ALL_PRODUCTS = 'All Products';

// API prices are display strings ("INR 1,299"); these convert for cart maths and back.
export const priceValue = (price: string) => Number(price.replace(/[^\d.]/g, '')) || 0;
export const formatPrice = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

// Tab name → its products, "All Products" first. Object.keys() gives the tabs, groups[tab] the grid.
export function groupByCategory(products: Product[], categories: Category[]) {
  const groups: Record<string, Product[]> = { [ALL_PRODUCTS]: products };
  for (const c of categories) groups[c.name] = products.filter((p) => p.categoryId === c.id);
  return groups;
}

// "All" means no gender filter; a gift tagged "All" shows under every gender.
export const GENDERS = ['All', 'Men', 'Women', 'Kids'];

export type Filters = { gender: string; occasionIds: number[]; min: string; max: string; minRating: number | null; onSale: boolean };
export const NO_FILTERS: Filters = { gender: 'All', occasionIds: [], min: '', max: '', minRating: null, onSale: false };

// Occasions match any of the picked ones; every other filter must hold.
export function filterProducts(products: Product[], f: Filters) {
  const min = Number(f.min) || 0;
  const max = Number(f.max) || Infinity;
  return products.filter((p) => {
    const price = priceValue(p.price);
    return (
      (f.gender === 'All' || p.gender === f.gender || p.gender === 'All') &&
      (f.occasionIds.length === 0 || f.occasionIds.some((id) => p.occasionIds?.includes(id))) &&
      price >= min &&
      price <= max &&
      (f.minRating === null || p.Raiting >= f.minRating) &&
      (!f.onSale || p.type === 'Sale')
    );
  });
}

// how many filter groups are set, for the "Filter (2)" button
export const activeFilterCount = (f: Filters) =>
  [f.gender !== 'All', f.occasionIds.length > 0, !!(f.min || f.max), f.minRating !== null, f.onSale].filter(Boolean).length;

// Free-text search over product, category and occasion names. Every word must appear somewhere,
// so "birthday cake" finds cakes tagged Birthday. Products whose own name matches come first.
type Catalog = { categories: Category[]; occasions: Occasion[]; data: Product[] };
const normalize = (s: string) => s.toLowerCase().replace(/’/g, "'");
export const searchWords = (query: string) => normalize(query).split(/\s+/).filter(Boolean);

export function searchCatalog({ categories, occasions, data }: Catalog, query: string) {
  const words = searchWords(query);
  if (words.length === 0) return { categories: [], occasions: [], products: [] };
  const hit = (text: string) => words.every((w) => normalize(text).includes(w));
  const haystack = (p: Product) =>
    [p.name, categories.find((c) => c.id === p.categoryId)?.name, ...occasions.filter((o) => p.occasionIds?.includes(o.id)).map((o) => o.name)].join(' ');
  const products = data.filter((p) => hit(haystack(p)));
  return {
    categories: categories.filter((c) => hit(c.name)),
    occasions: occasions.filter((o) => hit(o.name)),
    products: [...products.filter((p) => hit(p.name)), ...products.filter((p) => !hit(p.name))],
  };
}
