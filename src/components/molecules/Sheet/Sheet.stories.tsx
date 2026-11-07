import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Sheet from './Sheet';

const meta: Meta<typeof Sheet> = { title: 'Molecules/Sheet', component: Sheet };
export default meta;
export const Open: StoryObj<typeof Sheet> = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Sheet title',
    children: Array.from({ length: 30 }, (_, i) => <Text key={i}>Scrollable row {i + 1}</Text>),
    footer: <Text>Pinned footer</Text>,
  },
};
