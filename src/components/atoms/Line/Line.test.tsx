import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Line from './Line';

describe('Line', () => {
  it('renders full width by default', async () => {
    await render(<Line />);
    expect(screen.getByTestId('line')).toHaveStyle({ width: '100%' });
  });

  it('accepts a custom width', async () => {
    await render(<Line width="50%" />);
    expect(screen.getByTestId('line')).toHaveStyle({ width: '50%' });
  });
});
