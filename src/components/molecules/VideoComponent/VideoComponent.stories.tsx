import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import VideoComponent from './VideoComponent';
import heroVideo from '../../../assets/bgg.mp4';

const meta: Meta<typeof VideoComponent> = { title: 'Molecules/VideoComponent', component: VideoComponent };
export default meta;
type Story = StoryObj<typeof VideoComponent>;

export const Hero: Story = { args: { source: heroVideo, text: 'A gifting company that turns moments into memories.' } };
