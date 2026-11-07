import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import ProductHeader, { CategoryBubbles } from './ProductHeader';

const categories = ['All Products', 'Flowers', 'Cakes', 'Plants'];

describe('ProductHeader', () => {
  it('renders sort and filter, without its own search bar', async () => {
    await render(<ProductHeader />);
    expect(screen.queryByPlaceholderText('Search...')).not.toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Filter' })).toBeOnTheScreen();
  });

  it('changes the sort order', async () => {
    const user = userEvent.setup();
    await render(<ProductHeader />);
    await user.press(screen.getByRole('button', { name: /Relevance/ }));
    await user.press(await screen.findByRole('menuitem', { name: 'Price: High to Low' }));
    expect(screen.getByRole('button', { name: /Price: High to Low/ })).toBeOnTheScreen();
  });

  it('reports layout toggle presses', async () => {
    const onLayoutChange = jest.fn();
    await render(<ProductHeader layout="list" onLayoutChange={onLayoutChange} />);
    expect(screen.getByRole('tab', { name: 'List view' })).toBeSelected();
    await userEvent.setup().press(screen.getByRole('tab', { name: 'Grid view' }));
    expect(onLayoutChange).toHaveBeenCalledWith('grid');
  });

  it('renders the page heading in the toolbar row', async () => {
    await render(<ProductHeader heading="Key Features" subheading="Must-haves" />);
    expect(screen.getByRole('header', { name: 'Key Features' })).toBeOnTheScreen();
    expect(screen.getByText('Must-haves')).toBeOnTheScreen();
  });

  it('shows bubbles inline when given', async () => {
    await render(<ProductHeader bubbles={<CategoryBubbles categories={categories} selected="All Products" onSelect={() => {}} />} />);
    expect(screen.getByRole('button', { name: 'All Products' })).toBeSelected();
  });
});

describe('CategoryBubbles', () => {
  it('reports the pressed category', async () => {
    const onSelect = jest.fn();
    await render(<CategoryBubbles categories={categories} selected="All Products" onSelect={onSelect} />);
    await userEvent.setup().press(screen.getByText('Flowers'));
    expect(onSelect).toHaveBeenCalledWith('Flowers');
  });
});
