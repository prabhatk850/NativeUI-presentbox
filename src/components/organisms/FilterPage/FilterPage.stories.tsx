import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import FilterPage from './FilterPage';

// same stage as the Filter modal: full-height dimmed backdrop, panel centred
const meta: Meta<typeof FilterPage> = {
  title: 'Organisms/FilterPage',
  component: FilterPage,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ height: 760, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;
export const Default: StoryObj<typeof FilterPage> = {};
