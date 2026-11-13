import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import FilterPage from './FilterPage';
import { NO_FILTERS } from '../../../utils';
import page from '../../../mocks/productPage.json';

const occasions = page.occasions;

describe('FilterPage', () => {
  it('shows gender, occasion and price on the basic tab', async () => {
    await render(<FilterPage occasions={occasions} />);
    expect(screen.getByRole('tab', { name: 'Basic Filters' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'All' })).toBeSelected();
    for (const o of occasions) expect(screen.getByText(o.name)).toBeOnTheScreen();
    expect(screen.getByLabelText('Maximum price')).toBeOnTheScreen();
  });

  it('switches to more filters', async () => {
    const user = userEvent.setup();
    await render(<FilterPage />);
    await user.press(screen.getByRole('tab', { name: 'More Filters' }));
    expect(screen.getByText('Minimum Rating')).toBeOnTheScreen();
    await user.press(screen.getByRole('checkbox', { name: 'On sale only' }));
    expect(screen.getByRole('checkbox', { name: 'On sale only' })).toBeChecked();
  });

  it('applies gender, occasions, price and rating, then closes', async () => {
    const onApply = jest.fn();
    const onClose = jest.fn();
    const user = userEvent.setup();
    await render(<FilterPage occasions={occasions} onApply={onApply} onClose={onClose} />);
    await user.press(screen.getByRole('tab', { name: 'Women' }));
    await user.press(screen.getByText('Birthday'));
    await user.press(screen.getByText('Graduation'));
    await user.type(screen.getByLabelText('Maximum price'), '15a00'); // non-digits are dropped
    await user.press(screen.getByRole('tab', { name: 'More Filters' }));
    await user.press(screen.getByText('4★ & up'));
    await user.press(screen.getByRole('button', { name: 'Apply Filters' }));
    expect(onApply).toHaveBeenCalledWith({ ...NO_FILTERS, gender: 'Women', occasionIds: [1, 7], max: '1500', minRating: 4 });
    expect(onClose).toHaveBeenCalled();
  });

  it('starts from the applied filters and clears them all', async () => {
    const onApply = jest.fn();
    const user = userEvent.setup();
    await render(<FilterPage occasions={occasions} initial={{ ...NO_FILTERS, gender: 'Kids', occasionIds: [1] }} onApply={onApply} />);
    expect(screen.getByRole('tab', { name: 'Kids' })).toBeSelected();
    await user.press(screen.getByRole('button', { name: 'Clear all' }));
    await user.press(screen.getByRole('button', { name: 'Apply Filters' }));
    expect(onApply).toHaveBeenCalledWith(NO_FILTERS);
  });

  it('closes from the close button', async () => {
    const onClose = jest.fn();
    await render(<FilterPage onClose={onClose} />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Close filters' }));
    expect(onClose).toHaveBeenCalled();
  });
});
