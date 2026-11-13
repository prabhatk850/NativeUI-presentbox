import { ArrowUpRight, ShoppingBag } from '../../../theme/icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Button from './Button';

const meta: Meta<typeof Button> = { title: 'Atoms/Button', component: Button };
export default meta;
type Story = StoryObj<typeof Button>;

export const LabelOnly: Story = { args: { label: 'Shop now' } };
export const WithExtended: Story = { args: { label: 'Shop now', extendedIcon: ArrowUpRight } };
export const WithIcon: Story = { args: { label: 'Add to bag', icon: ShoppingBag, color: 'black' } };
export const Primary: Story = { args: { label: 'Browse All Products', color: '#d32f2f', extendedIcon: ArrowUpRight } };
export const CustomTextColor: Story = { args: { label: 'Explore', color: '#ffd54f', textColor: '#1a1a1a', extendedIcon: ArrowUpRight } };
export const ExtendedOnly: Story = { args: { extendedIcon: ArrowUpRight, accessibilityLabel: 'Open' } };
