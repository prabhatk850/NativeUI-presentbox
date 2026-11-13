// Dummy account API (orders, saved payment methods): each function resolves to the response body a real backend would return.
// Site content comes from Contentful instead, see src/cms. To go live, replace a function body with a fetch — components stay unchanged.
import orders from '../mocks/orders.json';
import paymentMethods from '../mocks/paymentMethods.json';

export const getOrders = async () => orders;
export const getPaymentMethods = async () => paymentMethods;
