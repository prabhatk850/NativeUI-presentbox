import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Auth from './Auth';

const meta: Meta<typeof Auth> = { title: 'Screens/Auth', component: Auth };
export default meta;
export const Open: StoryObj<typeof Auth> = { args: { open: true } };
