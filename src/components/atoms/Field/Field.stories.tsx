import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Field from './Field';

const meta: Meta<typeof Field> = { title: 'Atoms/Field', component: Field };
export default meta;
export const Text: StoryObj<typeof Field> = { args: { label: 'Full Name', placeholder: 'John Doe' } };
export const Password: StoryObj<typeof Field> = { args: { label: 'Password', placeholder: '••••••••', secure: true } };
