import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from '../../../theme/icons';
import { breakpoints, colors, radius, shadows, type } from '../../../theme';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // scrolls
  footer?: React.ReactNode; // pinned under the scrolling body (primary action)
};

// Common modal shell: slide-up sheet on phones, centred card on wider screens, title + close button.
function Sheet({ open, onClose, title, children, footer }: Props) {
  const { width } = useWindowDimensions();
  const sheet = width < breakpoints.tablet;
  const { bottom } = useSafeAreaInsets();
  const pad = sheet ? { paddingBottom: 16 + bottom } : null;

  return (
    <Modal transparent statusBarTranslucent visible={open} animationType={sheet ? 'slide' : 'fade'} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.backdrop, sheet ? styles.backdropSheet : styles.backdropCentre]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={`Close ${title}`} />
        <View accessibilityViewIsModal style={[styles.card, sheet ? styles.cardSheet : styles.cardCentre]}>
          <View style={styles.head}>
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={styles.close} hitSlop={8}>
              <X size={16} color={colors.textMuted} strokeWidth={2.5} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.body}
            contentContainerStyle={[styles.bodyContent, !footer && pad]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          {footer && <View style={[styles.footer, pad]}>{footer}</View>}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  backdropSheet: { justifyContent: 'flex-end' },
  backdropCentre: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', backgroundColor: colors.white, overflow: 'hidden' },
  cardSheet: { maxHeight: '88%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  cardCentre: { maxWidth: 520, maxHeight: '86%', borderRadius: radius.lg, boxShadow: shadows.modal },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  title: { ...type.title3, color: colors.text },
  close: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' },
  body: { flexShrink: 1 },
  bodyContent: { padding: 20 },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
});

export default Sheet;
