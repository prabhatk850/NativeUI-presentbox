import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ProductGrid from './ProductGrid';
import products from '../../../mocks/productPage.json';

describe('ProductGrid', () => {
  it('renders every product it is given', async () => {
    await render(<ProductGrid products={products.data} />);
    expect(screen.getAllByRole('button', { name: /^View / })).toHaveLength(products.data.length);
  });
});
