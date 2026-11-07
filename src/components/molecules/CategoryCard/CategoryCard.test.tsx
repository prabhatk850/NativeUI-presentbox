import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import CategoryCard from './CategoryCard';

const base = { title: 'Flowers', description: 'Fresh', image: 'https://example.com/a.jpg' };

describe('CategoryCard', () => {
  it('renders title, description and image', async () => {
    await render(<CategoryCard {...base} />);
    expect(screen.getByText('Flowers')).toBeOnTheScreen();
    expect(screen.getByText('Fresh')).toBeOnTheScreen();
    expect(screen.getByLabelText('Flowers')).toHaveProp('source', { uri: 'https://example.com/a.jpg' });
  });

  it('hides the button when none is passed', async () => {
    await render(<CategoryCard {...base} />);
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('shows an arrow-only button when button has no name', async () => {
    await render(<CategoryCard {...base} button={{}} />);
    expect(screen.getByRole('button', { name: 'Explore Flowers' })).toBeOnTheScreen();
    expect(screen.queryByTestId('button-pill')).not.toBeOnTheScreen();
  });

  it('navigates to products with its category', async () => {
    await render(<CategoryCard {...base} button={{ name: 'Explore' }} />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Explore' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Products', { category: 'Flowers' });
  });
});
