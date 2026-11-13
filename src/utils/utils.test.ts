import { ALL_PRODUCTS, NO_FILTERS, activeFilterCount, filterProducts, formatPrice, groupByCategory, priceValue, searchCatalog, type Filters } from './';
import page from '../mocks/productPage.json';

describe('groupByCategory', () => {
  const groups = groupByCategory(page.data, page.categories);

  it('puts All Products first, then every category as a tab', () => {
    expect(Object.keys(groups)).toEqual([ALL_PRODUCTS, ...page.categories.map((c) => c.name)]);
    expect(groups[ALL_PRODUCTS]).toHaveLength(page.data.length);
  });

  it('maps each category to only its own products, and every product to a category', () => {
    for (const c of page.categories) {
      expect(groups[c.name].length).toBeGreaterThan(0);
      expect(groups[c.name].every((p) => p.categoryId === c.id)).toBe(true);
    }
    const grouped = page.categories.reduce((n, c) => n + groups[c.name].length, 0);
    expect(grouped).toBe(page.data.length);
  });
});

describe('prices', () => {
  it('parses API price strings and formats totals back', () => {
    expect(priceValue('INR 1,299')).toBe(1299);
    expect(formatPrice(129999)).toBe('INR 1,29,999');
  });
});

describe('filterProducts', () => {
  const only = (f: Partial<Filters>) => filterProducts(page.data, { ...NO_FILTERS, ...f });

  it('keeps everything with no filters', () => {
    expect(only({})).toHaveLength(page.data.length);
    expect(activeFilterCount(NO_FILTERS)).toBe(0);
  });

  it('shows a gender’s own gifts plus the ones for everyone', () => {
    const men = only({ gender: 'Men' });
    expect(men.length).toBeGreaterThan(0);
    expect(men.every((p) => p.gender === 'Men' || p.gender === 'All')).toBe(true);
    expect(men.some((p) => p.gender === 'Men')).toBe(true);
  });

  it('matches any picked occasion', () => {
    const [birthday, wedding] = [1, 3];
    const result = only({ occasionIds: [birthday, wedding] });
    expect(result.every((p) => p.occasionIds?.includes(birthday) || p.occasionIds?.includes(wedding))).toBe(true);
    expect(result.length).toBeGreaterThan(only({ occasionIds: [wedding] }).length);
  });

  it('combines price, rating and sale filters', () => {
    const f = { ...NO_FILTERS, min: '500', max: '1000', minRating: 4.5, onSale: true };
    const result = filterProducts(page.data, f);
    expect(result.length).toBeGreaterThan(0);
    for (const p of result) {
      expect(priceValue(p.price)).toBeGreaterThanOrEqual(500);
      expect(priceValue(p.price)).toBeLessThanOrEqual(1000);
      expect(p.Raiting).toBeGreaterThanOrEqual(4.5);
      expect(p.type).toBe('Sale');
    }
    expect(activeFilterCount(f)).toBe(3);
  });
});

describe('searchCatalog', () => {
  it('finds categories, occasions and products by name, case-insensitively', () => {
    const r = searchCatalog(page, 'CAKE');
    expect(r.categories.map((c) => c.name)).toEqual(['Cakes']);
    expect(r.products.length).toBeGreaterThanOrEqual(4);
    expect(r.products.every((p) => p.categoryId === 2 || /cake/i.test(p.name))).toBe(true);
  });

  it('needs every word, across product, category and occasion names', () => {
    const r = searchCatalog(page, 'birthday cakes');
    expect(r.products.length).toBeGreaterThan(0);
    expect(r.products.every((p) => p.categoryId === 2 && p.occasionIds?.includes(1))).toBe(true);
    expect(searchCatalog(page, 'valentine’s').occasions.map((o) => o.name)).toEqual(['Valentine’s Day']);
    expect(searchCatalog(page, "valentine's").occasions).toHaveLength(1); // straight apostrophe too
  });

  it('ranks name matches first and returns nothing for blank or unknown queries', () => {
    const r = searchCatalog(page, 'lamp');
    expect(r.products[0].name).toMatch(/lamp/i);
    expect(searchCatalog(page, '   ').products).toEqual([]);
    expect(searchCatalog(page, 'zzzz').products).toEqual([]);
  });
});
