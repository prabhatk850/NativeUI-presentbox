import { getStateFromPath } from '@react-navigation/native';
import { linking, withCategory } from './navigation';

describe('withCategory', () => {
  it('adds the link label as the category for product links', () => {
    expect(withCategory('/products', 'Birthday')).toBe('/products?category=Birthday');
    expect(withCategory('/products', ' Best Sellers ')).toBe('/products?category=Best%20Sellers');
  });

  it('leaves other links and "All …" links alone', () => {
    expect(withCategory('#', 'Shipping')).toBe('#');
    expect(withCategory('/products', 'All Gifts')).toBe('/products');
    expect(withCategory('/products', '')).toBe('/products');
  });

  it('round-trips through the linking config into route params', () => {
    const state = getStateFromPath(withCategory('/products', 'Best Sellers'), linking.config);
    expect(state?.routes.at(-1)).toMatchObject({ name: 'Products', params: { category: 'Best Sellers' } });
  });

  it('opens a product link as a sheet over Home', () => {
    const state = getStateFromPath('/products/5', linking.config);
    expect(state?.routes.map((r) => r.name)).toEqual(['Home', 'ProductDetail']);
    expect(state?.routes[1].params).toEqual({ id: 5 });
  });
});
