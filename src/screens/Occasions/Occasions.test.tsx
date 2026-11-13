import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import Occasions from './Occasions';
import page from '../../mocks/productPage.json';

describe('Occasions screen', () => {
  it('shows a tile per occasion with its gift count, and opens that occasion', async () => {
    await render(<Occasions />);
    for (const o of page.occasions) {
      const count = page.data.filter((p) => p.occasionIds.includes(o.id)).length;
      expect(await screen.findByRole('button', { name: `${o.name}, ${count} gifts` })).toBeOnTheScreen();
    }
    await userEvent.setup().press(screen.getByRole('button', { name: /^Housewarming,/ }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Products', { category: 'Housewarming' });
  });
});
