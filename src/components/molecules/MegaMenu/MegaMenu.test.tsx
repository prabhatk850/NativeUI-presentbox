import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MegaMenu, { flattenLinksForMenu, normalizeGroupsForThreeColumns } from './MegaMenu';

const links = [
  { id: 1, navlinks: [{ id: 1, lable: 'Birthday', url: '/products' }, { id: 2, lable: 'Wedding', url: '/products' }] },
];

describe('MegaMenu', () => {
  it('renders heading, subheading, links and image', async () => {
    await render(
      <MegaMenu grid="heading_menu_item_image" heading="Occasions" subheading="For every moment." links={links} img={{ url: 'https://example.com/a.jpg' }} />,
    );
    expect(screen.getByText('Occasions')).toBeOnTheScreen();
    expect(screen.getByText('For every moment.')).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Birthday' })).toBeOnTheScreen();
    expect(screen.getByLabelText('Occasions')).toHaveProp('source', { uri: 'https://example.com/a.jpg' });
  });

  it('renders links in the three-column layout', async () => {
    await render(<MegaMenu grid="menu_item_menu_item_menu_item" heading="Categories" links={links} />);
    expect(screen.getByRole('link', { name: 'Wedding' })).toBeOnTheScreen();
  });

  it('normalizes the API link shapes', () => {
    const flat = [{ id: 1, lable: 'A', url: '#' }, { id: 2, lable: 'B', url: '#' }, { id: 3, lable: 'C', url: '#' }, { id: 4, lable: 'D', url: '#' }];
    expect(flattenLinksForMenu(links).map((l) => l.lable)).toEqual(['Birthday', 'Wedding']);
    expect(normalizeGroupsForThreeColumns(flat).map((c) => c.map((l) => l.lable))).toEqual([['A', 'D'], ['B'], ['C']]);
    expect(normalizeGroupsForThreeColumns(undefined)).toEqual([[], [], []]);
  });
});
