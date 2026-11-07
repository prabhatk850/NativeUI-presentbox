import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import SearchModal from './SearchModal';

const meta: Meta<typeof SearchModal> = { title: 'Organisms/SearchModal', component: SearchModal, args: { open: true, onClose: () => {} } };
export default meta;
export const Open: StoryObj<typeof SearchModal> = {};
