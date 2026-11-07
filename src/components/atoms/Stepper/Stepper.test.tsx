import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import Stepper from './Stepper';

describe('Stepper', () => {
  it('steps up and down and stops at min', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const { rerender } = await render(<Stepper value={2} onChange={onChange} label="Cake" min={1} />);
    expect(screen.getByLabelText('Cake quantity 2')).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Increase Cake' }));
    await user.press(screen.getByRole('button', { name: 'Decrease Cake' }));
    expect(onChange.mock.calls).toEqual([[3], [1]]);

    await rerender(<Stepper value={1} onChange={onChange} label="Cake" min={1} />);
    expect(screen.getByRole('button', { name: 'Decrease Cake' })).toBeDisabled();
  });
});
