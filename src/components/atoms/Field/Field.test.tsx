import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import Field from './Field';

describe('Field', () => {
  it('labels the input and reports typing', async () => {
    const onChangeText = jest.fn();
    await render(<Field label="City" onChangeText={onChangeText} />);
    await userEvent.setup().type(screen.getByLabelText('City'), 'Pune');
    expect(onChangeText).toHaveBeenLastCalledWith('Pune');
  });

  it('shows and hides a secure value', async () => {
    await render(<Field label="Password" secure />);
    expect(screen.getByLabelText('Password')).toHaveProp('secureTextEntry', true);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Show Password' }));
    expect(screen.getByLabelText('Password')).toHaveProp('secureTextEntry', false);
  });
});
