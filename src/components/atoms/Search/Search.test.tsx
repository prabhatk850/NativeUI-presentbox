import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import Search from './Search';

describe('Search', () => {
  it('accepts typed text', async () => {
    await render(<Search />);
    const input = screen.getByPlaceholderText('Search...');
    await userEvent.setup().type(input, 'cake');
    expect(input).toHaveDisplayValue('cake');
  });
});
