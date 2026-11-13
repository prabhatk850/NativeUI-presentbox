import React from 'react';
import { act, render, renderHook, screen, userEvent } from '@testing-library/react-native';
import Auth from './Auth';
import { useShop } from '../../store';

describe('Auth', () => {
  it('renders nothing when closed', async () => {
    await render(<Auth open={false} />);
    expect(screen.queryByText('Unlock the full experience')).not.toBeOnTheScreen();
  });

  it('validates the email before signing in', async () => {
    await render(<Auth open />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Please enter a valid email address.')).toBeOnTheScreen();
  });

  it('signs in with valid details and closes', async () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await render(<Auth open onClose={onClose} />);
    await user.type(screen.getByLabelText('Email Address'), 'a@b.com');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.press(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Processing...')).toBeOnTheScreen();
    await act(() => jest.advanceTimersByTime(1000));
    jest.useRealTimers();
    expect(onClose).toHaveBeenCalledTimes(1);
    const { result } = await renderHook(() => useShop());
    expect(result.current.user).toEqual({ name: 'a', email: 'a@b.com' });
  });

  it('requires matching passwords and terms on sign up', async () => {
    const user = userEvent.setup();
    await render(<Auth open />);
    await user.press(screen.getByRole('tab', { name: 'Sign Up' }));
    await user.type(screen.getByLabelText('Email Address'), 'a@b.com');
    await user.type(screen.getByLabelText('Password'), 'one');
    await user.type(screen.getByLabelText('Confirm Password'), 'two');
    await user.press(screen.getByRole('button', { name: 'Create Account' }));
    expect(screen.getByText('Passwords do not match.')).toBeOnTheScreen();

    await user.clear(screen.getByLabelText('Confirm Password'));
    await user.type(screen.getByLabelText('Confirm Password'), 'one');
    await user.press(screen.getByRole('button', { name: 'Create Account' }));
    expect(screen.getByText('You must agree to the Terms & Conditions.')).toBeOnTheScreen();
  });

  it('toggles password visibility', async () => {
    await render(<Auth open />);
    expect(screen.getByLabelText('Password')).toHaveProp('secureTextEntry', true);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Show Password' }));
    expect(screen.getByLabelText('Password')).toHaveProp('secureTextEntry', false);
  });

  it('closes from the close button', async () => {
    const onClose = jest.fn();
    await render(<Auth open onClose={onClose} />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });
});
