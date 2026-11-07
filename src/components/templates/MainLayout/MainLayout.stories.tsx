import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import MainLayout from './MainLayout';

const meta: Meta<typeof MainLayout> = { title: 'Templates/MainLayout', component: MainLayout, parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj<typeof MainLayout>;

export const Default: Story = { args: { children: <Text>page content</Text> } };
