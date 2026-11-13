import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import FooterMenuCard from './FooterMenuCard';

const meta: Meta<typeof FooterMenuCard> = {
  title: 'Molecules/FooterMenuCard',
  component: FooterMenuCard,
  decorators: [(Story: React.ComponentType) => (
      <View style={{ backgroundColor: '#b71c1c', padding: 20 }}>
        <Story />
      </View>
    )],
};
export default meta;
type Story = StoryObj<typeof FooterMenuCard>;

export const Default: Story = {
  args: { heading: 'Help', arrow: true, items: [{ id: '1', lable: 'Contact Us', url: '#' }, { id: '2', lable: 'Shipping', url: '#' }] },
};
