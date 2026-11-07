import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import ProductCategoryBubble from './ProductCategoryBubble';

describe('ProductCategoryBubble', () => {
  it('shows the category and handles presses', async () => {
    const onPress = jest.fn();
    await render(<ProductCategoryBubble category="Fashion" onPress={onPress} />);
    await userEvent.setup().press(screen.getByText('Fashion'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('marks the active bubble as selected', async () => {
    await render(<ProductCategoryBubble category="Fashion" isActive />);
    expect(screen.getByRole('button', { name: 'Fashion' })).toBeSelected();
  });
});
