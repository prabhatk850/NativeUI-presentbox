import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import ProductDetail from './ProductDetail';

type Args = { id: number };
const meta: Meta<Args> = {
  title: 'Screens/ProductDetail',
  render: ({ id }) => <ProductDetail route={{ key: 'd', name: 'ProductDetail', params: { id } }} navigation={{} as never} />,
};
export default meta;
export const Cake: StoryObj<Args> = { args: { id: 5 } };
export const NotFound: StoryObj<Args> = { args: { id: 9999 } };
