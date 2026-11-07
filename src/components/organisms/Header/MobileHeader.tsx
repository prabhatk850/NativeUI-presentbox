import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu } from '../../../icons';
import MenuDrawer from './MenuDrawer';
import { DeliverTo, SearchButton, ShopActions } from './ShopActions';
import type { MenuItem } from '../../molecules/FooterMenuCard/FooterMenuCard';
import { colors, fonts, layout } from '../../../theme';

export type MenuSection = { key: number; name: string; links: { id: number; navlinks: MenuItem[] }[] };

type Props = {
  menu: MenuSection[];
  routeName: string;
  transparent?: boolean; // over the home hero: no background, white content
  onHome: () => void;
  onOpenAuth?: () => void;
};

// Phone navigation: a full-width top bar (like a native nav bar) with search and a right-hand menu panel.
function MobileHeader({ menu, routeName, transparent = false, onHome, onOpenAuth }: Props) {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const tint = transparent ? colors.white : colors.text;
  const close = () => setMenuOpen(false);

  return (
    <View style={[styles.bar, { paddingTop: insets.top }, transparent ? styles.clear : styles.solid]}>
      <View style={styles.addressStrip}>
        <DeliverTo color={tint} />
      </View>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="PresentBox home"
          onPress={() => {
            close();
            onHome();
          }}
          hitSlop={8}
        >
          <Text style={[styles.logo, { color: tint }]}>PresentBox</Text>
        </Pressable>
        <View style={styles.actions}>
          <SearchButton color={tint} />
          <ShopActions color={tint} />
          <Pressable accessibilityRole="button" accessibilityLabel="Open menu" onPress={() => setMenuOpen(true)} style={styles.iconBtn}>
            <Menu size={22} color={tint} />
          </Pressable>
        </View>
      </View>

      <MenuDrawer
        open={menuOpen}
        onClose={close}
        menu={menu}
        routeName={routeName}
        onHome={onHome}
        onOpenAuth={onOpenAuth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 },
  clear: { backgroundColor: 'transparent' },
  solid: {
    backgroundColor: colors.bar,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  addressStrip: { height: layout.mobileAddressHeight, justifyContent: 'center', paddingHorizontal: layout.mobileGutter },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: layout.mobileBarHeight,
    paddingLeft: layout.mobileGutter,
    paddingRight: layout.mobileGutter - 8,
  },
  logo: { fontFamily: fonts.logo, fontSize: 13, letterSpacing: 0.5 },
  actions: { flexDirection: 'row' },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});

export default MobileHeader;
