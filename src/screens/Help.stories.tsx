import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Help from './Help';

type Args = { topic?: string };
const meta: Meta<Args> = {
  title: 'Screens/Help',
  render: ({ topic }) => <Help route={{ key: 'h', name: 'Help', params: topic ? { topic } : undefined }} navigation={{} as never} />,
};
export default meta;
export const AllTopics: StoryObj<Args> = {};
export const Returns: StoryObj<Args> = { args: { topic: 'Returns' } };
