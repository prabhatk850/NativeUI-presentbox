import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Newsletter from './Newsletter';

const meta: Meta<typeof Newsletter> = {
  title: 'Molecules/Newsletter',
  component: Newsletter,
  decorators: [(Story: React.ComponentType) => (
      <View style={{ backgroundColor: '#b71c1c', padding: 20 }}>
        <Story />
      </View>
    )],
};
export default meta;
type Story = StoryObj<typeof Newsletter>;

export const Default: Story = {};
