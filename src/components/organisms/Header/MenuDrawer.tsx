import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useLinkTo } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, CircleUser, CreditCard, Gift, House, LayoutGrid, LifeBuoy, Package, X, type LucideIcon } from '../../../icons';
import type { MenuSection } from './MobileHeader';
import { colors, fonts, layout, radius, shadows, type } from '../../../theme';
import { withCategory } from '../../../navigation';
import { useShop } from '../../../store';

const NATIVE = Platform.OS !== 'web'; // native driver isn't available on web
const SECTION_ICONS: Record<string, LucideIcon> = { Occasions: Gift, Categories: LayoutGrid };
// header sections the phone menu leaves out (desktop's mega menu still shows them)
const HIDDEN_SECTIONS = ['About'];
// account and support pages, after the shop sections
const PAGES = [
  { route: 'Orders', url: '/orders', label: 'Orders', icon: Package },
  { route: 'PaymentMethods', url: '/payment-methods', label: 'Payment Methods', icon: CreditCard },
  { route: 'Help', url: '/help', label: 'Help Center', icon: LifeBuoy },
];

type Props = {
  open: boolean;
  onClose: () => void;
  menu: MenuSection[];
  routeName: string;
  onHome: () => void;
  onOpenAuth?: () => void;
};

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduce)
      .catch(() => {});
  }, []);
  return reduce;
}

