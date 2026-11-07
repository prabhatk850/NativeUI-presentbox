import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Breadcrumb from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = { title: 'Molecules/Breadcrumb', component: Breadcrumb };
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const CurrentPageOnly: Story = { args: { items: [{ label: 'Products' }] } };
export const Nested: Story = { args: { items: [{ label: 'Products', to: '/products' }, { label: 'Flowers' }] } };
export const OnDark: Story = {
  args: { items: [{ label: 'Products' }], color: '#fff' },
  decorators: [(Story: React.ComponentType) => (
      <View style={{ backgroundColor: '#000', padding: 20 }}>
        <Story />
      </View>
    )],
};
