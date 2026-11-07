import React from 'react';
import { Text } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import Sheet from './Sheet';

describe('Sheet', () => {
  it('shows title, body and footer, and closes from the X', async () => {
    const onClose = jest.fn();
    await render(
      <Sheet open onClose={onClose} title="Wishlist" footer={<Text>footer</Text>}>
        <Text>body</Text>
      </Sheet>,
    );
    expect(screen.getByRole('header', { name: 'Wishlist' })).toBeOnTheScreen();
    expect(screen.getByText('body')).toBeOnTheScreen();
    expect(screen.getByText('footer')).toBeOnTheScreen();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing while closed', async () => {
    await render(
      <Sheet open={false} onClose={() => {}} title="Wishlist">
        <Text>body</Text>
      </Sheet>,
    );
    expect(screen.queryByText('body')).not.toBeOnTheScreen();
  });
});
