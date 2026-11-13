import React from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { LayoutGrid, List } from '../../../theme/icons';
import Tabs from './Tabs';

const tabs = [{ value: 'a', label: 'First' }, { value: 'b', label: 'Second' }];

describe('Tabs', () => {
  it('marks the active tab as selected', async () => {
    await render(<Tabs tabs={tabs} value="b" />);
    expect(screen.getByRole('tab', { name: 'Second' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'First' })).not.toBeSelected();
  });

  it('calls onChange with the pressed tab value', async () => {
    const onChange = jest.fn();
    await render(<Tabs tabs={tabs} value="a" onChange={onChange} />);
    await userEvent.setup().press(screen.getByRole('tab', { name: 'Second' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('names icon-only segmented tabs by their label', async () => {
    const onChange = jest.fn();
    await render(
      <Tabs
        variant="segmented"
        tabs={[{ value: 'list', label: 'List view', icon: List }, { value: 'grid', label: 'Grid view', icon: LayoutGrid }]}
        value="list"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('tab', { name: 'List view' })).toBeSelected();
    await userEvent.setup().press(screen.getByRole('tab', { name: 'Grid view' }));
    expect(onChange).toHaveBeenCalledWith('grid');
  });

  it('selects on hover only with trigger=hover', async () => {
    const onChange = jest.fn();
    const { rerender } = await render(<Tabs tabs={tabs} value="a" onChange={onChange} />);
    await fireEvent(screen.getByRole('tab', { name: 'Second' }), 'hoverIn');
    expect(onChange).not.toHaveBeenCalled();

    await rerender(<Tabs tabs={tabs} value="a" onChange={onChange} variant="pill" trigger="hover" />);
    await fireEvent(screen.getByRole('tab', { name: 'Second' }), 'hoverIn');
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
