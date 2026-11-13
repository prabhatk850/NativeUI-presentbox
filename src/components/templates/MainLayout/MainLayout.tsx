import React, { createContext, useContext, useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../organisms/Header/Header';
import Footer from '../../organisms/Footer/Footer';
import Auth from '../../../screens/Auth/Auth';
import { breakpoints, colors, layout } from '../../../theme';

type Props = {
  overlay?: boolean; // content starts under the floating header (home hero video)
  headerCenter?: React.ReactNode; // shown in the middle of the desktop header
  children: React.ReactNode;
};

const HeaderCenter = createContext<(node: React.ReactNode) => void>(() => {});

// Lets a block inside the page fill the middle of the desktop header (the products page puts its category pills there).
export function useHeaderCenter(node: React.ReactNode) {
  const setCenter = useContext(HeaderCenter);
  useEffect(() => {
    setCenter(node);
    return () => setCenter(undefined);
  }, [setCenter, node]);
}

// Page shell: scrolling content + footer, floating header on top, auth modal.
function MainLayout({ overlay = false, headerCenter, children }: Props) {
  const [authOpen, setAuthOpen] = useState(false);
  const [blockCenter, setBlockCenter] = useState<React.ReactNode>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const mobile = width < breakpoints.mobile;
  // overlay pages open with a full-screen hero: clear bar + light status bar over it,
  // solid bar + dark status bar once the hero scrolls under the bar
  const [pastHero, setPastHero] = useState(false);
  const barBottom = insets.top + layout.mobileAddressHeight + layout.mobileBarHeight;

  const padding = overlay
    ? null
    : {
        paddingTop: mobile ? barBottom + 16 : layout.headerOffset + insets.top,
        paddingHorizontal: mobile ? layout.mobileGutter : layout.pageGutter,
        paddingBottom: mobile ? 32 : 50,
      };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={overlay && !pastHero ? 'light-content' : 'dark-content'} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={64}
        onScroll={overlay ? (e) => setPastHero(e.nativeEvent.contentOffset.y > height - barBottom) : undefined}
      >
        <View style={padding}>
          <HeaderCenter.Provider value={setBlockCenter}>{children}</HeaderCenter.Provider>
        </View>
        <Footer />
      </ScrollView>
      <Header onOpenAuth={() => setAuthOpen(true)} center={headerCenter ?? blockCenter} transparent={overlay && !pastHero} />
      <Auth open={authOpen} onClose={() => setAuthOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
});

export default MainLayout;
