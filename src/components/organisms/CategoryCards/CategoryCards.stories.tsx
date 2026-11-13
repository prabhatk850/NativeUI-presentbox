import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import CategoryCards from './CategoryCards';
import { pageSection } from '../../../mocks';

const meta: Meta<typeof CategoryCards> = { title: 'Organisms/CategoryCards', component: CategoryCards };
export default meta;
export const Default: StoryObj<typeof CategoryCards> = { args: { cards: pageSection('home', 'categoryCardsSection').cards } };
