import React from 'react';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import { shop } from '../store';
import page from '../api/data/productPage.json';

describe('Profile screen', () => {
  it('asks to sign in when signed out', async () => {
    await render(<Profile />);
    expect(screen.getByRole('header', { name: 'You’re not signed in' })).toBeOnTheScreen();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Unlock the full experience')).toBeOnTheScreen();
  });

  it('shows the user with cart, wishlist and address shortcuts, and signs out', async () => {
    await act(async () => {
      shop.signIn({ name: 'Aanya Sharma', email: 'aanya@example.com' });
      shop.addToCart(page.data[0]);
      shop.toggleWishlist(page.data[1]);
    });
    const user = userEvent.setup();
    await render(<Profile />);
    expect(screen.getByRole('header', { name: 'Aanya Sharma' })).toBeOnTheScreen();
    expect(screen.getByText('AS')).toBeOnTheScreen();
    expect(screen.getByText('aanya@example.com')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'My Cart' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Cart');

    await user.press(screen.getByRole('button', { name: 'Wishlist' }));
    expect(await screen.findByRole('header', { name: 'Wishlist (1)' })).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Sign out' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Home');
    expect(screen.getByRole('header', { name: 'You’re not signed in' })).toBeOnTheScreen();
  });
});
