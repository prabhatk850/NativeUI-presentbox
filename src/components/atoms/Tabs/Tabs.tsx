import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { LucideIcon } from '../../../icons';
import { colors, fonts, shadows } from '../../../theme';

// icon tabs render only the icon; label stays as the accessible name
type Tab = { value: string; label: string; icon?: LucideIcon };
type Variant = 'underline' | 'pill' | 'segmented';
type Props = {
  tabs: Tab[];
  value: string | null;
  onChange?: (value: string) => void;
  variant?: Variant; // pill = dark surfaces (header menu), segmented = iOS segmented control
  trigger?: 'press' | 'hover'; // hover also selects on pointer enter (web header menu)
  style?: StyleProp<ViewStyle>;
};

const looks = {
  underline: { list: 'underlineList', tab: 'underlineTab', active: 'underlineTabActive', text: 'underlineText', activeText: 'underlineTextActive' },
  pill: { list: 'pillList', tab: 'pillTab', active: 'pillTabActive', text: 'pillText', activeText: 'pillText' },
  segmented: { list: 'segList', tab: 'segTab', active: 'segTabActive', text: 'segText', activeText: 'segTextActive' },
} as const;

function Tabs({ tabs, value, onChange, variant = 'underline', trigger = 'press', style }: Props) {
  const look = looks[variant];
  return (
    <View accessibilityRole="tablist" style={[styles[look.list], style]}>
      {tabs.map(({ value: tabValue, label, icon: Icon }) => {
        const active = tabValue === value;
        const select = () => onChange?.(tabValue);
        return (
          <Pressable
            key={tabValue}
            accessibilityRole="tab"
            accessibilityLabel={Icon ? label : undefined}
            accessibilityState={{ selected: active }}
            onPress={select}
            onHoverIn={trigger === 'hover' ? select : undefined}
            style={[styles[look.tab], active && styles[look.active]]}
          >
            {Icon ? (
              <Icon size={18} color={active ? colors.text : colors.textMuted} />
            ) : (
              <Text style={active ? styles[look.activeText] : styles[look.text]}>{label}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  underlineList: { flexDirection: 'row', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.separator },
  underlineTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: -1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  underlineTabActive: { borderBottomColor: colors.primary },
  underlineText: { fontFamily: fonts.medium, fontSize: 15, color: colors.textMuted },
  underlineTextActive: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.primary },

  pillList: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  pillTab: { marginVertical: 10, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 25 },
  pillTabActive: { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  pillText: { fontFamily: fonts.regular, fontSize: 20, color: colors.white },

  segList: { flexDirection: 'row', padding: 2, borderRadius: 9, backgroundColor: colors.fill },
  segTab: { flex: 1, minHeight: 32, paddingHorizontal: 12, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  segTabActive: { backgroundColor: colors.white, boxShadow: shadows.segment },
  segText: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  segTextActive: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text },
});

export default Tabs;
