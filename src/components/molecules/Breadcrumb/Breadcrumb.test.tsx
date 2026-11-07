import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { useLinkTo } from '@react-navigation/native';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  it('links earlier items and leaves the current page as plain text', async () => {
    await render(<Breadcrumb items={[{ label: 'Products', to: '/products' }, { label: 'Flowers' }]} />);
    await userEvent.setup().press(screen.getByRole('link', { name: 'Products' }));
    expect(useLinkTo()).toHaveBeenCalledWith('/products');
    expect(screen.getByText('Flowers')).toBeOnTheScreen();
    expect(screen.queryByRole('link', { name: 'Flowers' })).not.toBeOnTheScreen();
  });

  it('renders nothing without items', async () => {
    const { toJSON } = await render(<Breadcrumb />);
    expect(toJSON()).toBeNull();
  });
});
