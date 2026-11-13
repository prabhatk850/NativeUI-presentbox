import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import PaymentMethods from './PaymentMethods';
import methods from '../../mocks/paymentMethods.json';

const [upi, visa] = methods.data;
const radio = (m: { label: string; detail: string }) => screen.getByRole('radio', { name: `${m.label}, ${m.detail}` });

describe('PaymentMethods screen', () => {
  it('marks the default method and lets you pick another', async () => {
    const user = userEvent.setup();
    await render(<PaymentMethods />);
    await screen.findByText(upi.label);
    expect(radio(upi)).toBeChecked();

    await user.press(radio(visa));
    expect(radio(visa)).toBeChecked();
    expect(radio(upi)).not.toBeChecked();
  });

  it('removes a method and moves the default when the default goes', async () => {
    await render(<PaymentMethods />);
    await screen.findByText(upi.label);
    await userEvent.setup().press(screen.getByRole('button', { name: `Remove ${upi.label}` }));
    expect(screen.queryByText(upi.label)).not.toBeOnTheScreen();
    expect(radio(visa)).toBeChecked();
  });
});
