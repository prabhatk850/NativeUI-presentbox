import React from 'react';
import { Text } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import MainLayout from './MainLayout';

describe('MainLayout', () => {
  it('renders header, page content and footer', async () => {
    await render(
      <MainLayout>
        <Text>page content</Text>
      </MainLayout>,
    );
    expect(screen.getByText('page content')).toBeOnTheScreen();
    expect(screen.getAllByText('PresentBox').length).toBeGreaterThan(0);
    expect(await screen.findByText(/All rights reserved/)).toBeOnTheScreen();
  });

  it('opens the auth modal from the header menu', async () => {
    const user = userEvent.setup();
    await render(
      <MainLayout overlay>
        <Text>page content</Text>
      </MainLayout>,
    );
    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    await user.press(screen.getByText('Sign in'));
    expect(await screen.findByText('Unlock the full experience')).toBeOnTheScreen();
  });
});
