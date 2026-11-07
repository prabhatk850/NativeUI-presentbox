import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import MegaMenu from './MegaMenu';
import headers from '../../../api/data/headers.json';

const [occasions, categories, about] = headers.data;
const toArgs = (e: (typeof headers.data)[number]) => ({
  heading: e.menuDescription.heading,
  subheading: e.menuDescription.description,
  links: e.navlink,
  img: e.img,
  grid: e.grid,
});

const meta: Meta<typeof MegaMenu> = {
  title: 'Molecules/MegaMenu',
  component: MegaMenu,
  decorators: [(Story: React.ComponentType) => (
      <View style={{ backgroundColor: '#000', padding: 20 }}>
        <Story />
      </View>
    )],
};
export default meta;
type Story = StoryObj<typeof MegaMenu>;

export const HeadingLinksImage: Story = { args: toArgs(occasions) };
export const ThreeColumns: Story = { args: toArgs(categories) };
export const HeadingImage: Story = { args: toArgs(about) };
