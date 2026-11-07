import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ReviewCard from './ReviewCard';

describe('ReviewCard', () => {
  it('renders the review with one star per rating point', async () => {
    await render(
      <ReviewCard
        data={{ name: 'Alice Johnson', rating: 4, title: 'Great Quality', message: 'Loved it.', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }}
      />,
    );
    expect(screen.getByText('Alice Johnson')).toBeOnTheScreen();
    expect(screen.getByText('Great Quality')).toBeOnTheScreen();
    expect(screen.getByText('Loved it.')).toBeOnTheScreen();
    expect(screen.getByText('★★★★')).toBeOnTheScreen();
  });
});
