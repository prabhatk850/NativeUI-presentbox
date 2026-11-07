import React from 'react';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import SearchModal from './SearchModal';
import { shop } from '../../../store';
import page from '../../../api/data/productPage.json';

const INPUT = 'Search gifts, categories, occasions';
const cakes = page.data.filter((p) => p.categoryId === 2);

describe('SearchModal', () => {
  it('starts with recent searches, category and occasion shortcuts, and trending gifts', async () => {
    await act(async () => shop.addRecentSearch('lamp'));
    const onClose = jest.fn();
    const user = userEvent.setup();
    await render(<SearchModal open onClose={onClose} />);
    expect(await screen.findByRole('header', { name: 'Trending now' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Search lamp' })).toBeOnTheScreen();
    for (const o of page.occasions) expect(screen.getByRole('button', { name: o.name })).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Search lamp' }));
    expect(screen.getByLabelText(INPUT)).toHaveDisplayValue('lamp');
    await user.press(screen.getByRole('button', { name: 'Clear search' }));

    await user.press(screen.getByRole('button', { name: 'Birthday' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Products', { category: 'Birthday' });
    expect(onClose).toHaveBeenCalled();
  });

  it('shows live grouped results and opens the full results, remembering the search', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    await render(<SearchModal open onClose={onClose} />);
    await screen.findByRole('header', { name: 'Trending now' });
    await user.type(screen.getByLabelText(INPUT), 'cake');

    expect(screen.getByRole('button', { name: 'Cakes' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: `Gifts (${cakes.length})` })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: `Open ${cakes[0].name}` })).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: `See all ${cakes.length} results for “cake”` }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Products', { q: 'cake' });
    expect(onClose).toHaveBeenCalled();
  });

  it('opens a product from the results', async () => {
    const user = userEvent.setup();
    await render(<SearchModal open onClose={() => {}} />);
    await screen.findByRole('header', { name: 'Trending now' });
    await user.type(screen.getByLabelText(INPUT), 'sunset');
    const lamp = page.data.find((p) => p.name === 'Sunset Projection Lamp')!;
    await user.press(screen.getByRole('button', { name: `Open ${lamp.name}` }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('ProductDetail', { id: lamp.id });
  });

  it('suggests other searches when nothing matches', async () => {
    const user = userEvent.setup();
    await render(<SearchModal open onClose={() => {}} />);
    await screen.findByRole('header', { name: 'Trending now' });
    await user.type(screen.getByLabelText(INPUT), 'zzz');
    expect(screen.getByRole('header', { name: 'No gifts found for “zzz”' })).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'roses' }));
    expect(screen.getByLabelText(INPUT)).toHaveDisplayValue('roses');
  });
});
