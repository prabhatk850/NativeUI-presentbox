import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CategoryCards from './CategoryCards';
import cards from '../../../api/data/categoryCards.json';

describe('CategoryCards', () => {
  it('renders a card for every category from the API', async () => {
    await render(<CategoryCards />);
    for (const card of cards.data) {
      expect(await screen.findByText(card.title)).toBeOnTheScreen();
    }
  });
});
