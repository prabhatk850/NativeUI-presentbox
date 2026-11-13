import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import PaymentMethods from './PaymentMethods';

const meta: Meta<typeof PaymentMethods> = { title: 'Screens/PaymentMethods', component: PaymentMethods };
export default meta;
export const Default: StoryObj<typeof PaymentMethods> = {};
