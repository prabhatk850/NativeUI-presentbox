import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from './App';

test('boots on the home screen', async () => {
  await render(<App />);
  expect(await screen.findByText('What customers are saying')).toBeOnTheScreen();
  expect(await screen.findByText('All Products')).toBeOnTheScreen(); // category cards loaded from the API
});
