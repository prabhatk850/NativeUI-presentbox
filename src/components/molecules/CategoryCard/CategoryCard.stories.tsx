import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import CategoryCard from './CategoryCard';

const img = 'https://i.pinimg.com/1200x/2c/7d/ef/2c7defb55d5b41aecf4a71cebb617aa8.jpg';
const meta: Meta<typeof CategoryCard> = { title: 'Molecules/CategoryCard', component: CategoryCard };
export default meta;
type Story = StoryObj<typeof CategoryCard>;

export const Big: Story = {
  args: { variant: 'big', title: 'All Products', description: 'Make their day unforgettable.', image: img, button: { name: 'Browse All Products', color: '#d32f2f' } },
};
export const Rectangle: Story = {
  args: { variant: 'reactangle', title: 'Hampers', description: 'Curated boxes for every taste.', image: img, button: { name: 'Shop now', color: '#fff', textColor: 'black' } },
};
export const SquareArrowOnly: Story = {
  args: { variant: 'square', title: 'Flowers', description: 'Fresh bouquets delivered today.', image: img, button: { color: '#fff', textColor: 'black' } },
};
