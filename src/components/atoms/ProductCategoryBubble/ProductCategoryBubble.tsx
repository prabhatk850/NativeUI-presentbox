import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../../../theme';

type Props = { category: string; isActive?: boolean; onPress?: () => void };

function ProductCategoryBubble({ category, isActive = false, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, isActive && styles.active, pressed && !isActive && styles.pressed]}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>{category}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // flat capsule, iOS filter-chip style
  wrapper: {
    height: 36,
    justifyContent: 'center',
    backgroundColor: colors.fill,
    borderRadius: 18,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  active: { backgroundColor: colors.primary },
  pressed: { opacity: 0.7 },
  text: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.1, color: colors.text },
  activeText: { color: colors.white },
});

export default ProductCategoryBubble;
