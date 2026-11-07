import React, { useState } from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Checkbox from './Checkbox';

type Args = React.ComponentProps<typeof Checkbox>;
const Stateful = (args: Args) => {
  const [checked, setChecked] = useState(args.checked);
  return <Checkbox {...args} checked={checked} onChange={setChecked} />;
};

const meta: Meta<typeof Checkbox> = { title: 'Atoms/Checkbox', component: Checkbox, render: Stateful };
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = { args: { label: 'In stock only', checked: false } };
export const Checked: Story = { args: { label: 'In stock only', checked: true } };
export const WithLink: Story = {
  args: { label: <Text>I agree to the <Text style={{ color: '#d32f2f' }}>Terms & Conditions</Text></Text>, checked: false },
};
