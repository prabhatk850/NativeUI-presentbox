import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import ProductHeader, { CategoryBubbles } from './ProductHeader';

const categories = ['All Products', 'Flowers', 'Cakes', 'Plants'];

const meta: Meta<typeof ProductHeader> = { title: 'Organisms/ProductHeader', component: ProductHeader };
export default meta;
type Story = StoryObj<typeof ProductHeader>;

export const WithHeading: Story = {
  args: { heading: 'Key Features of This Items', subheading: 'Discover the standout features that make this product a must-have.' },
};
export const WithInlineBubbles: Story = {
  args: {
    heading: 'Key Features of This Items',
    bubbles: <CategoryBubbles categories={categories} selected="All Products" onSelect={() => {}} />,
  },
};
