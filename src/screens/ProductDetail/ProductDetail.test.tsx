import React from 'react';
import { fireEvent, render, renderHook, screen, userEvent, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import ProductDetail from './ProductDetail';
import { useShop } from '../../store';
import page from '../../mocks/productPage.json';

const cake = page.data.find((p) => p.name === 'Bento Lunchbox Cake')!;
const otherCakes = page.data.filter((p) => p.categoryId === cake.categoryId && p.id !== cake.id);
const screenFor = (id: number) => <ProductDetail route={{ key: 'd', name: 'ProductDetail', params: { id } }} navigation={{} as never} />;
const shopState = async () => (await renderHook(() => useShop())).result.current;

describe('ProductDetail sheet', () => {
  it('shows the product, its tags, description, highlights and related products', async () => {
    await render(screenFor(cake.id));
    expect(await screen.findByRole('header', { name: cake.name })).toBeOnTheScreen();
    expect(screen.getByText(cake.price)).toBeOnTheScreen();
    expect(screen.getByText(cake.description!)).toBeOnTheScreen();
    for (const h of cake.highlights!) expect(screen.getByText(h)).toBeOnTheScreen();
    expect(screen.getByText('Cakes')).toBeOnTheScreen();
    expect(screen.getByText(cake.gender === 'All' ? 'For everyone' : `For ${cake.gender}`)).toBeOnTheScreen();
    for (const id of cake.occasionIds) expect(screen.getByText(page.occasions.find((o) => o.id === id)!.name)).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'You may also like' })).toBeOnTheScreen();
    expect(screen.getAllByRole('button', { name: /^View / })).toHaveLength(otherCakes.length);
  });

  it('opens as a card and goes full screen on scroll', async () => {
    await render(screenFor(cake.id));
    await screen.findByRole('header', { name: cake.name });
    const sheet = screen.getByTestId('sheet');
    expect(sheet).not.toBeExpanded();
    expect(screen.getByRole('button', { name: 'Close' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeOnTheScreen();

    await fireEvent.scroll(screen.getByTestId('sheet-scroll'), { nativeEvent: { contentOffset: { y: 200 } } });
    expect(sheet).toBeExpanded();
    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeOnTheScreen();
  });

  it('adds the chosen quantity, then offers to go to the cart, and toggles the wishlist', async () => {
    const user = userEvent.setup();
    await render(screenFor(cake.id));
    await user.press(await screen.findByRole('button', { name: `Increase ${cake.name}` }));
    await user.press(screen.getByRole('button', { name: 'Add to cart' }));
    await user.press(screen.getByRole('button', { name: 'Go to cart' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Cart');

    await user.press(screen.getByRole('button', { name: 'Add to wishlist' }));
    expect(screen.getByRole('button', { name: 'Remove from wishlist' })).toBeSelected();
    // last: renderHook replaces what `screen` queries
    expect((await shopState()).cart).toEqual([{ product: cake, qty: 2 }]);
  });

  it('buys now: adds to cart and opens the cart', async () => {
    await render(screenFor(cake.id));
    await userEvent.setup().press(await screen.findByRole('button', { name: 'Buy now' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Cart');
    expect((await shopState()).cart).toEqual([{ product: cake, qty: 1 }]);
  });

  it('swaps in a related product and closes back to the page underneath', async () => {
    const user = userEvent.setup();
    await render(screenFor(cake.id));
    await user.press(await screen.findByRole('button', { name: `View ${otherCakes[0].name}` }));
    expect(useNavigation().setParams).toHaveBeenCalledWith({ id: otherCakes[0].id });

    await user.press(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(useNavigation().goBack).toHaveBeenCalledTimes(1));
  });

  it('shows not found for an unknown id', async () => {
    await render(screenFor(9999));
    expect(await screen.findByRole('header', { name: 'Product not found' })).toBeOnTheScreen();
  });
});
