import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Sections from '.';
import pages from '../mocks/pages.json';
import { pageSection } from '../mocks';
import type { Section } from '../cms';

// Every Contentful page block, rendered from the same data the seed script uploads.
const meta: Meta<typeof Sections> = { title: 'Sections/Contentful blocks', component: Sections };
export default meta;
type Story = StoryObj<typeof Sections>;

export const HomePage: Story = { args: { sections: pages.home.sections as Section[] } };
export const Hero: Story = { args: { sections: [pageSection('home', 'heroSection')] } };
export const CategoryCards: Story = { args: { sections: [pageSection('home', 'categoryCardsSection')] } };
export const Reviews: Story = { args: { sections: [pageSection('home', 'reviewsSection')] } };
export const Features: Story = { args: { sections: [pageSection('home', 'featuresSection')] } };
