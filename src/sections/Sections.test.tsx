import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Sections, { APP_BLOCKS, BLOCKS } from '.';
import { contentTypes } from '../../scripts/contentful/model';
import pages from '../mocks/pages.json';
import type { Section } from '../cms';

const home = pages.home.sections as Section[];
const field = (type: string, id: string): any => contentTypes.find((t) => t.sys.id === type)!.fields.find((x: { id: string }) => x.id === id);

describe('Sections', () => {
  it('renders every block of a page in order', async () => {
    await render(<Sections sections={home} />);
    expect(screen.getByText('A gifting company that turns moments into memories.')).toBeOnTheScreen();
    const headers = screen.getAllByRole('header').map((h) => h.props.children);
    expect(headers).toEqual(['Shop by category', 'What customers are saying', 'Why PresentBox']);
    expect(screen.getByText('All Products')).toBeOnTheScreen();
    expect(screen.getByText('24/7 Support')).toBeOnTheScreen();
  });

  it('renders a block on its own', async () => {
    await render(<Sections sections={[{ type: 'featuresSection', id: 'f', title: 'Perks', features: [{ icon: 'NotAnIcon', label: 'Gift wrap' }] }]} />);
    expect(screen.getByRole('header', { name: 'Perks' })).toBeOnTheScreen();
    expect(screen.getByText('Gift wrap')).toBeOnTheScreen(); // unknown icon names fall back to a gift icon
  });

  // what the content model lets editors pick must exist in the app, and the reverse
  it('has a component for every block type and app screen in the content model', () => {
    expect(Object.keys(BLOCKS).sort()).toEqual([...field('page', 'sections').items.validations[0].linkContentType].sort());
    expect(Object.keys(APP_BLOCKS).sort()).toEqual([...field('appSection', 'component').validations[0].in].sort());
  });
});
