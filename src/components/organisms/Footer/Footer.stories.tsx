import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Footer from './Footer';

const meta: Meta<typeof Footer> = { title: 'Organisms/Footer', component: Footer, parameters: { layout: 'fullscreen' } };
export default meta;
export const Default: StoryObj<typeof Footer> = {};
