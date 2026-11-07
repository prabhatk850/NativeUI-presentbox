import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Tabs from './Tabs';

type Args = React.ComponentProps<typeof Tabs>;
const Stateful = (args: Args) => {
  const [value, setValue] = useState(args.value);
  return <Tabs {...args} value={value} onChange={setValue} />;
};

const meta: Meta<typeof Tabs> = { title: 'Atoms/Tabs', component: Tabs, render: Stateful };
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Underline: Story = {
  args: { tabs: [{ value: 'login', label: 'Sign In' }, { value: 'signup', label: 'Sign Up' }], value: 'login' },
};
export const PillOnDark: Story = {
  args: {
    variant: 'pill',
    trigger: 'hover',
    tabs: [{ value: 'occasions', label: 'Occasions' }, { value: 'categories', label: 'Categories' }, { value: 'about', label: 'About' }],
    value: 'occasions',
  },
  decorators: [(Story: React.ComponentType) => (
      <View style={{ backgroundColor: '#111', padding: 20 }}>
        <Story />
      </View>
    )],
};
