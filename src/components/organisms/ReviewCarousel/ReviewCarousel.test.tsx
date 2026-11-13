import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ReviewCarousel from './ReviewCarousel';
import { pageSection } from '../../../mocks';

const { heading, subheading, reviews } = pageSection('home', 'reviewsSection');
const carousel = <ReviewCarousel heading={heading} subheading={subheading} reviews={reviews} />;

const layout = { nativeEvent: { layout: { x: 0, y: 0, width: 700, height: 400 } } };

describe('ReviewCarousel', () => {
  it('renders the reviews once the track is measured', async () => {
    await render(carousel);
    expect(screen.getByRole('header', { name: 'What customers are saying' })).toBeOnTheScreen();
    await fireEvent(screen.getByTestId('review-track'), 'layout', layout);
    expect(screen.getByText('Alice Johnson')).toBeOnTheScreen();
    expect(screen.getByText('David Brown')).toBeOnTheScreen();
  });

  it('enables prev and disables next as the track scrolls', async () => {
    await render(carousel);
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
