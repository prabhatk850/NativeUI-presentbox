// Design tokens shared by every component (replaces App.css + styles/layout.js of the web app).
// Primary = the footer red, used as the single tint colour (iOS style). Change it here and the app follows.

export const colors = {
  primary: '#d32f2f',
  primaryDark: '#b71c1c',
  primaryDeep: '#8b0000',
  primaryTint: 'rgba(211, 47, 47, 0.08)',
  primaryRing: 'rgba(211, 47, 47, 0.12)',

  black: '#000000',
  white: '#ffffff',
  // Apple-style neutrals: label / secondary / tertiary text, grouped surfaces, control fills
  text: '#1d1d1f',
  textMuted: '#6e6e73',
  textSubtle: '#86868b',
  surface: '#f5f5f7', // tiles, grouped backgrounds
  fill: '#ececef', // search field, chips, segmented control track
  input: '#f2f2f7',
  separator: 'rgba(60, 60, 67, 0.16)',
  border: '#e5e5ea',
  borderHover: '#d1d1d6',
  star: '#ff9f0a',
  success: '#1b7a3e', // rating badges, delivered orders
  dark: 'rgba(0, 0, 0, 0.95)',
  bar: '#ffffff', // phone top bar (solid: RN has no backdrop blur, translucency just ghosts content)
};

export const gradients = {
  // footer only; controls are flat
  primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 55%, ${colors.primaryDeep} 100%)`,
  glow: 'radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, transparent 70%)',
  heroScrim: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
};

// Family names = font file names = PostScript names, so one name works on Android, iOS and web.
export const fonts = {
  regular: 'Inter18pt-Regular',
  medium: 'Inter18pt-Medium',
  semiBold: 'Inter18pt-SemiBold',
  bold: 'Inter18pt-Bold',
  light: 'Rubik-Light',
  serif: 'PlayfairDisplay-Regular',
  serifBold: 'PlayfairDisplay-Bold',
  serifItalic: 'PlayfairDisplay-Italic',
  logo: 'BBHBartle-Regular', // wordmark only
};

// iOS-like type scale (size / line height / tracking). Spread into styles: { ...type.headline, color }.
export const type = {
  largeTitle: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 41, letterSpacing: -0.6 },
  title1: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  title2: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  title3: { fontFamily: fonts.semiBold, fontSize: 20, lineHeight: 25, letterSpacing: -0.2 },
  headline: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
  callout: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 21, letterSpacing: -0.1 },
  subhead: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 20, letterSpacing: -0.1 },
  footnote: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
} as const;

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 };

export const layout = {
  pageGutter: 64,
  mobileGutter: 16,
  headerOffset: 157, // desktop header top (63) + height (70) + breathing room
  mobileBarHeight: 52, // phone top bar, below the status bar inset
  mobileAddressHeight: 30, // "Deliver to" strip above the phone top bar
};

// replaces the CSS media queries: compare against useWindowDimensions().width
export const breakpoints = {
  mobile: 1024, // below this the header collapses into one bar
  tablet: 768,
  sm: 640,
  xs: 480,
};

export const shadows = {
  card: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)',
  float: '0 12px 40px rgba(0, 0, 0, 0.12)',
  modal: '0 24px 60px rgba(0, 0, 0, 0.25)',
  menu: '0 12px 32px rgba(0, 0, 0, 0.14)',
  segment: '0 1px 3px rgba(0, 0, 0, 0.12)',
};
