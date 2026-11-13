import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, Heart, MapPin, Search, ShoppingCart, type LucideIcon } from '../../../theme/icons';
import AddressModal from '../AddressModal/AddressModal';
import WishlistModal from '../WishlistModal/WishlistModal';
import SearchModal from '../SearchModal/SearchModal';
import { cartCount, selectedAddress, useShop } from '../../../store';
import { colors, fonts } from '../../../theme';

// "Deliver to …" button; owns the address modal. stacked = two lines (desktop pill), else one line (phone strip).
export function DeliverTo({ color, stacked = false }: { color: string; stacked?: boolean }) {
  const [open, setOpen] = useState(false);
  const address = selectedAddress(useShop());
  const place = address && `${address.name} · ${address.city} ${address.pincode}`;
  const muted = { color, opacity: 0.75 };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={place ? `Deliver to ${place}. Change address` : 'Add delivery address'}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.deliver, pressed && styles.pressed]}
        hitSlop={6}
      >
        <MapPin size={stacked ? 20 : 14} color={color} />
        {stacked ? (
          <View style={styles.stack}>
            <Text style={[styles.small, muted]}>{place ? 'Deliver to' : 'Delivery'}</Text>
            <Text numberOfLines={1} style={[styles.strong, { color }]}>
              {address ? `${address.city} ${address.pincode}` : 'Add address'}
            </Text>
          </View>
        ) : (
          <Text numberOfLines={1} style={[styles.line, styles.shrink, muted]}>
            {place ? 'Deliver to ' : ''}
            <Text style={[styles.strong, { color }]}>{place ?? 'Add delivery address'}</Text>
          </Text>
        )}
        <ChevronDown size={14} color={color} />
      </Pressable>
      <AddressModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function CountButton({ icon: Icon, label, count, color, size, onPress }: { icon: LucideIcon; label: string; count: number; color: string; size: number; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count ? `${label}, ${count} item${count === 1 ? '' : 's'}` : label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
    >
      <Icon size={size} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </Pressable>
  );
}

// Search icon; owns the search modal.
export function SearchButton({ color, size = 22 }: { color: string; size?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel="Search" onPress={() => setOpen(true)} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
        <Search size={size} color={color} />
      </Pressable>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// Wishlist (opens its modal) + cart (opens the cart screen), with item-count badges.
export function ShopActions({ color, size = 22 }: { color: string; size?: number }) {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const navigation = useNavigation();
  const state = useShop();

  return (
    <>
      <CountButton icon={Heart} label="Wishlist" count={state.wishlist.length} color={color} size={size} onPress={() => setWishlistOpen(true)} />
      <CountButton icon={ShoppingCart} label="Cart" count={cartCount(state)} color={color} size={size} onPress={() => navigation.navigate('Cart')} />
      <WishlistModal open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.6 },
  deliver: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0, flexShrink: 1 },
  stack: { maxWidth: 150 },
  small: { fontFamily: fonts.regular, fontSize: 11 },
  line: { fontFamily: fonts.regular, fontSize: 13 },
  shrink: { flexShrink: 1 },
  strong: { fontFamily: fonts.semiBold, fontSize: 13 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 12, color: colors.white },
});
