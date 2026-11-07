/* eslint-env jest */
// Native modules that have no JS implementation under Jest.
jest.mock('react-native-video', () => ({ __esModule: true, default: 'Video', ViewType: { TEXTURE: 0, SURFACE: 1 } }));
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

// Navigation hooks: components only need navigate / goBack / setParams / route name / linkTo.
// Tests read the shared mocks back with useNavigation().navigate and useLinkTo().
const mockNavigate = jest.fn();
const mockLinkTo = jest.fn();
const mockGoBack = jest.fn();
const mockSetParams = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack, setParams: mockSetParams }),
  useRoute: () => ({ name: 'Home', params: undefined }),
  useLinkTo: () => mockLinkTo,
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mockLinkTo.mockClear();
  mockGoBack.mockClear();
  mockSetParams.mockClear();
});

// wishlist / cart / addresses live in a module-level store: start every test empty
beforeEach(() => require('./src/store').shop.reset());
