import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import About from './About';
import { pageSection } from '../../mocks';

const meta: Meta<typeof About> = { title: 'Screens/About', component: About };
export default meta;
export const Default: StoryObj<typeof About> = { args: pageSection('about', 'aboutSection') };
