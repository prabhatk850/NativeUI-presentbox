import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import ProductCard from './ProductCard';

const meta: Meta<typeof ProductCard> = { title: 'Molecules/ProductCard', component: ProductCard };
export default meta;
type Story = StoryObj<typeof ProductCard>;

const base = { rating: 4.5, name: 'eDisplay XG', price: 'USD 649.99', img: 'https://i.pinimg.com/1200x/2c/7d/ef/2c7defb55d5b41aecf4a71cebb617aa8.jpg' };
export const New: Story = { args: { ...base, type: 'New' } };
export const NoBadge: Story = { args: base };
export const ListRow: Story = { args: { ...base, type: 'New', layout: 'list' } };
