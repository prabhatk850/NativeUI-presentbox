import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import Newsletter from './Newsletter';

describe('Newsletter', () => {
  it('submits the entered email', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    await render(<Newsletter onSubmit={onSubmit} />);
    await user.type(screen.getByPlaceholderText('Enter your email'), 'a@b.com');
    await user.press(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubmit).toHaveBeenCalledWith('a@b.com');
    expect(screen.getByText('Thanks for subscribing!')).toBeOnTheScreen();
  });

  it('rejects an invalid email', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    await render(<Newsletter onSubmit={onSubmit} />);
    await user.type(screen.getByPlaceholderText('Enter your email'), 'not-an-email');
    await user.press(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid email address.')).toBeOnTheScreen();
  });
});
