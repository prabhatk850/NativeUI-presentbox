import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ReviewCarousel from './ReviewCarousel';

const layout = { nativeEvent: { layout: { x: 0, y: 0, width: 700, height: 400 } } };

describe('ReviewCarousel', () => {
  it('renders the reviews once the track is measured', async () => {
    await render(<ReviewCarousel />);
    expect(screen.getByRole('header', { name: 'What customers are saying' })).toBeOnTheScreen();
    await fireEvent(screen.getByTestId('review-track'), 'layout', layout);
    expect(screen.getByText('Alice Johnson')).toBeOnTheScreen();
    expect(screen.getByText('David Brown')).toBeOnTheScreen();
  });

  it('enables prev and disables next as the track scrolls', async () => {
    await render(<ReviewCarousel />);
    await fireEvent(screen.getByTestId('review-track'), 'layout', layout);
    expect(screen.getByRole('button', { name: 'Previous review' })).toBeDisabled();

    const list = screen.getByTestId('review-track').children[0];
    await fireEvent.scroll(list as never, {
      nativeEvent: { contentOffset: { x: 2000, y: 0 }, contentSize: { width: 2700, height: 400 }, layoutMeasurement: { width: 700, height: 400 } },
    });
    expect(screen.getByRole('button', { name: 'Previous review' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next review' })).toBeDisabled();
  });
});
