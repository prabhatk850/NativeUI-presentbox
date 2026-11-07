import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import About from './About';
import company from '../api/data/company.json';

const { about } = company.data;

describe('About screen', () => {
  it('tells the story and links to gifts and careers', async () => {
    const user = userEvent.setup();
    await render(<About />);
    expect(await screen.findByRole('header', { name: about.heading })).toBeOnTheScreen();
    for (const v of about.values) expect(screen.getByText(v.title)).toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'Browse gifts' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Products');
    await user.press(screen.getByRole('button', { name: 'Join the team' }));
    expect(useNavigation().navigate).toHaveBeenCalledWith('Careers');
  });
});
