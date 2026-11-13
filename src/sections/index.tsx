// Page blocks editors arrange in Contentful. Each Contentful section type maps to one component here:
// content blocks are thin adapters over the UI library in src/components, app blocks are the screens in src/screens.
//
// Adding a block: model it in scripts/contentful/model.js, map its fields in src/cms (SECTIONS),
// add its type to `Section` there, then register a component in BLOCKS below.
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CategoryCards, FeatureCard, ReviewCarousel, VideoComponent } from '../components';
import Product from '../screens/Product/Product';
import Occasions from '../screens/Occasions/Occasions';
import Cart from '../screens/Cart/Cart';
import Profile from '../screens/Profile/Profile';
import Orders from '../screens/Orders/Orders';
import PaymentMethods from '../screens/PaymentMethods/PaymentMethods';
import Help from '../screens/Help/Help';
import About from '../screens/About/About';
import Careers from '../screens/Careers/Careers';
import * as icons from '../theme/icons';
import heroVideo from '../assets/bgg.mp4';
import type { Section } from '../cms';
import { breakpoints, colors, layout, type } from '../theme';

type Block<T extends Section['type']> = Extract<Section, { type: T }>;
const useMobile = () => useWindowDimensions().width < breakpoints.mobile;

function SectionTitle({ children }: { children: string }) {
  const mobile = useMobile();
  return (
    <Text accessibilityRole="header" style={[styles.title, !mobile && styles.titleWide]}>
      {children}
    </Text>
  );
}

// no video uploaded in Contentful = the bundled clip
function HeroSection({ headline, video }: Block<'heroSection'>) {
  return <VideoComponent source={video ?? heroVideo} text={headline} />;
}

function CategoryCardsSection({ title, cards }: Block<'categoryCardsSection'>) {
  return (
    <View style={styles.section}>
      <SectionTitle>{title}</SectionTitle>
      <CategoryCards cards={cards} />
    </View>
  );
}

function ReviewsSection({ heading, subheading, reviews }: Block<'reviewsSection'>) {
  return <ReviewCarousel heading={heading} subheading={subheading} reviews={reviews} />;
}

// icon is an icon name from src/theme/icons (the model limits editors to FEATURE_ICONS)
function FeaturesSection({ title, features }: Block<'featuresSection'>) {
  const mobile = useMobile();
  return (
    <View style={styles.section}>
      <SectionTitle>{title}</SectionTitle>
      <View style={[styles.features, mobile && styles.featuresMobile]}>
        {features.map((f) => (
          <FeatureCard key={f.label} icon={icons[f.icon as keyof typeof icons] ?? icons.Gift} label={f.label} />
        ))}
      </View>
    </View>
  );
}

// built-in screens an "App screen" block can place (appSection.component; the model lists the same names)
export const APP_BLOCKS: Record<string, React.ComponentType> = { products: Product, occasions: Occasions, cart: Cart, profile: Profile, orders: Orders, paymentMethods: PaymentMethods };

function AppSection({ component }: Block<'appSection'>) {
  const Screen = APP_BLOCKS[component];
  return Screen ? <Screen /> : null; // a screen this app version doesn't have
}

export const BLOCKS: { [T in Section['type']]: React.ComponentType<Block<T>> } = {
  heroSection: HeroSection,
  categoryCardsSection: CategoryCardsSection,
  reviewsSection: ReviewsSection,
  featuresSection: FeaturesSection,
  helpSection: Help,
  aboutSection: About,
  careersSection: Careers,
  appSection: AppSection,
};
const FULL_BLEED = new Set<Section['type']>(['heroSection']);

// A page that opens with a full-bleed block (the home hero) draws under the floating header.
export const opensFullBleed = (sections: Section[]) => !!sections[0] && FULL_BLEED.has(sections[0].type);

const block = (s: Section) => {
  const Component = BLOCKS[s.type] as React.ComponentType<Section>;
  return <Component key={s.id} {...s} />;
};

// Renders a page's blocks in order. Full-bleed blocks (the hero) span the screen; each run of other blocks
// shares one column, padded here on full-bleed pages (MainLayout pads every other page).
function Sections({ sections }: { sections: Section[] }) {
  const mobile = useMobile();
  const padded = opensFullBleed(sections);
  const runs: Section[][] = [];
  for (const s of sections) {
    const run = runs.at(-1);
    if (run && !FULL_BLEED.has(s.type) && !FULL_BLEED.has(run[0].type)) run.push(s);
    else runs.push([s]);
  }
  return (
    <>
      {runs.map((run) =>
        FULL_BLEED.has(run[0].type) ? (
          block(run[0])
        ) : (
          <View key={run[0].id} style={[styles.column, mobile && styles.columnMobile, padded && (mobile ? styles.paddedMobile : styles.padded)]}>
            {run.map(block)}
          </View>
        ),
      )}
    </>
  );
}

const styles = StyleSheet.create({
  column: { gap: 80 },
  columnMobile: { gap: 40 },
  padded: { padding: layout.pageGutter },
  paddedMobile: { paddingHorizontal: layout.mobileGutter, paddingVertical: 32 },
  section: { gap: 16 },
  title: { ...type.title2, color: colors.text },
  titleWide: { ...type.title1 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  featuresMobile: { gap: 12 },
});

export default Sections;
