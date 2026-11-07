import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Link from './Link';

const meta: Meta<typeof Link> = { title: 'Atoms/Link', component: Link };
export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = { args: { href: '#', children: 'Shipping' } };
export const WithArrow: Story = { args: { href: '/products', children: 'Birthday', arrow: true } };
export const OnDark: Story = {
  args: { href: '#', children: 'Contact Us', color: '#fff', arrow: true },
  decorators: [(Story: React.ComponentType) => (
      <View style={{ backgroundColor: '#111', padding: 20 }}>
        <Story />
      </View>
    )],
};
