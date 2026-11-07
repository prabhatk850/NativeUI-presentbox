import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PageHeading from './PageHeading';

describe('PageHeading', () => {
  it('renders heading and subheading', async () => {
    await render(<PageHeading heading="All Products" subheading="Find the right gift." />);
    expect(screen.getByRole('header', { name: 'All Products' })).toBeOnTheScreen();
    expect(screen.getByText('Find the right gift.')).toBeOnTheScreen();
  });

  it('omits the subheading when not given', async () => {
    await render(<PageHeading heading="All Products" />);
    expect(screen.queryByText('Find the right gift.')).not.toBeOnTheScreen();
  });
});
