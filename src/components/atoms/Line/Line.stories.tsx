import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Line from './Line';

const meta: Meta<typeof Line> = {
  title: 'Atoms/Line',
  component: Line,
  decorators: [(Story: React.ComponentType) => (
      <View style={{ backgroundColor: '#000', padding: 20 }}>
        <Story />
      </View>
    )],
};
export default meta;
type Story = StoryObj<typeof Line>;

export const Default: Story = {};
export const HalfWidth: Story = { args: { width: '50%' } };
