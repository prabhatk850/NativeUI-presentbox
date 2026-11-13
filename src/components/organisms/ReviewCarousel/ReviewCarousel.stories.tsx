import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import ReviewCarousel from './ReviewCarousel';
import { pageSection } from '../../../mocks';

const { heading, subheading, reviews } = pageSection('home', 'reviewsSection');

const meta: Meta<typeof ReviewCarousel> = { title: 'Organisms/ReviewCarousel', component: ReviewCarousel };
export default meta;
export const Default: StoryObj<typeof ReviewCarousel> = { args: { heading, subheading, reviews } };
