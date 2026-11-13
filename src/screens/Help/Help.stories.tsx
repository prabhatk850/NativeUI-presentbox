import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import Help from './Help';
import { pageSection } from '../../mocks';

// In the app, /help?topic=Returns opens on that topic (read from the route).
const meta: Meta<typeof Help> = { title: 'Screens/Help', component: Help };
export default meta;
export const AllTopics: StoryObj<typeof Help> = { args: pageSection('help', 'helpSection') };
