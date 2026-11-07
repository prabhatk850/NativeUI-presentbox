import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import AddressModal from './AddressModal';
import { shop } from '../../../store';
import addresses from '../../../api/data/addresses.json';

const meta: Meta<typeof AddressModal> = { title: 'Organisms/AddressModal', component: AddressModal, args: { open: true, onClose: () => {} } };
export default meta;
type Story = StoryObj<typeof AddressModal>;

export const NoSavedAddresses: Story = { beforeEach: () => shop.reset() };
export const WithSavedAddresses: Story = {
  beforeEach: () => {
    shop.reset();
    addresses.data.forEach(({ id: _id, ...a }) => shop.addAddress(a as Parameters<typeof shop.addAddress>[0]));
    shop.selectAddress(1);
  },
};
