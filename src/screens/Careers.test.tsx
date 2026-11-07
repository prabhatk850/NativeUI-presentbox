import React from 'react';
import { Linking } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import Careers from './Careers';
import company from '../api/data/company.json';

const { careers } = company.data;

describe('Careers screen', () => {
  it('lists open roles and applies by email', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await render(<Careers />);
    expect(await screen.findByRole('header', { name: `Open roles (${careers.roles.length})` })).toBeOnTheScreen();
    for (const r of careers.roles) expect(screen.getByRole('button', { name: `Apply for ${r.title}` })).toBeOnTheScreen();

    await userEvent.setup().press(screen.getByRole('button', { name: 'Apply for Gift Curator' }));
    expect(openURL).toHaveBeenCalledWith(`mailto:${careers.email}?subject=Application%3A%20Gift%20Curator`);
    openURL.mockRestore();
  });
});
