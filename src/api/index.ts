// Dummy API: each function resolves to the same response body the real API returns.
// To go live, replace a function body with a fetch to the real endpoint — components stay unchanged.
import headers from './data/headers.json';
import footer from './data/footer.json';
import categoryCards from './data/categoryCards.json';
import productPage from './data/productPage.json';
import orders from './data/orders.json';
import paymentMethods from './data/paymentMethods.json';
import help from './data/help.json';
import company from './data/company.json';

export const getHeaders = async () => headers;
export const getFooter = async () => footer;
export const getCategoryCards = async () => categoryCards;
export const getProducts = async () => productPage;
export const getOrders = async () => orders;
export const getPaymentMethods = async () => paymentMethods;
export const getHelp = async () => help;
export const getCompany = async () => company;

export const getImageUrl = (img?: string | { url?: string } | null) =>
  (typeof img === 'string' ? img : img?.url) || null;
