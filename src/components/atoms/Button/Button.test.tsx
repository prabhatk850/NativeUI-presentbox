import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { ArrowUpRight, ShoppingBag } from '../../../icons';
import Button from './Button';

describe('Button', () => {
  it('renders only the label when nothing else is passed', async () => {
    await render(<Button label="Shop now" />);
    expect(screen.getByRole('button', { name: 'Shop now' })).toBeOnTheScreen();
    expect(screen.queryByTestId('button-extended')).not.toBeOnTheScreen();
  });

  it('renders the icon inside the pill', async () => {
    await render(<Button label="Add" icon={ShoppingBag} />);
    expect(screen.getByTestId('button-pill')).toHaveTextContent('Add');
  });

  it('renders extended only, without a pill', async () => {
    await render(<Button extendedIcon={ArrowUpRight} accessibilityLabel="Open" />);
    expect(screen.getByRole('button', { name: 'Open' })).toBeOnTheScreen();
    expect(screen.getByTestId('button-extended')).toBeOnTheScreen();
    expect(screen.queryByTestId('button-pill')).not.toBeOnTheScreen();
  });

  it('applies colors', async () => {
    await render(<Button label="Go" color="#000000" textColor="#ff0000" />);
    expect(screen.getByTestId('button-pill')).toHaveStyle({ backgroundColor: '#000000' });
    expect(screen.getByText('Go')).toHaveStyle({ color: '#ff0000' });
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Go" onPress={onPress} />);
    await userEvent.setup().press(screen.getByRole('button', { name: 'Go' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
