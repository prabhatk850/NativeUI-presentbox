import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { LucideIcon } from '../../../icons';
import { breakpoints, colors, fonts, radius, type } from '../../../theme';

// Flat tile: on phones two per row with the icon above the label, on desktop a single row.
function FeatureCard({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  const mobile = useWindowDimensions().width < breakpoints.mobile;
  return (
    <View style={[styles.card, mobile ? styles.mobile : styles.desktop]}>
      <View style={styles.icon}>
        <Icon size={20} color={colors.primary} />
      </View>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12, padding: 16, backgroundColor: colors.surface, borderRadius: radius.lg },
  desktop: { flexDirection: 'row', alignItems: 'center', width: 280 },
  mobile: { flexGrow: 1, flexBasis: '40%', alignItems: 'flex-start' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.text },
});

export default FeatureCard;