// Drill-down pages push in from the side they came from, like iOS navigation.
function SlideIn({ from, animate, children }: { from: 1 | -1; animate: boolean; children: React.ReactNode }) {
  const offset = useRef(new Animated.Value(animate ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(offset, { toValue: 0, damping: 22, stiffness: 260, useNativeDriver: NATIVE }).start();
  }, [offset]);
  return (
    <Animated.View
      style={{
        opacity: offset.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
        transform: [{ translateX: offset.interpolate({ inputRange: [0, 1], outputRange: [0, 48 * from] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}

function Row({ icon: Icon, label, active, chevron, onPress }: { icon: LucideIcon; label: string; active?: boolean; chevron?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole={chevron ? 'button' : 'link'}
      accessibilityState={active ? { selected: true } : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={[styles.iconTile, active && styles.iconTileActive]}>
        <Icon size={17} color={active ? colors.primary : colors.text} />
      </View>
      <Text style={[styles.rowText, active && styles.rowTextActive]}>{label}</Text>
      {chevron && <ChevronRight size={16} color={colors.textSubtle} />}
    </Pressable>
  );
}

// Right-hand menu panel that grows out of the hamburger: dimmed backdrop, springy panel,
// hamburger → X morph, staggered rows and push/pop drill-down.
function MenuDrawer({ open, onClose, menu, routeName, onHome, onOpenAuth }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const linkTo = useLinkTo();
  const { user } = useShop();
  const reduceMotion = useReduceMotion();
  const panel = useRef(new Animated.Value(0)).current; // spring: backdrop, panel, close button
  const rows = useRef(new Animated.Value(0)).current; // timing: row cascade
  const [mounted, setMounted] = useState(open);
  const [sectionName, setSectionName] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const section = menu.find((m) => m.name === sectionName);

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (reduceMotion) {
        panel.setValue(1);
        rows.setValue(1);
        return;
      }
      rows.setValue(0);
      Animated.parallel([
        Animated.spring(panel, { toValue: 1, damping: 15, stiffness: 190, mass: 0.9, useNativeDriver: NATIVE }),
        Animated.timing(rows, { toValue: 1, delay: 70, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: NATIVE }),
      ]).start();
    } else {
      Animated.timing(panel, {
        toValue: 0,
        duration: reduceMotion ? 0 : 190,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: NATIVE,
      }).start(({ finished }) => {
        if (!finished) return;
        setMounted(false);
        setSectionName(null);
        setDirection(1);
      });
    }
  }, [open, panel, rows, reduceMotion]);

  const go = (then?: () => void) => () => {
    onClose();
    then?.();
  };
  const goTo = (url: string) => go(() => url && url !== '#' && linkTo(url));
  const drill = (name: string | null) => {
    setDirection(name ? 1 : -1);
    setSectionName(name);
  };

  // each row fades and slides in a beat after the previous one
  const cascade = (i: number) => {
    const start = Math.min(i * 0.11, 0.55);
    const range = { inputRange: [start, start + 0.45], extrapolate: 'clamp' as const };
    return {
      opacity: rows.interpolate({ ...range, outputRange: [0, 1] }),
      transform: [{ translateX: rows.interpolate({ ...range, outputRange: [32, 0] }) }],
    };
  };

  const fade = panel.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const panelWidth = Math.min(320, width - 24);
  const barTop = insets.top + layout.mobileAddressHeight + (layout.mobileBarHeight - 44) / 2;
  const panelTop = insets.top + layout.mobileAddressHeight + layout.mobileBarHeight + 4;

  const rootItems = [
    { key: 'home', node: <Row icon={House} label="Home" active={routeName === 'Home'} onPress={go(onHome)} /> },
    ...(user
      ? [{ key: 'profile', node: <Row icon={CircleUser} label="My Profile" active={routeName === 'Profile'} onPress={goTo('/profile')} /> }]
      : []),
    ...menu
      .filter((m) => !HIDDEN_SECTIONS.includes(m.name))
      .map((m) => ({
        key: m.name,
        node: <Row icon={SECTION_ICONS[m.name] ?? ChevronRight} label={m.name} chevron onPress={() => drill(m.name)} />,
      })),
    ...PAGES.map((p) => ({
      key: p.route,
      node: <Row icon={p.icon} label={p.label} active={routeName === p.route} onPress={goTo(p.url)} />,
    })),
  ];

  return (
    <Modal transparent statusBarTranslucent visible={open || mounted} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close menu backdrop" />
      </Animated.View>

      <View accessibilityViewIsModal pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {/* sits exactly over the hamburger and spins in, so the icon appears to morph into an X */}
        <Animated.View
          style={[
            styles.closeWrap,
            {
              top: barTop,
              right: layout.mobileGutter - 8,
              opacity: fade,
              transform: [
                { rotate: panel.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) },
                { scale: panel.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
              ],
            },
          ]}
        >
          <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={colors.text} strokeWidth={2.5} />
          </Pressable>
        </Animated.View>

        <Animated.View
          accessibilityLabel="Main menu"
          style={[
            styles.panel,
            {
              top: panelTop,
              width: panelWidth,
              maxHeight: height - panelTop - insets.bottom - 16,
              opacity: fade,
              transform: [
                { translateX: panel.interpolate({ inputRange: [0, 1], outputRange: [panelWidth * 0.35, 0] }) },
                { translateY: panel.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) },
                { scale: panel.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
              ],
            },
          ]}
        >
          <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <SlideIn key={sectionName ?? 'root'} from={direction} animate={sectionName !== null || direction === -1}>
              {section ? (
                <View>
                  <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => drill(null)} style={styles.back} hitSlop={8}>
                    <ChevronLeft size={20} color={colors.primary} />
                    <Text style={styles.backText}>Back</Text>
                  </Pressable>
                  <Text accessibilityRole="header" style={styles.sectionTitle}>
                    {section.name}
                  </Text>
                  {section.links
                    .flatMap((col) => col.navlinks ?? [])
                    .map((l) => (
                      <Pressable
                        key={l.id}
                        accessibilityRole="link"
                        onPress={goTo(withCategory(l.url, l.lable))}
                        style={({ pressed }) => [styles.link, pressed && styles.rowPressed]}
                      >
                        <Text style={styles.linkText}>{l.lable}</Text>
                        <ChevronRight size={16} color={colors.textSubtle} />
                      </Pressable>
                    ))}
                </View>
              ) : (
                <View>
                  {rootItems.map((item, i) => (
                    <Animated.View key={item.key} style={cascade(i)}>
                      {item.node}
                    </Animated.View>
                  ))}
                </View>
              )}
            </SlideIn>

            {!user && (
              <Animated.View style={[styles.footer, cascade(rootItems.length)]}>
                <Pressable
                  accessibilityRole="button"
                  onPress={go(onOpenAuth)}
                  style={({ pressed }) => [styles.signIn, pressed && styles.signInPressed]}
                >
                  <CircleUser size={19} color={colors.white} />
                  <Text style={styles.signInText}>Sign in</Text>
                </Pressable>
              </Animated.View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.38)' },
  closeWrap: { position: 'absolute' },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    boxShadow: shadows.menu,
  },
  panel: {
    position: 'absolute',
    right: 12,
    backgroundColor: colors.white,
    borderRadius: 24,
    boxShadow: shadows.modal,
    overflow: 'hidden',
    transformOrigin: 'top right', // grows out of the hamburger corner
  },
  body: { padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 10, borderRadius: radius.md },
  rowPressed: { backgroundColor: colors.surface },
  iconTile: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  iconTileActive: { backgroundColor: colors.primaryTint },
  rowText: { ...type.headline, flex: 1, color: colors.text },
  rowTextActive: { color: colors.primary },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 6 },
  backText: { ...type.body, color: colors.primary },
  sectionTitle: { ...type.title3, color: colors.text, paddingHorizontal: 10, paddingTop: 2, paddingBottom: 6 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 10,
    borderRadius: radius.md,
  },
  linkText: { ...type.body, color: colors.text },
  footer: {
    marginTop: 8,
    paddingTop: 10,
    paddingHorizontal: 2,
    paddingBottom: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  signIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  signInPressed: { opacity: 0.85 },
  signInText: { ...type.headline, fontFamily: fonts.semiBold, color: colors.white },
});

export default MenuDrawer;
