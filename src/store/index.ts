import { useSyncExternalStore } from 'react';
import type { Product } from '../utils';
import addressData from '../mocks/addresses.json';
import productPage from '../mocks/productPage.json';

// Signed-in user, wishlist, cart and delivery addresses shared by the header, product cards, modals and cart screen.
// A module-level store read through useSyncExternalStore: no provider to mount, works the same in tests.
// ponytail: in-memory only, lost on reload; persist `state` (AsyncStorage / API) when accounts exist.

export type AddressLabel = 'Home' | 'Work' | 'Other';
export type Address = { id: number; label: AddressLabel; name: string; phone: string; line: string; city: string; pincode: string };
export type CartLine = { product: Product; qty: number };
export type User = { name: string; email: string };
type State = {
  user: User | null;
  wishlist: Product[];
  cart: CartLine[];
  addresses: Address[];
  selectedAddressId: number | null;
  recentSearches: string[];
};

const EMPTY: State = { user: null, wishlist: [], cart: [], addresses: [], selectedAddressId: null, recentSearches: [] };
// ponytail: demo data until accounts exist; then load the user's cart, wishlist and addresses from the API after sign-in
const demoAddresses = addressData.data as Address[];
const productById = (id: number) => productPage.data.find((p) => p.id === id)!;
let state: State = {
  user: null,
  wishlist: [1, 10, 13, 21, 29].map(productById), // tulips, truffles, night-in hamper, monstera, skincare kit
  cart: [
    { product: productById(5), qty: 1 }, // bento cake
    { product: productById(18), qty: 2 }, // polaroid prints
    { product: productById(25), qty: 1 }, // sunset lamp
  ],
  addresses: demoAddresses,
  selectedAddressId: demoAddresses[0]?.id ?? null,
  recentSearches: ['birthday', 'lamp'],
};
const listeners = new Set<() => void>();

const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getState = () => state;

export const useShop = () => useSyncExternalStore(subscribe, getState, getState);

export const shop = {
  // ponytail: no auth API yet, so signing in just remembers who you said you are
  signIn(user: User) {
    set({ user });
  },
  // the cart, wishlist and addresses stay, like a guest session
  signOut() {
    set({ user: null });
  },
  toggleWishlist(p: Product) {
    const has = state.wishlist.some((w) => w.id === p.id);
    set({ wishlist: has ? state.wishlist.filter((w) => w.id !== p.id) : [...state.wishlist, p] });
  },
  addToCart(p: Product, qty = 1) {
    const line = state.cart.find((l) => l.product.id === p.id);
    set({ cart: line ? state.cart.map((l) => (l === line ? { ...l, qty: l.qty + qty } : l)) : [...state.cart, { product: p, qty }] });
  },
  // qty 0 removes the line
  setQty(productId: number, qty: number) {
    set({
      cart: qty > 0 ? state.cart.map((l) => (l.product.id === productId ? { ...l, qty } : l)) : state.cart.filter((l) => l.product.id !== productId),
    });
  },
  // a new address becomes the delivery address
  addAddress(a: Omit<Address, 'id'>) {
    const id = Math.max(0, ...state.addresses.map((x) => x.id)) + 1;
    set({ addresses: [...state.addresses, { ...a, id }], selectedAddressId: id });
  },
  selectAddress(id: number) {
    set({ selectedAddressId: id });
  },
  removeAddress(id: number) {
    const addresses = state.addresses.filter((a) => a.id !== id);
    set({ addresses, selectedAddressId: state.selectedAddressId === id ? addresses[0]?.id ?? null : state.selectedAddressId });
  },
  // newest first, no duplicates, last 5
  addRecentSearch(query: string) {
    const q = query.trim();
    if (!q) return;
    set({ recentSearches: [q, ...state.recentSearches.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 5) });
  },
  clearRecentSearches() {
    set({ recentSearches: [] });
  },
  reset() {
    set(EMPTY);
  },
};

export const selectedAddress = (s: State) => s.addresses.find((a) => a.id === s.selectedAddressId);
export const cartCount = (s: State) => s.cart.reduce((n, l) => n + l.qty, 0);
