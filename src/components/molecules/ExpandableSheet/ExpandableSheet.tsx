import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, X } from '../../../icons';
import { breakpoints, colors, layout, shadows, type } from '../../../theme';

type Props = {
  title: string; // shown in the full-screen top bar
  onClose: () => void; // called once the sheet has animated away
  children: React.ReactNode; // scrolls
  footer?: React.ReactNode; // pinned to the bottom (e.g. Add to cart)
  headerRight?: React.ReactNode; // icons on the right of the full-screen top bar
};

const EXPAND_AT = 32; // scroll this far down to go full screen
const MAX_WIDTH = 560; // wider screens keep a centred column
// the top bar and the floating X fade out rather than unmount; keep the faded one away from screen readers
const hiddenUnless = (visible: boolean) => ({
  accessibilityElementsHidden: !visible,
  importantForAccessibility: visible ? ('auto' as const) : ('no-hide-descendants' as const),
});

// Myntra-style sheet: a floating card over the dimmed page that grows to full screen as you scroll down
// and shrinks back to the card when you scroll back to the top.
// Layout props (top / left / radius) animate, so it runs on the JS driver.
function ExpandableSheet({ title, onClose, children, footer, headerRight }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const wide = width >= breakpoints.tablet;
  const shown = useRef(new Animated.Value(0)).current; // 0 off-screen → 1 on screen
  const grow = useRef(new Animated.Value(0)).current; // 0 card → 1 full screen
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    Animated.spring(shown, { toValue: 1, damping: 22, stiffness: 200, useNativeDriver: false }).start();
  }, [shown]);
  useEffect(() => {
    Animated.spring(grow, { toValue: expanded ? 1 : 0, damping: 26, stiffness: 240, useNativeDriver: false }).start();
  }, [expanded, grow]);

  const close = () => Animated.timing(shown, { toValue: 0, duration: 220, useNativeDriver: false }).start(() => onClose());
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (!expanded && y > EXPAND_AT) setExpanded(true);
    else if (expanded && y <= 0) setExpanded(false);
  };

  const side = wide ? Math.max(16, (width - MAX_WIDTH) / 2) : 12;
  const bar = insets.top + layout.mobileBarHeight;
  const between = (from: number, to: number) => grow.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: shown }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel={`Close ${title} backdrop`} />
      </Animated.View>

      <Animated.View
        accessibilityViewIsModal
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        testID="sheet"
        style={[
          styles.card,
          {
            top: between(insets.top + height * (wide ? 0.05 : 0.1), 0),
            bottom: between(insets.bottom + 12, 0),
            left: between(side, wide ? side : 0),
            right: between(side, wide ? side : 0),
            borderRadius: between(24, 0),
            transform: [{ translateY: shown.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }],
          },
        ]}
      >
        {/* room for the top bar once full screen */}
        <Animated.View style={{ height: between(0, bar) }} />
        <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} testID="sheet-scroll">
          {children}
        </Animated.ScrollView>
        {footer && <Animated.View style={[styles.footer, { paddingBottom: between(12, 12 + insets.bottom) }]}>{footer}</Animated.View>}

        <Animated.View
          pointerEvents={expanded ? 'auto' : 'none'}
          {...hiddenUnless(expanded)}
          style={[styles.bar, { height: bar, paddingTop: insets.top, opacity: grow }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={close} style={styles.iconBtn} disabled={!expanded}>
            <ArrowLeft size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.barTitle} numberOfLines={1}>
            {title}
          </Text>
          {headerRight}
        </Animated.View>

        <Animated.View pointerEvents={expanded ? 'none' : 'auto'} {...hiddenUnless(!expanded)} style={[styles.closeWrap, { opacity: between(1, 0) }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} style={styles.close} hitSlop={8} disabled={expanded}>
            <X size={18} color={colors.text} strokeWidth={2.5} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
  card: { position: 'absolute', overflow: 'hidden', backgroundColor: colors.white, boxShadow: shadows.modal },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  barTitle: { flex: 1, ...type.headline, color: colors.text },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  closeWrap: { position: 'absolute', top: 12, right: 12 },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    boxShadow: shadows.segment,
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
    backgroundColor: colors.white,
  },
});

export default ExpandableSheet;
