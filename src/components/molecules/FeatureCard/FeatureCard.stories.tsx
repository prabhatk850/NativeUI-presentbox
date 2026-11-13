import { Truck } from '../../../theme/icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import FeatureCard from './FeatureCard';

const meta: Meta<typeof FeatureCard> = { title: 'Molecules/FeatureCard', component: FeatureCard };
export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = { args: { icon: Truck, label: 'Fast & Free Shipping' } };
