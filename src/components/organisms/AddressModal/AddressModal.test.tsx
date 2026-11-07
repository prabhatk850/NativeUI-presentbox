import React from 'react';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import AddressModal from './AddressModal';
import { shop } from '../../../store';

const home = { label: 'Home' as const, name: 'Riya', phone: '9876543210', line: '12 MG Road', city: 'Pune', pincode: '411001' };

describe('AddressModal', () => {
  it('validates, saves, and lists the new address under the form as the selected one', async () => {
    const user = userEvent.setup();
    await render(<AddressModal open onClose={() => {}} />);
    expect(screen.getByRole('header', { name: 'Delivery address' })).toBeOnTheScreen();
    expect(screen.queryByRole('header', { name: /^Saved addresses/ })).not.toBeOnTheScreen();

    await user.type(screen.getByLabelText('Receiver’s name'), 'Aanya');
    await user.type(screen.getByLabelText('Mobile number'), '12345');
    await user.press(screen.getByRole('button', { name: 'Save address' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid 10-digit mobile number.');

    await user.clear(screen.getByLabelText('Mobile number'));
    await user.type(screen.getByLabelText('Mobile number'), '9876543210');
    await user.type(screen.getByLabelText('Pincode'), '110001');
    await user.type(screen.getByLabelText('House no., building, street'), 'Flat 4B, MG Road');
    await user.type(screen.getByLabelText('City'), 'New Delhi');
    await user.press(screen.getByRole('tab', { name: 'Work' }));
    await user.press(screen.getByRole('button', { name: 'Save address' }));

    expect(screen.getByRole('header', { name: 'Saved addresses (1)' })).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: /^Work: Aanya, Flat 4B, MG Road, New Delhi 110001/ })).toBeChecked();
    expect(screen.getByLabelText('Receiver’s name')).toHaveDisplayValue(''); // form is ready for the next one
  });

  it('shows the form and every saved address together, and selecting one closes', async () => {
    await act(async () => {
      shop.addAddress(home);
      shop.addAddress({ ...home, label: 'Work', line: '5 Tech Park' });
    });
    const onClose = jest.fn();
    await render(<AddressModal open onClose={onClose} />);
    expect(screen.getByLabelText('Receiver’s name')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Saved addresses (2)' })).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: /^Work/ })).toBeChecked();

    await userEvent.setup().press(screen.getByRole('radio', { name: /^Home/ }));
    expect(screen.getByRole('radio', { name: /^Home/ })).toBeChecked();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('removes a saved address', async () => {
    await act(async () => shop.addAddress(home));
    await render(<AddressModal open onClose={() => {}} />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Remove Home address' }));
    expect(screen.queryByRole('radio')).not.toBeOnTheScreen();
  });
});
