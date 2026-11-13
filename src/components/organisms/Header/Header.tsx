import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CircleUser, Menu, X } from '../../../theme/icons';
import MegaMenu from '../../molecules/MegaMenu/MegaMenu';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Tabs from '../../atoms/Tabs/Tabs';
import MobileHeader from './MobileHeader';
import { DeliverTo, SearchButton, ShopActions } from './ShopActions';
import { getHeaders } from '../../../cms';
import { useShop } from '../../../store';
import type { MenuItem } from '../../molecules/FooterMenuCard/FooterMenuCard';
import { breakpoints, colors, fonts, layout, shadows } from '../../../theme';

type MenuEntry = {
  key: string;
  name: string;
  heading: string;
  subheading: string;
  links: { id: string; navlinks: MenuItem[] }[];
  img: { url?: string } | null;
  grid: string;
};

// routes that show a breadcrumb next to the logo (home shows just the logo)
const PAGE_TITLES: Record<string, string> = { Products: 'Products', Cart: 'Cart', Profile: 'My Profile', Orders: 'Orders', PaymentMethods: 'Payment Methods', Help: 'Help Center', Occasions: 'Occasions', About: 'About', Careers: 'Careers' };

type Props = {
  onOpenAuth?: () => void;
  center?: React.ReactNode; // desktop: content shown between the two pills
  transparent?: boolean; // phones: bar sits clear over a hero until the page scrolls
};

function Header({ onOpenAuth, center, transparent = false }: Props) {
  const navigation = useNavigation();
  const { user } = useShop();
  const route = useRoute();
  const { width, height } = useWindowDimensions();
  const isMobile = width < breakpoints.mobile;

  const [menu, setMenu] = useState<MenuEntry[]>([]);
  const [activeName, setActiveName] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(false); // desktop mega menu

  useEffect(() => {
    getHeaders()
      .then((res) => {
        const items: MenuEntry[] = res.map((e) => ({
          key: e.id,
          name: e.name,
          heading: e.menuDescription?.heading ?? '',
          subheading: e.menuDescription?.description ?? '',
          links: e.navlink ?? [],
          img: e.img ?? null,
          grid: e.grid ?? 'heading_image_image',
        }));
        if (items.length > 0) {
          setMenu(items);
          setActiveName(items[0].name);
        }
      })
      .catch((error) => console.error('Failed to load menu', error));
  }, []);

  const pageTitle = PAGE_TITLES[route.name];
  const crumbs = pageTitle ? [{ label: pageTitle }] : [];
  const goHome = () => navigation.navigate('Home');
  const logo = (onPress = goHome) => (
    <Pressable accessibilityRole="link" accessibilityLabel="PresentBox home" onPress={onPress}>
      <Text style={styles.logo}>PresentBox</Text>
    </Pressable>
  );

  if (isMobile) {
    return (
      <MobileHeader menu={menu} routeName={route.name} transparent={transparent} onHome={goHome} onOpenAuth={onOpenAuth} />
    );
  }


  // ---- wide screens (web desktop, tablets): two floating pills ----
  const activeMenu = menu.find((m) => m.name === activeName);

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, styles.desktopWrapper]}>
      <Pressable
        onHoverIn={() => setLeftOpen(true)}
        onHoverOut={() => setLeftOpen(false)}
        onPress={() => !leftOpen && setLeftOpen(true)}
        style={[styles.coverLeft, leftOpen && [styles.coverLeftOpen, { minHeight: height * 0.6 }]]}
      >
        <View style={styles.head}>
          {logo()}
          {!leftOpen && <Breadcrumb items={crumbs} color={colors.white} />}
          {!leftOpen && <Menu size={22} color={colors.white} />}
          {leftOpen && (
            <Tabs
              variant="pill"
              trigger="hover"
              style={styles.menuTabs}
              tabs={menu.map((m) => ({ value: m.name, label: m.name }))}
              value={activeName}
              onChange={setActiveName}
            />
          )}
          {/* touch devices have no hover-out, so give them a close button */}
          {leftOpen && Platform.OS !== 'web' && (
            <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={() => setLeftOpen(false)} style={styles.closeMenu}>
              <X size={24} color={colors.white} />
            </Pressable>
          )}
        </View>
        {leftOpen && activeMenu && (
          <MegaMenu
            key={activeMenu.key}
            heading={activeMenu.heading}
            subheading={activeMenu.subheading}
            links={activeMenu.links}
            img={activeMenu.img}
            grid={activeMenu.grid}
          />
        )}
      </Pressable>

      {!leftOpen && (
        <View pointerEvents="box-none" style={styles.center}>
          {center}
        </View>
      )}

      {!leftOpen && (
        <View style={styles.coverRight}>
          <View style={styles.deliverTo}>
            <DeliverTo color={colors.white} stacked />
          </View>
          <SearchButton color={colors.white} size={24} />
          <ShopActions color={colors.white} size={24} />
          <Pressable
            accessibilityRole="button"
            onPress={user ? () => navigation.navigate('Profile') : onOpenAuth}
            style={({ pressed }) => [styles.signInRow, styles.signInPill, pressed && styles.hoverBg]}
          >
            <CircleUser size={25} color={colors.white} />
            <Text style={styles.signIn}>{user ? 'My Profile' : 'Sign in'}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const pill = {
  backgroundColor: colors.dark,
  borderRadius: 32,
  boxShadow: `${shadows.float}, inset 0 1px 1px rgba(255, 255, 255, 0.06)`,
} as const;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  wrapper: { position: 'absolute', left: 0, right: 0, zIndex: 1000 },
  desktopWrapper: {
    top: 63,
    paddingHorizontal: layout.pageGutter,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: { fontFamily: fonts.logo, fontSize: 16, color: colors.white },


  // desktop
  coverLeft: { ...pill, paddingVertical: 10, paddingHorizontal: 20 },
  coverLeftOpen: {
    flex: 1,
    paddingVertical: 48,
    paddingHorizontal: 60,
    backgroundImage: 'linear-gradient(155deg, #000000 0%, #050505f0 90%, #000000 100%)',
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 20, height: 50 },
  menuTabs: { marginLeft: 50, gap: 70 },
  closeMenu: { marginLeft: 'auto', padding: 6 },
  center: { flex: 1, minWidth: 0, height: 70, justifyContent: 'center', paddingHorizontal: 24 },
  coverRight: {
    ...pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 70,
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deliverTo: {
    flexShrink: 1,
    marginRight: 8,
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
  hoverBg: { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  signInRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 7 },
  signIn: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
  signInPill: { gap: 5, borderRadius: 30 },
});

export default Header;
