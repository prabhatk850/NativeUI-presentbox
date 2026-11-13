import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddressModal from '../../components/organisms/AddressModal/AddressModal';
import WishlistModal from '../../components/organisms/WishlistModal/WishlistModal';
import Button from '../../components/atoms/Button/Button';
import Auth from '../Auth/Auth';
import { ChevronRight, CircleUser, Heart, MapPin, ShoppingCart, type LucideIcon } from '../../theme/icons';
import { cartCount, selectedAddress, shop, useShop } from '../../store';
import { colors, fonts, radius, type } from '../../theme';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

function Row({ icon: Icon, label, detail, onPress, last }: { icon: LucideIcon; label: string; detail: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint={detail} onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconTile}>
        <Icon size={18} color={colors.primary} />
      </View>
      <View style={[styles.rowBody, !last && styles.rowDivider]}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowDetail} numberOfLines={1}>
            {detail}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textSubtle} />
      </View>
    </Pressable>
  );
}

function Profile() {
  const state = useShop();
  const navigation = useNavigation();
  const [open, setOpen] = useState<null | 'auth' | 'address' | 'wishlist'>(null);
  const close = () => setOpen(null);
  const { user, wishlist, addresses } = state;
  const items = cartCount(state);
  const address = selectedAddress(state);

  return (
    <>
      {user ? (
        <View style={styles.page}>
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(user.name) || '?'}</Text>
            </View>
            <View style={styles.flex}>
              <Text accessibilityRole="header" style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
          </View>

          <View style={styles.group}>
            <Row icon={ShoppingCart} label="My Cart" detail={`${items} item${items === 1 ? '' : 's'}`} onPress={() => navigation.navigate('Cart')} />
            <Row icon={Heart} label="Wishlist" detail={`${wishlist.length} saved`} onPress={() => setOpen('wishlist')} />
            <Row
              icon={MapPin}
              label="Saved addresses"
              detail={address ? `${addresses.length} saved · delivering to ${address.city} ${address.pincode}` : 'Add a delivery address'}
              onPress={() => setOpen('address')}
              last
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              shop.signOut();
              navigation.navigate('Home');
            }}
            style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <CircleUser size={32} color={colors.primary} />
          </View>
          <Text accessibilityRole="header" style={styles.emptyTitle}>
            You’re not signed in
          </Text>
          <Text style={styles.emptyText}>Sign in to see your profile, orders and saved addresses.</Text>
          <Button label="Sign in" color={colors.primary} onPress={() => setOpen('auth')} style={styles.center} />
        </View>
      )}

      <Auth open={open === 'auth'} onClose={close} />
      <AddressModal open={open === 'address'} onClose={close} />
      <WishlistModal open={open === 'wishlist'} onClose={close} />
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.6 },
  center: { alignSelf: 'center', marginTop: 12 },
  page: { gap: 20, width: '100%', maxWidth: 640, alignSelf: 'center' },

  card: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: radius.lg, backgroundColor: colors.surface },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  avatarText: { fontFamily: fonts.bold, fontSize: 24, color: colors.white },
  name: { ...type.title2, color: colors.text },
  email: { ...type.subhead, color: colors.textMuted },

  group: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 16 },
  iconTile: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint },
  rowBody: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingRight: 14 },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.separator },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { ...type.headline, color: colors.text },
  rowDetail: { ...type.footnote, color: colors.textMuted },

  signOut: { height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  signOutText: { ...type.headline, color: colors.primary },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 48 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint, marginBottom: 8 },
  emptyTitle: { ...type.title3, color: colors.text },
  emptyText: { ...type.subhead, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },
});

export default Profile;
