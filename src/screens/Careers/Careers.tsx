import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, MapPin } from '../../theme/icons';
import type { CareersContent } from '../../cms';
import { colors, fonts, radius, type } from '../../theme';

// Open roles; "Apply" opens an email to the careers inbox with the role in the subject.
// The careers page's block (careersSection in Contentful).
function Careers(careers: CareersContent) {
  const apply = (role: string) => Linking.openURL(`mailto:${careers.email}?subject=${encodeURIComponent(`Application: ${role}`)}`);

  return (
    <View style={styles.page}>
      {!!careers.eyebrow && <Text style={styles.eyebrow}>{careers.eyebrow}</Text>}
      <Text accessibilityRole="header" style={styles.title}>
        {careers.heading}
      </Text>
      <Text style={styles.intro}>{careers.intro}</Text>

      <Text accessibilityRole="header" style={styles.section}>
        {`Open roles (${careers.roles.length})`}
      </Text>
      <View style={styles.group}>
        {careers.roles.map((r, i) => (
          <Pressable
            key={r.id}
            accessibilityRole="button"
            accessibilityLabel={`Apply for ${r.title}`}
            onPress={() => apply(r.title)}
            style={({ pressed }) => [styles.role, i < careers.roles.length - 1 && styles.divider, pressed && styles.pressed]}
          >
            <View style={styles.flex}>
              <Text style={styles.roleTitle}>{r.title}</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>{r.team}</Text>
                <Text style={styles.dot}>·</Text>
                <MapPin size={12} color={colors.textMuted} />
                <Text style={styles.metaText}>{r.location}</Text>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.metaText}>{r.type}</Text>
              </View>
            </View>
            <Text style={styles.apply}>Apply</Text>
            <ChevronRight size={16} color={colors.primary} />
          </Pressable>
        ))}
      </View>
      <Text style={styles.note}>Don’t see your role? Write to {careers.email}.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
  page: { gap: 8, width: '100%', maxWidth: 760, alignSelf: 'center' },
  eyebrow: { ...type.footnote, fontFamily: fonts.semiBold, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { ...type.largeTitle, color: colors.text },
  intro: { ...type.body, color: colors.textMuted },
  section: { ...type.title3, color: colors.text, marginTop: 20, marginBottom: 4 },
  group: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  role: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 16 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.separator },
  roleTitle: { ...type.headline, color: colors.text },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginTop: 2 },
  metaText: { ...type.footnote, color: colors.textMuted },
  dot: { ...type.footnote, color: colors.textSubtle },
  apply: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.primary },
  note: { ...type.footnote, color: colors.textMuted, marginTop: 8 },
});

export default Careers;
