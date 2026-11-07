import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import ReviewCard from './ReviewCard';

const meta: Meta<typeof ReviewCard> = { title: 'Molecules/ReviewCard', component: ReviewCard };
export default meta;
type Story = StoryObj<typeof ReviewCard>;

export const Default: Story = {
  args: {
    data: {
      name: 'Alice Johnson',
      rating: 5,
      title: 'Fantastic Service!',
      message: 'I had an amazing experience shopping here. The products are top-notch and the customer service is outstanding!',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
  },
};
