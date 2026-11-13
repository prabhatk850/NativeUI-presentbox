import React from 'react';
import { Dimensions } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';
import Footer from './Footer';
import footer from '../../../mocks/footer.json';

const setWidth = (width: number) =>
  act(() => {
    const size = { width, height: 900, scale: 1, fontScale: 1 };
    Dimensions.set({ window: size, screen: size });
  });

afterEach(() => setWidth(750)); // Jest default

describe('Footer', () => {
  it('shows the brand, newsletter and copyright', async () => {
    await render(<Footer />);
    expect(await screen.findByText('PresentBox')).toBeOnTheScreen();
    expect(screen.getByText('Subscribe to our Newsletter')).toBeOnTheScreen();
    expect(screen.getByText(/2026 PresentBox. All rights reserved/)).toBeOnTheScreen();
  });

  it('renders every footer section from the API', async () => {
    await render(<Footer />);
    for (const section of footer.data.section) {
      expect(await screen.findByText(section.heading)).toBeOnTheScreen();
    }
  });

  it('collapses sections into one block of links on phones', async () => {
    await setWidth(390);
    await render(<Footer />);
    expect(await screen.findByText('Subscribe to our Newsletter')).toBeOnTheScreen();
    for (const section of footer.data.section) {
      expect(screen.queryByText(section.heading)).not.toBeOnTheScreen();
      for (const item of section.item) expect(screen.getByText(item.lable)).toBeOnTheScreen();
    }
  });
});
