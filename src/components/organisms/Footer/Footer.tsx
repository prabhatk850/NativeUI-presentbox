import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import FooterMenuCard, { type MenuItem } from '../../molecules/FooterMenuCard/FooterMenuCard';
import Newsletter from '../../molecules/Newsletter/Newsletter';
import Link from '../../atoms/Link/Link';
import { getFooter } from '../../../cms';
import { breakpoints, colors, fonts, gradients } from '../../../theme';
import { withCategory } from '../../../app/navigation';

type FooterData = { newsletter?: boolean; section?: { id: string; heading: string; item: MenuItem[] }[] };

function Footer() {
  const [data, setData] = useState<FooterData | null>(null);
  const { width } = useWindowDimensions();
  const narrow = width < breakpoints.sm;
  const stacked = width < 900;

  useEffect(() => {
    getFooter()
      .then(setData)
      .catch((err) => console.error('Footer load error:', err));
  }, []);

  if (!data) return null;

  return (
    <View style={[styles.wrapper, narrow && styles.wrapperNarrow]}>
      {/* soft glows */}
      <View pointerEvents="none" style={[styles.glow, styles.glowTop]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom]} />

      <View style={[styles.main, stacked && styles.mainStacked, narrow && styles.mainNarrow]}>
        <View style={[styles.brand, !stacked && styles.brandWide]}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.logo, { fontSize: Math.min(26, Math.max(22, width * 0.07)) }]}>
            PresentBox
          </Text>
          <Text style={[styles.tagline, narrow && styles.taglineNarrow]}>A gifting company that turns moments into memories.</Text>
          {data.newsletter && <Newsletter />}
        </View>
        {narrow ? (
          // phones: one wrapped block of plain links instead of three titled columns
          <View accessibilityLabel="Footer" style={styles.inlineLinks}>
            {data.section?.flatMap((s) => s.item).map((item) => (
              <Link key={item.id} href={withCategory(item.url, item.lable)} color={colors.white}>
                {item.lable}
              </Link>
            ))}
          </View>
        ) : (
          <View accessibilityLabel="Footer" style={[styles.links, !stacked && styles.linksWide]}>
            {data.section?.map((s) => (
              <View key={s.id} style={styles.linkCol}>
                <FooterMenuCard heading={s.heading} items={s.item} arrow />
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.bottom, narrow && styles.bottomNarrow]}>
        <Text style={styles.bottomText}>© 2026 PresentBox. All rights reserved.</Text>
        <Text style={styles.bottomText}>Made with care for every occasion. by Prabhat Kumar Verma</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
    backgroundImage: gradients.primary,
    paddingTop: 72,
    paddingHorizontal: 64,
    paddingBottom: 32,
  },
  wrapperNarrow: { paddingTop: 32, paddingHorizontal: 20, paddingBottom: 20 },
  glow: { position: 'absolute', borderRadius: 999, backgroundImage: gradients.glow },
  glowTop: { width: 520, height: 520, top: -220, right: -120 },
  glowBottom: { width: 380, height: 380, bottom: -200, left: -100 },
  main: { flexDirection: 'row', gap: 64 },
  mainStacked: { flexDirection: 'column', gap: 48 },
  mainNarrow: { gap: 28 },
  brand: { gap: 16 },
  brandWide: { flex: 1 },
  logo: { fontFamily: fonts.logo, letterSpacing: 2, color: colors.white },
  tagline: { marginBottom: 16, maxWidth: 340, fontFamily: fonts.regular, fontSize: 15, lineHeight: 24, color: 'rgba(255, 255, 255, 0.8)' },
  taglineNarrow: { marginBottom: 4 },
  inlineLinks: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 20, rowGap: 12 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 32 },
  linksWide: { flex: 2 },
  linkCol: { flexGrow: 1, flexBasis: 140 },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 64,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomNarrow: { flexDirection: 'column', gap: 4, marginTop: 28, paddingTop: 16 },
  bottomText: { fontFamily: fonts.regular, fontSize: 13, color: 'rgba(255, 255, 255, 0.75)' },
});

export default Footer;
