import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('is labelled and reflects checked state', async () => {
    await render(<Checkbox label="On sale" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox', { name: 'On sale' })).toBeChecked();
  });

  it('calls onChange with the new value when pressed', async () => {
    const onChange = jest.fn();
    await render(<Checkbox label="On sale" checked={false} onChange={onChange} />);
    await userEvent.setup().press(screen.getByText('On sale'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
