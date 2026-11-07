import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import Dropdown from './Dropdown';

const options = ['Relevance', 'Price: Low to High'];

describe('Dropdown', () => {
  it('shows label and current value, closed by default', async () => {
    await render(<Dropdown label="Sort:" options={options} value="Relevance" />);
    expect(screen.getByText('Sort:')).toBeOnTheScreen();
    expect(screen.getByRole('button', { expanded: false })).toHaveTextContent(/Relevance/);
    expect(screen.queryByRole('menuitem')).not.toBeOnTheScreen();
  });

  it('opens, marks the selected option and selects another', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    await render(<Dropdown options={options} value="Relevance" onChange={onChange} />);
    await user.press(screen.getByRole('button', { expanded: false }));
    expect(await screen.findByRole('menuitem', { name: 'Relevance' })).toBeSelected();
    await user.press(screen.getByRole('menuitem', { name: 'Price: Low to High' }));
    expect(onChange).toHaveBeenCalledWith('Price: Low to High');
    expect(screen.queryByRole('menuitem')).not.toBeOnTheScreen();
  });

  it('closes on an outside tap', async () => {
    const user = userEvent.setup();
    await render(<Dropdown options={options} value="Relevance" />);
    await user.press(screen.getByRole('button', { expanded: false }));
    await screen.findByRole('menuitem', { name: 'Relevance' });
    await user.press(screen.getByLabelText('Close menu'));
    expect(screen.queryByRole('menuitem')).not.toBeOnTheScreen();
  });
});
