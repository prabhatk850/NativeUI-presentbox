import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/atoms/Button/Button';
import { Gift } from '../../theme/icons';
import type { AboutContent } from '../../cms';
import { colors, fonts, radius, type } from '../../theme';

// The about page's block (aboutSection in Contentful).
function About(about: AboutContent) {
  const navigation = useNavigation();

  return (
    <View style={styles.page}>
      {!!about.eyebrow && <Text style={styles.eyebrow}>{about.eyebrow}</Text>}
      <Text accessibilityRole="header" style={styles.title}>
        {about.heading}
      </Text>
      {about.story.map((p) => (
        <Text key={p} style={styles.story}>
          {p}
        </Text>
      ))}

      <View style={styles.values}>
        {about.values.map((v) => (
          <View key={v.id} style={styles.value}>
            <View style={styles.iconTile}>
              <Gift size={18} color={colors.primary} />
            </View>
            <Text style={styles.valueTitle}>{v.title}</Text>
            <Text style={styles.valueText}>{v.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Browse gifts" color={colors.primary} onPress={() => navigation.navigate('Products')} />
        <Button label="Join the team" color={colors.fill} textColor={colors.text} onPress={() => navigation.navigate('Careers')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: 12, width: '100%', maxWidth: 760, alignSelf: 'center' },
  eyebrow: { ...type.footnote, fontFamily: fonts.semiBold, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { ...type.largeTitle, color: colors.text, marginBottom: 4 },
  story: { ...type.body, color: colors.textMuted },
  values: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  value: { flexGrow: 1, flexBasis: 200, gap: 6, padding: 16, borderRadius: radius.lg, backgroundColor: colors.surface },
  iconTile: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint, marginBottom: 4 },
  valueTitle: { ...type.headline, color: colors.text },
  valueText: { ...type.subhead, color: colors.textMuted },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 },
});

export default About;
