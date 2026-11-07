import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Dropdown from './Dropdown';

type Args = React.ComponentProps<typeof Dropdown>;
const Stateful = (args: Args) => {
  const [value, setValue] = useState(args.value);
  return <Dropdown {...args} value={value} onChange={setValue} />;
};

const meta: Meta<typeof Dropdown> = { title: 'Molecules/Dropdown', component: Dropdown, render: Stateful };
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Sort: Story = {
  args: { label: 'Sort:', options: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Customer Reviews'], value: 'Relevance' },
};
