import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Profile from './Profile';
import { shop } from '../store';

const meta: Meta<typeof Profile> = { title: 'Screens/Profile', component: Profile };
export default meta;
type Story = StoryObj<typeof Profile>;

export const SignedIn: Story = { beforeEach: () => shop.signIn({ name: 'Aanya Sharma', email: 'aanya@example.com' }) };
export const SignedOut: Story = { beforeEach: () => shop.signOut() };
