import React from 'react';
import { Linking } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import { useLinkTo } from '@react-navigation/native';
import Link from './Link';

describe('Link', () => {
  it('navigates to in-app paths through the linking config', async () => {
    await render(<Link href="/products">Shop</Link>);
    await userEvent.setup().press(screen.getByRole('link', { name: 'Shop' }));
    expect(useLinkTo()).toHaveBeenCalledWith('/products');
  });

  it('does nothing for #', async () => {
    await render(<Link>Shop</Link>);
    await userEvent.setup().press(screen.getByRole('link', { name: 'Shop' }));
    expect(useLinkTo()).not.toHaveBeenCalled();
  });

  it('opens external urls', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await render(<Link href="https://x.com">X</Link>);
    await userEvent.setup().press(screen.getByRole('link', { name: 'X' }));
    expect(open).toHaveBeenCalledWith('https://x.com');
  });

  it('shows the arrow only when asked', async () => {
    const { rerender } = await render(<Link>Shop</Link>);
    expect(screen.queryByTestId('link-arrow', { includeHiddenElements: true })).not.toBeOnTheScreen();
    await rerender(<Link arrow>Shop</Link>);
    expect(screen.getByTestId('link-arrow', { includeHiddenElements: true })).toBeOnTheScreen();
  });
});
