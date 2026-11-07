import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Search from './Search';

const meta: Meta<typeof Search> = { title: 'Atoms/Search', component: Search };
export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {};
export const FullWidth: Story = { args: { fullWidth: true } };
