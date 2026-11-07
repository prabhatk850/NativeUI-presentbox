import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen, userEvent, waitFor } from '@testing-library/react-native';
import ExpandableSheet from './ExpandableSheet';

const scrollTo = (y: number) => fireEvent.scroll(screen.getByTestId('sheet-scroll'), { nativeEvent: { contentOffset: { y } } });

describe('ExpandableSheet', () => {
  it('goes full screen when scrolled down and back to a card at the top', async () => {
    await render(
      <ExpandableSheet title="Pastel Tulip Bouquet" onClose={() => {}} footer={<Text>footer</Text>}>
        <Text>body</Text>
      </ExpandableSheet>,
    );
    const sheet = screen.getByLabelText('Pastel Tulip Bouquet');
    expect(sheet).not.toBeExpanded();
    expect(screen.getByText('body')).toBeOnTheScreen();
    expect(screen.getByText('footer')).toBeOnTheScreen();

    await scrollTo(120);
    expect(sheet).toBeExpanded();
    await scrollTo(60); // still scrolled: stays full screen
    expect(sheet).toBeExpanded();
    await scrollTo(0);
    expect(sheet).not.toBeExpanded();
  });

  it('animates away, then calls onClose', async () => {
    const onClose = jest.fn();
    await render(
      <ExpandableSheet title="Wishlist" onClose={onClose}>
        <Text>body</Text>
      </ExpandableSheet>,
    );
    await userEvent.setup().press(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
