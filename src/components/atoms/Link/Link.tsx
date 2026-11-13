import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { useLinkTo } from '@react-navigation/native';
import { ArrowUpRight } from '../../../theme/icons';
import { type } from '../../../theme';

type Props = {
  href?: string; // "/products" (in-app path), "https://…" (external) or "#" (no-op)
  to?: string; // alias of href, kept from the web API
  color?: string;
  arrow?: boolean; // adds the ↗ icon after the label
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
};

// Common text link. In-app paths go through React Navigation's linking config.
function Link({ href = '#', to, color = '#000', arrow = false, children, style, onPress }: Props) {
  const linkTo = useLinkTo();
  const [hovered, setHovered] = useState(false);
  const target = to || href;

  const press = () => {
    onPress?.();
    if (!target || target === '#') return;
    if (/^https?:\/\//.test(target)) Linking.openURL(target);
    else linkTo(target);
  };

  return (
    <Pressable
      accessibilityRole="link"
      onPress={press}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={styles.row}
    >
      <Text style={[styles.text, { color }, hovered && styles.hovered, style]}>{children}</Text>
      {arrow && <ArrowUpRight testID="link-arrow" size={16} color={color} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  text: type.subhead,
  hovered: { textDecorationLine: 'underline' },
});

export default Link;
