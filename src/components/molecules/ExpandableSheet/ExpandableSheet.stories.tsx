import React from 'react';
import { Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import ExpandableSheet from './ExpandableSheet';

const meta: Meta<typeof ExpandableSheet> = { title: 'Molecules/ExpandableSheet', component: ExpandableSheet };
export default meta;
export const ScrollToExpand: StoryObj<typeof ExpandableSheet> = {
  args: {
    title: 'Scroll me',
    onClose: () => {},
    children: (
      <View style={{ padding: 16, gap: 12 }}>
        {Array.from({ length: 40 }, (_, i) => (
          <Text key={i}>Row {i + 1}: scroll down to go full screen, back to the top to shrink.</Text>
        ))}
      </View>
    ),
    footer: <Text>Pinned footer</Text>,
  },
};
