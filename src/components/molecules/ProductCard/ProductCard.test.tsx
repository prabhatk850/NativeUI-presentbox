import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import ProductCard from './ProductCard';

const props = { type: 'New', rating: 4.5, name: 'eDisplay XG', price: 'USD 649.99', img: 'https://example.com/a.jpg' };

describe('ProductCard', () => {
  it('renders badge, rating, name, price and image', async () => {
    await render(<ProductCard {...props} />);
    expect(screen.getByText('New')).toBeOnTheScreen();
    expect(screen.getByText('4.5')).toBeOnTheScreen();
    expect(screen.getByText('eDisplay XG')).toBeOnTheScreen();
    expect(screen.getByText('USD 649.99')).toBeOnTheScreen();
    expect(screen.getByLabelText('eDisplay XG')).toHaveProp('source', { uri: 'https://example.com/a.jpg' });
  });

  it('is a single tappable card in both layouts', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    const { rerender } = await render(<ProductCard {...props} onPress={onPress} />);
    await user.press(screen.getByRole('button', { name: 'View eDisplay XG' }));
    await rerender(<ProductCard {...props} layout="list" onPress={onPress} />);
    expect(screen.getByText('USD 649.99')).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'View eDisplay XG' }));
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('hides the badge when no type is given', async () => {
    await render(<ProductCard {...props} type={undefined} />);
    expect(screen.queryByText('New')).not.toBeOnTheScreen();
  });

  it('toggles the wishlist heart and adds to cart without opening the card', async () => {
    const onPress = jest.fn();
    const onToggleWishlist = jest.fn();
    const onAddToCart = jest.fn();
    const user = userEvent.setup();
    const { rerender } = await render(<ProductCard {...props} onPress={onPress} onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} />);
    await user.press(screen.getByRole('button', { name: 'Add eDisplay XG to wishlist' }));
    await user.press(screen.getByRole('button', { name: 'Add eDisplay XG to cart' }));
    expect(onToggleWishlist).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();

    await rerender(<ProductCard {...props} wishlisted onToggleWishlist={onToggleWishlist} />);
    expect(screen.getByRole('button', { name: 'Remove eDisplay XG from wishlist' })).toBeSelected();
    expect(screen.queryByRole('button', { name: 'Add eDisplay XG to cart' })).not.toBeOnTheScreen();
  });
});
