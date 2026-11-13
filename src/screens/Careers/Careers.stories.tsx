import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Careers from './Careers';
import { pageSection } from '../../mocks';

const meta: Meta<typeof Careers> = { title: 'Screens/Careers', component: Careers };
export default meta;
export const Default: StoryObj<typeof Careers> = { args: pageSection('careers', 'careersSection') };
