import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { useLinkTo } from '@react-navigation/native';
import FooterMenuCard from './FooterMenuCard';

describe('FooterMenuCard', () => {
  it('renders heading and links', async () => {
    await render(<FooterMenuCard heading="Shop" items={[{ id: 1, lable: 'Best Sellers', url: '/products' }]} />);
    expect(screen.getByRole('header', { name: 'Shop' })).toBeOnTheScreen();
    await userEvent.setup().press(screen.getByRole('link', { name: 'Best Sellers' }));
    expect(useLinkTo()).toHaveBeenCalledWith('/products?category=Best%20Sellers');
  });

  it('renders with no items', async () => {
    await render(<FooterMenuCard heading="Empty" />);
    expect(screen.queryByRole('link')).not.toBeOnTheScreen();
  });
});
