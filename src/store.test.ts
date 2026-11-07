import { cartCount, selectedAddress, shop, useShop } from './store';
import { renderHook } from '@testing-library/react-native';
import page from './api/data/productPage.json';

const [a, b] = page.data;
const home = { label: 'Home' as const, name: 'Riya', phone: '9876543210', line: '12 MG Road', city: 'Pune', pincode: '411001' };
const state = async () => (await renderHook(() => useShop())).result.current;

describe('shop store', () => {
  it('adds to cart, stacks quantity and removes at zero', async () => {
    shop.addToCart(a);
    shop.addToCart(a);
    shop.addToCart(b);
    expect(cartCount(await state())).toBe(3);

    shop.setQty(a.id, 0);
    expect((await state()).cart.map((l) => l.product.id)).toEqual([b.id]);
  });

  it('toggles the wishlist', async () => {
    shop.toggleWishlist(a);
    expect((await state()).wishlist).toEqual([a]);
    shop.toggleWishlist(a);
    expect((await state()).wishlist).toEqual([]);
  });

  it('selects a new address and falls back when the selected one is removed', async () => {
    shop.addAddress(home);
    shop.addAddress({ ...home, label: 'Work', line: '5 Tech Park' });
    expect(selectedAddress(await state())?.line).toBe('5 Tech Park');

    shop.removeAddress(2);
    expect(selectedAddress(await state())?.line).toBe('12 MG Road');
  });
});

describe('recent searches', () => {
  it('keeps the last five, newest first, without duplicates', async () => {
    for (const q of ['a', 'b', 'c', 'd', 'e', 'f', 'B ']) shop.addRecentSearch(q);
    expect((await state()).recentSearches).toEqual(['B', 'f', 'e', 'd', 'c']);
  });
});
