import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import Pagination, { pageItems } from './Pagination';

describe('pageItems', () => {
  it('lists every page when there are few', () => {
    expect(pageItems(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('collapses gaps into ellipses around the current page', () => {
    expect(pageItems(6, 12)).toEqual([1, null, 5, 6, 7, null, 12]);
  });

  it('shows a single skipped page instead of an ellipsis', () => {
    expect(pageItems(4, 10)).toEqual([1, 2, 3, 4, 5, null, 10]);
    expect(pageItems(7, 10)).toEqual([1, null, 6, 7, 8, 9, 10]);
  });
});

describe('Pagination', () => {
  it('renders nothing for a single page', async () => {
    await render(<Pagination page={1} totalPages={1} />);
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('marks the current page and disables prev on the first page', async () => {
    await render(<Pagination page={1} totalPages={5} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
  });

  it('calls onChange with the target page', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    await render(<Pagination page={3} totalPages={5} onChange={onChange} />);
    await user.press(screen.getByRole('button', { name: 'Page 4' }));
    await user.press(screen.getByRole('button', { name: 'Previous page' }));
    await user.press(screen.getByRole('button', { name: 'Page 3' }));
    expect(onChange.mock.calls).toEqual([[4], [2]]);
  });
});
