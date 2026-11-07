import React from 'react';
import { act, render, renderHook, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import WishlistModal from './WishlistModal';
import { shop, useShop } from '../../../store';
import page from '../../../api/data/productPage.json';

const [a, b] = page.data;

describe('WishlistModal', () => {
  it('shows an empty state that leads to the products page', async () => {
    const onClose = jest.fn();
    await render(<WishlistModal open onClose={onClose} />);
    expect(screen.getByText('Nothing saved yet')).toBeOnTheScreen();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Browse gifts' }));
    expect(onClose).toHaveBeenCalled();
    expect(useNavigation().navigate).toHaveBeenCalledWith('Products');
  });

  it('moves an item to the cart and removes another', async () => {
    await act(async () => {
      shop.toggleWishlist(a);
      shop.toggleWishlist(b);
    });
    const user = userEvent.setup();
    await render(<WishlistModal open onClose={() => {}} />);
    expect(screen.getByRole('header', { name: 'Wishlist (2)' })).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: `Move ${a.name} to cart` }));
    await user.press(screen.getByRole('button', { name: `Remove ${b.name} from wishlist` }));

    expect(screen.getByText('Nothing saved yet')).toBeOnTheScreen();
    const { result } = await renderHook(() => useShop());
    expect(result.current.cart).toEqual([{ product: a, qty: 1 }]);
  });

  it('filters the grid by category pill and opens a gift', async () => {
    const flowers = page.data.filter((p) => p.categoryId === 1).slice(0, 2);
    const cake = page.data.find((p) => p.categoryId === 2)!;
    await act(async () => [...flowers, cake].forEach((p) => shop.toggleWishlist(p)));
    const onClose = jest.fn();
    const user = userEvent.setup();
    await render(<WishlistModal open onClose={onClose} />);

    // pills only for categories that have saved gifts
    await user.press(await screen.findByRole('button', { name: 'Flowers' }));
    expect(screen.queryByRole('button', { name: 'Plants' })).not.toBeOnTheScreen();
    expect(screen.getAllByRole('button', { name: /^View / })).toHaveLength(2);
    expect(screen.queryByRole('button', { name: `View ${cake.name}` })).not.toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'All Products' }));
    expect(screen.getAllByRole('button', { name: /^View / })).toHaveLength(3);

    await user.press(screen.getByRole('button', { name: `View ${cake.name}` }));
    expect(onClose).toHaveBeenCalled();
    expect(useNavigation().navigate).toHaveBeenCalledWith('ProductDetail', { id: cake.id });
  });
});
