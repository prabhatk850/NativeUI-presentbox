import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CategoryCards from './CategoryCards';
import { pageSection } from '../../../mocks';

const { cards } = pageSection('home', 'categoryCardsSection');

describe('CategoryCards', () => {
  it('renders a card for every category', async () => {
    await render(<CategoryCards cards={cards} />);
    for (const card of cards) {
      expect(screen.getByText(card.title)).toBeOnTheScreen();
    }
  });
});
