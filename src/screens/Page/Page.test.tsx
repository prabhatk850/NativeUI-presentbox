import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Page, { slugFor } from './Page';
import { linking } from '../../app/navigation';
import { mockPages } from '../../mocks';

const pageFor = (name: string) => <Page route={{ key: name, name } as never} navigation={{} as never} />;

describe('Page screen', () => {
  it('finds each route’s page by its URL path', () => {
    expect(slugFor('Home')).toBe('home');
    expect(slugFor('PaymentMethods')).toBe('payment-methods');
    const routes = Object.keys(linking.config!.screens).filter((r) => r !== 'ProductDetail');
    for (const r of routes) expect(mockPages).toHaveProperty([slugFor(r)]);
  });

  it('renders the blocks of the route’s page', async () => {
    await render(pageFor('Help'));
    expect(await screen.findByRole('header', { name: 'Help Center' })).toBeOnTheScreen();
  });

  it('renders built-in screens placed by an App screen block', async () => {
    await render(pageFor('Cart'));
    expect(await screen.findByRole('header', { name: 'Your Cart' })).toBeOnTheScreen();
  });
});
