import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import Product from './Product';
import page from '../../mocks/productPage.json';

// Product reads ?category= and ?q= from its route
const screenFor = (category?: string, q?: string) => {
  jest.spyOn(jest.requireMock('@react-navigation/native'), 'useRoute').mockReturnValue({ key: 'p', name: 'Products', params: category || q ? { category, q } : undefined });
  return <Product />;
};
const renderWith = (category?: string) => render(screenFor(category));
const flowers = page.data.filter((p) => p.categoryId === page.categories.find((c) => c.name === 'Flowers')!.id);
const birthday = page.occasions.find((o) => o.name === 'Birthday')!;
const forBirthday = page.data.filter((p) => p.occasionIds.includes(birthday.id));
const forMen = page.data.filter((p) => p.gender === 'Men' || p.gender === 'All');

describe('Product screen', () => {
  it('selects All Products by default', async () => {
    await renderWith();
    expect(screen.getByRole('button', { name: 'All Products' })).toBeSelected();
  });

  it('shows products as tiles by default and toggles to a list', async () => {
    const user = userEvent.setup();
    await renderWith();
    expect(screen.getByRole('tab', { name: 'Grid view' })).toBeSelected();
    expect(await screen.findAllByRole('button', { name: /^View / })).toHaveLength(page.data.length);

    await user.press(screen.getByRole('tab', { name: 'List view' }));
    expect(screen.getByRole('tab', { name: 'List view' })).toBeSelected();
    expect(screen.getAllByRole('button', { name: /^View / })).toHaveLength(page.data.length);

    await user.press(screen.getByRole('tab', { name: 'Grid view' }));
    expect(screen.getByRole('tab', { name: 'Grid view' })).toBeSelected();
  });

  it('shows one chip per data category and filters the grid by it', async () => {
    const user = userEvent.setup();
    await renderWith();
    for (const c of page.categories) expect(await screen.findByRole('button', { name: c.name })).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Flowers' }));
    expect(screen.getByRole('button', { name: 'Flowers' })).toBeSelected();
    expect(screen.getAllByRole('button', { name: /^View / })).toHaveLength(flowers.length);
    expect(screen.getByRole('button', { name: `View ${flowers[0].name}` })).toBeOnTheScreen();
  });

  it('selects a category passed from navigation', async () => {
    await renderWith('Flowers');
    expect(await screen.findAllByRole('button', { name: /^View / })).toHaveLength(flowers.length);
    expect(screen.getByRole('button', { name: 'Flowers' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'All Products' })).not.toBeSelected();
  });

  it('adds a chip for an occasion from navigation, shows its gifts, and follows navigation', async () => {
    const { rerender } = await renderWith('Birthday');
    expect(screen.getByRole('button', { name: 'Birthday' })).toBeSelected();
    expect(await screen.findAllByRole('button', { name: /^View / })).toHaveLength(forBirthday.length);

    await rerender(screenFor('Anniversary'));
    expect(screen.getByRole('button', { name: 'Anniversary' })).toBeSelected();
    expect(screen.queryByRole('button', { name: 'Birthday' })).not.toBeOnTheScreen();

    await rerender(screenFor());
    expect(screen.getByRole('button', { name: 'All Products' })).toBeSelected();
  });

  it('filters by gender from the filter panel, counts it on the button, and clears from the empty state', async () => {
    const user = userEvent.setup();
    await renderWith();
    await screen.findAllByRole('button', { name: /^View / });

    await user.press(screen.getByRole('button', { name: 'Filter' }));
    await user.press(screen.getByRole('tab', { name: 'Men' }));
    await user.press(screen.getByRole('button', { name: 'Apply Filters' }));
    expect(screen.getAllByRole('button', { name: /^View / })).toHaveLength(forMen.length);
    expect(screen.getByRole('button', { name: 'Filter (1)' })).toBeOnTheScreen();

    // Men + Self Care: nothing matches, so offer to clear
    await user.press(screen.getByRole('button', { name: 'Self Care' }));
    expect(screen.getByRole('header', { name: 'No gifts match these filters' })).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getAllByRole('button', { name: /^View / }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeOnTheScreen();
  });

  it('opens Best Sellers from the footer link as its own chip', async () => {
    const hot = page.data.filter((p) => p.type === 'Hot');
    await renderWith('Best Sellers');
    expect(screen.getByRole('button', { name: 'Best Sellers' })).toBeSelected();
    expect(await screen.findAllByRole('button', { name: /^View / })).toHaveLength(hot.length);
  });

  it('shows search results from the search screen, and clears the search', async () => {
    const lamps = page.data.filter((p) => /lamp/i.test(p.name));
    await render(screenFor(undefined, 'lamp'));
    expect(await screen.findAllByRole('button', { name: /^View / })).toHaveLength(lamps.length);
    expect(screen.getByText(`${lamps.length} results for `, { exact: false })).toBeOnTheScreen();

    await userEvent.setup().press(screen.getByRole('button', { name: 'Clear search' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Products', {});
  });
});
