import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import Filter from './Filter';

describe('Filter', () => {
  it('opens and closes the filter panel', async () => {
    const user = userEvent.setup();
    await render(<Filter />);
    expect(screen.queryByLabelText('Filters')).not.toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Filter' }));
    expect(screen.getByLabelText('Filters')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Close filters' }));
    expect(screen.queryByLabelText('Filters')).not.toBeOnTheScreen();
  });
});
