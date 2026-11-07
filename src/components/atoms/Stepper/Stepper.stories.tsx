import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Stepper from './Stepper';

type Args = React.ComponentProps<typeof Stepper>;
const Stateful = (args: Args) => {
  const [value, setValue] = useState(args.value);
  return <Stepper {...args} value={value} onChange={setValue} />;
};

const meta: Meta<typeof Stepper> = { title: 'Atoms/Stepper', component: Stepper, render: Stateful };
export default meta;
export const Quantity: StoryObj<typeof Stepper> = { args: { value: 1, min: 1, label: 'Bento Lunchbox Cake', onChange: () => {} } };
