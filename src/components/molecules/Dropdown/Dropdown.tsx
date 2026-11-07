import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Check, ChevronDown } from '../../../icons';
import { colors, fonts, shadows } from '../../../theme';

type Props = {
  label?: string; // prefix shown before the value, e.g. "Sort:"
  options: string[];
  value: string;
  onChange?: (option: string) => void;
  align?: 'left' | 'right'; // which edge of the trigger the menu lines up with
};

type Anchor = { top: number; left?: number; right?: number; minWidth: number };

// Select-style dropdown. The menu opens in a transparent Modal anchored under the trigger,
// so it is never clipped by a parent and closes on any outside tap.
function Dropdown({ label, options, value, onChange, align = 'left' }: Props) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<React.ComponentRef<typeof View>>(null);
  const { width: windowWidth } = useWindowDimensions();

  const show = () => {
    setOpen(true);
    triggerRef.current?.measureInWindow((x, y, w, h) =>
      setAnchor({
        top: y + h + 8,
        minWidth: w,
        ...(align === 'right' ? { right: windowWidth - x - w } : { left: x }),
      }),
    );
  };
  const close = () => {
    setOpen(false);
    setAnchor(null);
  };
  const select = (option: string) => {
    onChange?.(option);
    close();
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={open ? close : show}
        style={[styles.trigger, open && styles.triggerOpen]}
      >
        {label && <Text style={styles.prefix}>{label}</Text>}
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <ChevronDown
          size={16}
          color={colors.textMuted}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close menu" />
        {/* stays transparent until measured, so it never flashes in the wrong place */}
        {open && (
          <View accessibilityRole="list" style={[styles.menu, anchor ?? styles.unmeasured]}>
            {options.map((option) => {
              const selected = option === value;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected }}
                  onPress={() => select(option)}
                  style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.optionPressed]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
                  {selected && <Check size={16} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    flexShrink: 1,
    paddingHorizontal: 14,
    backgroundColor: colors.fill,
    borderRadius: 18,
  },
  triggerOpen: { boxShadow: `0 0 0 3px ${colors.primaryRing}` },
  prefix: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted },
  value: { flexShrink: 1, fontFamily: fonts.semiBold, fontSize: 15, letterSpacing: -0.1, color: colors.text },
  menu: {
    position: 'absolute',
    padding: 6,
    backgroundColor: colors.white,
    borderRadius: 14,
    boxShadow: shadows.menu,
  },
  unmeasured: { opacity: 0 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  optionSelected: { backgroundColor: colors.primaryTint },
  optionPressed: { backgroundColor: colors.input },
  optionText: { fontFamily: fonts.regular, fontSize: 16, color: colors.text },
  optionTextSelected: { fontFamily: fonts.semiBold, color: colors.primary },
});

export default Dropdown;
