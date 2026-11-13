import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import ProductGrid from './ProductGrid';
import products from '../../../mocks/productPage.json';

const meta: Meta<typeof ProductGrid> = { title: 'Organisms/ProductGrid', component: ProductGrid, args: { products: products.data } };
export default meta;
export const Grid: StoryObj<typeof ProductGrid> = { args: { layout: 'grid' } };
export const List: StoryObj<typeof ProductGrid> = { args: { layout: 'list' } };
