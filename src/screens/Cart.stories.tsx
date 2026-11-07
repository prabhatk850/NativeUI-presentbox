import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Cart from './Cart';
import { shop } from '../store';
import page from '../api/data/productPage.json';

const meta: Meta<typeof Cart> = { title: 'Screens/Cart', component: Cart };
export default meta;
type Story = StoryObj<typeof Cart>;

export const Empty: Story = { beforeEach: () => shop.reset() };
export const WithItems: Story = {
  beforeEach: () => {
    shop.reset();
    page.data.slice(0, 3).forEach(shop.addToCart);
    shop.addToCart(page.data[0]);
    shop.addAddress({ label: 'Home', name: 'Aanya Sharma', phone: '9876543210', line: 'Flat 4B, Rose Apartments, MG Road', city: 'New Delhi', pincode: '110001' });
  },
};
