import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Header from './Header';

// Header floats (position absolute), so give it a dark stage to sit on.
const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ height: 700, backgroundColor: '#444' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;
export const Default: StoryObj<typeof Header> = {};
