import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Truck } from '../../../icons';
import FeatureCard from './FeatureCard';

describe('FeatureCard', () => {
  it('renders the label', async () => {
    await render(<FeatureCard icon={Truck} label="Fast Shipping" />);
    expect(screen.getByText('Fast Shipping')).toBeOnTheScreen();
  });
});
