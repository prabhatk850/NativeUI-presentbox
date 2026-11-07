import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type { LucideIcon } from '../../../icons';
import { colors, fonts } from '../../../theme';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  label?: string;
  icon?: LucideIcon; // shown inside the pill, before the label
  extendedIcon?: LucideIcon; // shown in the round button after the pill
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  pillStyle?: StyleProp<ViewStyle>;
  circleStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  extendedIconSize?: number;
};

// Pill with optional icon + label, and/or a round "extended" icon button next to it.
function Button({
  label,
  icon: Icon,
  extendedIcon: Extended,
  color,
  textColor,
  style,
  pillStyle,
  circleStyle,
  labelStyle,
  iconSize = 18,
  extendedIconSize = 20,
  ...rest
}: Props) {
  const bg = { backgroundColor: color || colors.white };
  const fg = textColor || (color ? colors.white : colors.black);

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
      {...rest}
    >
      {(label != null || Icon) && (
        <View testID="button-pill" style={[styles.pill, bg, pillStyle]}>
          {Icon && <Icon size={iconSize} color={fg} />}
          {label != null && <Text style={[styles.label, { color: fg }, labelStyle]}>{label}</Text>}
        </View>
      )}
      {Extended && (
        <View testID="button-extended" style={[styles.circle, bg, circleStyle]}>
          <Extended size={extendedIconSize} color={fg} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  pressed: { opacity: 0.7 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 20,
  },
  label: { fontFamily: fonts.semiBold, fontSize: 15, letterSpacing: -0.1 },
  circle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

export default Button;
