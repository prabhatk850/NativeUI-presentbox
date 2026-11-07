import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import PageHeading from './PageHeading';

const meta: Meta<typeof PageHeading> = { title: 'Molecules/PageHeading', component: PageHeading };
export default meta;
type Story = StoryObj<typeof PageHeading>;

export const WithSubheading: Story = {
  args: { heading: 'Key Features of This Items', subheading: 'Discover the standout features that make this product a must-have.' },
};
export const HeadingOnly: Story = { args: { heading: 'All Products' } };
