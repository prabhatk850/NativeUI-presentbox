import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import WishlistModal from './WishlistModal';
import { shop } from '../../../store';
import page from '../../../api/data/productPage.json';

const meta: Meta<typeof WishlistModal> = { title: 'Organisms/WishlistModal', component: WishlistModal, args: { open: true, onClose: () => {} } };
export default meta;
type Story = StoryObj<typeof WishlistModal>;

export const Empty: Story = { beforeEach: () => shop.reset() };
export const Scrolling: Story = {
  beforeEach: () => {
    shop.reset();
    page.data.slice(0, 12).forEach(shop.toggleWishlist);
  },
};
