import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Check } from '../../../icons';
import { colors, type } from '../../../theme';

type Props = {
  label?: React.ReactNode; // text, or a node such as text with a link
  checked: boolean;
  onChange?: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

function Checkbox({ label, checked, onChange, style }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange?.(!checked)}
      style={[styles.row, style]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Check size={14} color={colors.white} strokeWidth={3} />}
      </View>
      {typeof label === 'string' ? <Text style={styles.label}>{label}</Text> : label}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', minHeight: 44 },
  box: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: colors.borderHover,
    borderRadius: 7,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { ...type.subhead, color: colors.text },
});

export default Checkbox;
