import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { breakpoints, colors, type } from '../../../theme';

type Props = { heading: string; subheading?: string; style?: StyleProp<ViewStyle> };

// iOS-style large title with an optional one-line description.
function PageHeading({ heading, subheading, style }: Props) {
  const wide = useWindowDimensions().width >= breakpoints.mobile;
  return (
    <View style={[styles.wrapper, style]}>
      <Text accessibilityRole="header" style={[styles.heading, wide && styles.headingWide]}>
        {heading}
      </Text>
      {!!subheading && <Text style={styles.sub}>{subheading}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 4, maxWidth: 640 },
  heading: { ...type.largeTitle, color: colors.text },
  headingWide: { fontSize: 40, lineHeight: 46, letterSpacing: -0.8 },
  sub: { ...type.subhead, color: colors.textMuted },
});

export default PageHeading;
