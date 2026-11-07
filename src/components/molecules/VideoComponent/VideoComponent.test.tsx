import React from 'react';
import { render, screen } from '@testing-library/react-native';
import VideoComponent from './VideoComponent';

type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
const findVideo = (node: Node | string | null): Node | undefined => {
  if (!node || typeof node === 'string') return undefined;
  if (node.type === 'Video') return node;
  return (node.children ?? []).map(findVideo).find(Boolean);
};

describe('VideoComponent', () => {
  it('renders a looping, muted, always-playing video with the overlay text', async () => {
    const { toJSON } = await render(<VideoComponent source="/clip.mp4" text="Hello" />);
    expect(screen.getByText('Hello')).toBeOnTheScreen();

    const video = findVideo(toJSON() as Node);
    expect(video?.props).toMatchObject({ source: { uri: '/clip.mp4' }, repeat: true, muted: true, paused: false });
    expect(video?.props.onEnd).toEqual(expect.any(Function)); // restart fallback when repeat is ignored
  });
});
