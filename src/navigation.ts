import type { LinkingOptions } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Products: { category?: string; q?: string } | undefined; // q = free-text search
  Cart: undefined;
  Profile: undefined;
  ProductDetail: { id: number };
  Orders: undefined;
  PaymentMethods: undefined;
  Help: { topic?: string } | undefined; // topic = FAQ topic shown first
  Occasions: undefined;
  About: undefined;
  Careers: undefined;
};

// Same URLs as the web app: "/" and "/products". Link atoms resolve JSON urls through this.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  // initialRouteName: a link straight to /products/5 still has Home underneath the product sheet
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: '',
      Products: 'products',
      Cart: 'cart',
      Profile: 'profile',
      ProductDetail: { path: 'products/:id', parse: { id: Number } },
      Orders: 'orders',
      PaymentMethods: 'payment-methods',
      Help: 'help',
      Occasions: 'occasions',
      About: 'about',
      Careers: 'careers',
    },
  },
};

// Links into the products page carry their label as the selected category pill:
// ("/products", "Birthday") → "/products?category=Birthday". The linking config turns the query
// into route.params.category on every platform. "All …" links open the unfiltered page.
export function withCategory(url: string, label: string) {
  const name = label.trim();
  if (url !== '/products' || !name || /^all\b/i.test(name)) return url;
  return `/products?category=${encodeURIComponent(name)}`;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
