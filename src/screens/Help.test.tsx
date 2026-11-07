import React from 'react';
import { Linking } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import Help from './Help';
import help from '../api/data/help.json';

const [q1, q2] = help.data.faqs;
const returns = help.data.faqs.filter((f) => f.topic === 'Returns');
const screenFor = (topic?: string) => <Help route={{ key: 'h', name: 'Help', params: topic ? { topic } : undefined }} navigation={{} as never} />;

describe('Help screen', () => {
  it('opens one answer at a time', async () => {
    const user = userEvent.setup();
    await render(screenFor());
    expect(screen.queryByText(q1.answer)).not.toBeOnTheScreen();

    await user.press(await screen.findByRole('button', { name: new RegExp(q1.question) }));
    expect(screen.getByText(q1.answer)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: new RegExp(q1.question) })).toBeExpanded();

    await user.press(screen.getByRole('button', { name: new RegExp(q2.question) }));
    expect(screen.queryByText(q1.answer)).not.toBeOnTheScreen();
    expect(screen.getByText(q2.answer)).toBeOnTheScreen();
  });

  it('opens on a linked topic and switches topics from the chips', async () => {
    const user = userEvent.setup();
    await render(screenFor('Returns'));
    expect(await screen.findByRole('button', { name: 'Returns' })).toBeSelected();
    for (const f of returns) expect(screen.getByText(f.question)).toBeOnTheScreen();
    expect(screen.queryByText(q1.question)).not.toBeOnTheScreen();

    await user.press(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText(q1.question)).toBeOnTheScreen();
  });

  it('emails and calls support', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    const user = userEvent.setup();
    await render(screenFor());
    await user.press(await screen.findByRole('button', { name: 'Email us' }));
    await user.press(screen.getByRole('button', { name: 'Call us' }));
    expect(openURL.mock.calls).toEqual([[`mailto:${help.data.contact.email}`], [`tel:${help.data.contact.phone}`]]);
    openURL.mockRestore();
  });
});
