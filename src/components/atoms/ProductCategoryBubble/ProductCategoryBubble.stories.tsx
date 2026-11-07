import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import ProductCategoryBubble from './ProductCategoryBubble';

const meta: Meta<typeof ProductCategoryBubble> = { title: 'Atoms/ProductCategoryBubble', component: ProductCategoryBubble };
export default meta;
type Story = StoryObj<typeof ProductCategoryBubble>;

export const Default: Story = { args: { category: 'Fashion' } };
export const Active: Story = { args: { category: 'Fashion', isActive: true } };
