import React from 'react';
import { render, renderHook, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import Orders from './Orders';
import { useShop } from '../../store';
import orders from '../../mocks/orders.json';
import page from '../../mocks/productPage.json';

const first = orders.data[0];
const firstItems = first.items.map((i) => ({ product: page.data.find((p) => p.id === i.productId)!, qty: i.qty }));

describe('Orders screen', () => {
  it('lists every order with its status, items and total', async () => {
    await render(<Orders />);
    for (const o of orders.data) expect(await screen.findByLabelText(`Order ${o.id}, ${o.status}`)).toBeOnTheScreen();
    expect(screen.getByText(first.statusNote)).toBeOnTheScreen();
    expect(screen.getByText('Placed on 14 Oct 2026')).toBeOnTheScreen();
    expect(screen.getByText('Total INR 2,497')).toBeOnTheScreen(); // lamp 1,499 + 2 × clips 499
  });

  it('opens an ordered gift and buys a whole order again', async () => {
    const user = userEvent.setup();
    await render(<Orders />);
    await user.press(await screen.findByRole('button', { name: `View ${firstItems[0].product.name}` }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('ProductDetail', { id: firstItems[0].product.id });

    await user.press(screen.getByRole('button', { name: `Buy order ${first.id} again` }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Cart');
    // last: renderHook replaces what `screen` queries
    expect((await renderHook(() => useShop())).result.current.cart).toEqual(firstItems);
  });
});
