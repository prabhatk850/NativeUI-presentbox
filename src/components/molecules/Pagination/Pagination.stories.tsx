import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Pagination from './Pagination';

type Args = React.ComponentProps<typeof Pagination>;
const Stateful = (args: Args) => {
  const [page, setPage] = useState(args.page);
  return <Pagination {...args} page={page} onChange={setPage} />;
};

const meta: Meta<typeof Pagination> = { title: 'Molecules/Pagination', component: Pagination, render: Stateful };
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Few: Story = { args: { page: 1, totalPages: 5 } };
export const Many: Story = { args: { page: 6, totalPages: 20 } };
