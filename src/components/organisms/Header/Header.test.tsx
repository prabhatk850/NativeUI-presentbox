import React from 'react';
import { Dimensions, Text } from 'react-native';
import { act, render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { useLinkTo, useNavigation } from '@react-navigation/native';
import Header from './Header';
import { shop } from '../../../store';
import page from '../../../mocks/productPage.json';

const setWidth = (width: number) =>
  act(() => {
    const size = { width, height: 900, scale: 1, fontScale: 1 };
    Dimensions.set({ window: size, screen: size });
  });

afterEach(() => setWidth(750)); // Jest default (phone-sized)

describe('Header on wide screens', () => {
  beforeEach(() => setWidth(1280));

  it('renders the logo and no breadcrumb on home', async () => {
    await render(<Header />);
    expect(screen.getByText('PresentBox')).toBeOnTheScreen();
    expect(screen.queryByText('Products')).not.toBeOnTheScreen();
  });

  it('shows the page breadcrumb next to the logo', async () => {
    jest.spyOn(jest.requireMock('@react-navigation/native'), 'useRoute').mockReturnValue({ key: 'p', name: 'Products' } as never);
    await render(<Header />);
    expect(screen.getByText('Products')).toBeOnTheScreen();
    jest.restoreAllMocks();
  });

  it('opens the auth modal on Sign in', async () => {
    const onOpenAuth = jest.fn();
    await render(<Header onOpenAuth={onOpenAuth} />);
    await userEvent.setup().press(screen.getByText('Sign in'));
    expect(onOpenAuth).toHaveBeenCalledTimes(1);
  });

  it('puts delivery address, wishlist and cart in the right pill', async () => {
    await render(<Header />);
    expect(screen.getByText('Add address')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Wishlist' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Cart' })).toBeOnTheScreen();
  });

  it('opens My Profile instead of sign in once signed in', async () => {
    await act(async () => shop.signIn({ name: 'Aanya', email: 'aanya@example.com' }));
    await render(<Header />);
    expect(screen.queryByText('Sign in')).not.toBeOnTheScreen();
    await userEvent.setup().press(screen.getByText('My Profile'));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Profile');
  });

  it('renders page content in the centre slot', async () => {
    await render(<Header center={<Text>centre</Text>} />);
    expect(screen.getByText('centre')).toBeOnTheScreen();
  });
});

describe('Header on phones', () => {
  it('collapses into a single bar with a drill-down menu', async () => {
    const onOpenAuth = jest.fn();
    const user = userEvent.setup();
    await render(<Header onOpenAuth={onOpenAuth} />);
    expect(screen.queryByText('Sign in')).not.toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    await user.press(await screen.findByRole('button', { name: 'Occasions' }));
    expect(screen.getByText('Birthday')).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Back' }));
    expect(screen.queryByText('Birthday')).not.toBeOnTheScreen();

    await user.press(screen.getByText('Sign in'));
    expect(onOpenAuth).toHaveBeenCalledTimes(1);
    // the panel animates out before it unmounts
    await waitFor(() => expect(screen.queryByText('Occasions')).not.toBeOnTheScreen());
  });

  it('closes from the X and follows section links', async () => {
    const user = userEvent.setup();
    await render(<Header />);
    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    await user.press(await screen.findByRole('button', { name: 'Close menu' }));
    await waitFor(() => expect(screen.queryByText('Occasions')).not.toBeOnTheScreen());

    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    await user.press(await screen.findByRole('button', { name: 'Categories' }));
    await user.press(screen.getByRole('link', { name: 'Flowers' }));
    expect(useLinkTo()).toHaveBeenCalledWith('/products?category=Flowers');
  });

  it('opens and closes the search screen', async () => {
    const user = userEvent.setup();
    await render(<Header />);
    await user.press(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByLabelText('Search gifts, categories, occasions')).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByLabelText('Search gifts, categories, occasions')).not.toBeOnTheScreen();
  });

  it('shows wishlist and cart counts; cart opens the cart screen, wishlist its modal', async () => {
    await act(async () => {
      shop.addToCart(page.data[0]);
      shop.addToCart(page.data[0]);
      shop.toggleWishlist(page.data[1]);
    });
    const user = userEvent.setup();
    await render(<Header />);
    await user.press(screen.getByRole('button', { name: 'Cart, 2 items' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Cart');

    await user.press(screen.getByRole('button', { name: 'Wishlist, 1 item' }));
    expect(await screen.findByRole('header', { name: 'Wishlist (1)' })).toBeOnTheScreen();
  });

  it('shows the delivery address strip and opens the address modal', async () => {
    const user = userEvent.setup();
    await render(<Header />);
    await user.press(screen.getByRole('button', { name: 'Add delivery address' }));
    expect(await screen.findByRole('header', { name: 'Delivery address' })).toBeOnTheScreen();

    await act(async () => shop.addAddress({ label: 'Home', name: 'Riya', phone: '9876543210', line: '12 MG Road', city: 'Pune', pincode: '411001' }));
    expect(screen.getByRole('button', { name: 'Deliver to Riya · Pune 411001. Change address' })).toBeOnTheScreen();
  });

  it('swaps Sign in for a My Profile row under Home once signed in', async () => {
    await act(async () => shop.signIn({ name: 'Aanya', email: 'aanya@example.com' }));
    const user = userEvent.setup();
    await render(<Header />);
    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByText('My Profile')).toBeOnTheScreen();
    expect(screen.queryByText('Sign in')).not.toBeOnTheScreen();

    await user.press(screen.getByText('My Profile'));
    expect(useLinkTo()).toHaveBeenCalledWith('/profile');
  });

  it('lists Orders, Payment Methods and Help Center, and no About', async () => {
    const user = userEvent.setup();
    await render(<Header />);
    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    expect(await screen.findByRole('button', { name: 'Categories' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'About' })).not.toBeOnTheScreen();

    await user.press(screen.getByRole('link', { name: 'Orders' }));
    expect(useLinkTo()).toHaveBeenCalledWith('/orders');
    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    await user.press(await screen.findByRole('link', { name: 'Payment Methods' }));
    expect(useLinkTo()).toHaveBeenCalledWith('/payment-methods');
    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    await user.press(await screen.findByRole('link', { name: 'Help Center' }));
    expect(useLinkTo()).toHaveBeenCalledWith('/help');
  });

  it('drills into every occasion and category from the product data', async () => {
    const user = userEvent.setup();
    await render(<Header />);
    await user.press(screen.getByRole('button', { name: 'Open menu' }));
    await user.press(await screen.findByRole('button', { name: 'Occasions' }));
    for (const o of page.occasions) expect(screen.getByRole('link', { name: o.name })).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Back' }));
    await user.press(screen.getByRole('button', { name: 'Categories' }));
    for (const c of page.categories) expect(screen.getByRole('link', { name: c.name })).toBeOnTheScreen();
    await user.press(screen.getByRole('link', { name: 'Room Decor' }));
    expect(useLinkTo()).toHaveBeenCalledWith('/products?category=Room%20Decor');
  });
});
