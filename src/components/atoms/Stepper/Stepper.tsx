import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from '../../../icons';
import { colors, fonts, radius, type } from '../../../theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  label: string; // what is being counted, for screen readers: "Decrease {label}"
  min?: number; // minus is disabled at min
};

// − value + quantity control.
function Stepper({ value, onChange, label, min = 0 }: Props) {
  const atMin = value <= min;
  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${label}`}
        accessibilityState={{ disabled: atMin }}
        disabled={atMin}
        onPress={() => onChange(value - 1)}
        style={[styles.step, atMin && styles.disabled]}
        hitSlop={4}
      >
        <Minus size={14} color={colors.text} />
      </Pressable>
      <Text accessibilityLabel={`${label} quantity ${value}`} style={styles.value}>
        {value}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${label}`} onPress={() => onChange(value + 1)} style={styles.step} hitSlop={4}>
        <Plus size={14} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: radius.pill, backgroundColor: colors.fill },
  step: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.3 },
  value: { minWidth: 20, textAlign: 'center', ...type.subhead, fontFamily: fonts.semiBold, color: colors.text },
});

export default Stepper;
