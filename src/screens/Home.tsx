import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Headphones, RefreshCcw, ShoppingBag, Truck } from '../icons';
import MainLayout from '../components/templates/MainLayout/MainLayout';
import VideoComponent from '../components/molecules/VideoComponent/VideoComponent';
import CategoryCards from '../components/organisms/CategoryCards/CategoryCards';
import FeatureCard from '../components/molecules/FeatureCard/FeatureCard';
import ReviewCarousel from '../components/organisms/ReviewCarousel/ReviewCarousel';
import heroVideo from '../assets/bgg.mp4';
import { breakpoints, colors, layout, type } from '../theme';

const FEATURES = [
  { icon: ShoppingBag, label: 'Easy For Shopping' },
  { icon: Truck, label: 'Fast & Free Shipping' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: RefreshCcw, label: 'Money Back Guarantee' },
];

function Home() {
  const mobile = useWindowDimensions().width < breakpoints.mobile;

  return (
    <MainLayout overlay>
      <VideoComponent source={heroVideo} text="A gifting company that turns moments into memories." />
      <View style={[styles.body, mobile && styles.bodyMobile]}>
        <View style={styles.section}>
          <Text accessibilityRole="header" style={[styles.title, !mobile && styles.titleWide]}>
            Shop by category
          </Text>
          <CategoryCards />
        </View>
        <ReviewCarousel />
        <View style={styles.section}>
          <Text accessibilityRole="header" style={[styles.title, !mobile && styles.titleWide]}>
            Why PresentBox
          </Text>
          <View style={[styles.features, mobile && styles.featuresMobile]}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.label} icon={f.icon} label={f.label} />
            ))}
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  body: { padding: layout.pageGutter, gap: 80 },
  bodyMobile: { paddingHorizontal: layout.mobileGutter, paddingVertical: 32, gap: 40 },
  section: { gap: 16 },
  title: { ...type.title2, color: colors.text },
  titleWide: { ...type.title1 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  featuresMobile: { gap: 12 },
});

export default Home;
