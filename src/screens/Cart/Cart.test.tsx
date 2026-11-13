import React from 'react';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import Cart from './Cart';
import { shop } from '../../store';
import page from '../../mocks/productPage.json';

// INR 899 cake + INR 449 chocolate bar
const cake = page.data.find((p) => p.name === 'Bento Lunchbox Cake')!;
const bar = page.data.find((p) => p.name === 'Matcha White Chocolate Bar')!;
const home = { label: 'Home' as const, name: 'Riya', phone: '9876543210', line: '12 MG Road', city: 'Pune', pincode: '411001' };

describe('Cart screen', () => {
  it('shows an empty state that leads to the products page', async () => {
    await render(<Cart />);
    expect(screen.getByText('Your cart is empty')).toBeOnTheScreen();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Browse gifts' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Products');
  });

  it('totals lines, charges delivery under the free threshold and updates quantities', async () => {
    await act(async () => shop.addToCart(cake));
    const user = userEvent.setup();
    await render(<Cart />);
    expect(screen.getByLabelText('Total INR 948')).toBeOnTheScreen(); // 899 + 49 delivery
    expect(screen.getByText('Add INR 100 more for free delivery.')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: `Increase ${cake.name}` }));
    expect(screen.getByLabelText(`${cake.name} quantity 2`)).toBeOnTheScreen();
    expect(screen.getByLabelText('Total INR 1,798')).toBeOnTheScreen(); // free delivery now
    expect(screen.getByText('Free')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: `Decrease ${cake.name}` }));
    await user.press(screen.getByRole('button', { name: `Remove ${cake.name}` }));
    expect(screen.getByText('Your cart is empty')).toBeOnTheScreen();
  });

  it('asks for an address before checkout, then shows the delivery address', async () => {
    await act(async () => shop.addToCart(bar));
    const user = userEvent.setup();
    await render(<Cart />);
    expect(screen.getByText('Where should we deliver?')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Proceed to checkout' }));
    expect(await screen.findByRole('header', { name: 'Delivery address' })).toBeOnTheScreen();

    await act(async () => shop.addAddress(home));
    expect(screen.getByText('Deliver to Riya · Home')).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Proceed to checkout' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/coming soon/);
  });
});
