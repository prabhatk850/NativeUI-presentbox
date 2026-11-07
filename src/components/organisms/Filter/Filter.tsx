import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { SlidersHorizontal } from '../../../icons';
import Button from '../../atoms/Button/Button';
import FilterPage from '../FilterPage/FilterPage';
import { activeFilterCount, type Filters, type Occasion } from '../../../helper';
import { breakpoints, colors, fonts } from '../../../theme';

// Toolbar "Filter" button. Phones get a bottom sheet, wider screens a centred panel.
// Both close on backdrop tap or the Android back button.
type Props = { value?: Filters; occasions?: Occasion[]; onApply?: (filters: Filters) => void };

function Filter({ value, occasions, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const sheet = useWindowDimensions().width < breakpoints.tablet;
  const close = () => setOpen(false);
  const count = value ? activeFilterCount(value) : 0;

  return (
    <>
      <Button
        label={count ? `Filter (${count})` : 'Filter'}
        icon={SlidersHorizontal}
        iconSize={16}
        color={colors.fill}
        textColor={colors.text}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        pillStyle={styles.pill}
        labelStyle={styles.label}
      />
      <Modal
        transparent
        statusBarTranslucent
        visible={open}
        animationType={sheet ? 'slide' : 'fade'}
        onRequestClose={close}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.backdrop, sheet ? styles.backdropSheet : styles.backdropCentre]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close filters backdrop" />
          <FilterPage sheet={sheet} initial={value} occasions={occasions} onClose={close} onApply={onApply} />
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: { minHeight: 36, height: 36, paddingVertical: 0, paddingHorizontal: 14 },
  label: { fontFamily: fonts.semiBold, fontSize: 15 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
  backdropSheet: { justifyContent: 'flex-end' },
  backdropCentre: { alignItems: 'center', justifyContent: 'center', padding: 16 },
});

export default Filter;
