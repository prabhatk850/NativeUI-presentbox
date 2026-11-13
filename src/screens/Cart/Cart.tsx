import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddressModal from '../../components/organisms/AddressModal/AddressModal';
import Button from '../../components/atoms/Button/Button';
import Stepper from '../../components/atoms/Stepper/Stepper';
import { MapPin, ShoppingCart, Trash } from '../../theme/icons';
import { cartCount, selectedAddress, shop, useShop, type CartLine } from '../../store';
import { formatPrice, priceValue } from '../../utils';
import { breakpoints, colors, fonts, radius, shadows, type } from '../../theme';

// ponytail: flat delivery rule; move to the API when shipping is priced per pincode
const FREE_DELIVERY_FROM = 999;
const DELIVERY_FEE = 49;

function Line({ line }: { line: CartLine }) {
  const { product: p, qty } = line;
  return (
    <View style={styles.line}>
      <Image source={{ uri: p.img }} accessibilityLabel={p.name} style={styles.thumb} />
      <View style={styles.lineInfo}>
        <Text style={styles.lineName} numberOfLines={2}>
          {p.name}
        </Text>
        <Text style={styles.linePrice}>{p.price}</Text>
        <View style={styles.lineActions}>
          <Stepper value={qty} onChange={(n) => shop.setQty(p.id, n)} label={p.name} />
          <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${p.name}`} onPress={() => shop.setQty(p.id, 0)} style={styles.remove} hitSlop={8}>
            <Trash size={16} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
      <Text style={styles.lineTotal}>{formatPrice(priceValue(p.price) * qty)}</Text>
    </View>
  );
}

function Cart() {
  const state = useShop();
  const navigation = useNavigation();
  const wide = useWindowDimensions().width >= breakpoints.tablet;
  const [addressOpen, setAddressOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const address = selectedAddress(state);
  const count = cartCount(state);

  const subtotal = state.cart.reduce((sum, l) => sum + priceValue(l.product.price) * l.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  // ponytail: no order API yet, so checkout only checks there is somewhere to deliver
  const checkout = () => (address ? setNotice('Checkout is coming soon. Your cart is saved for now.') : setAddressOpen(true));

  return (
    <>
      <View style={styles.titleRow}>
        <Text accessibilityRole="header" style={styles.title}>
          Your Cart
        </Text>
        {count > 0 && <Text style={styles.count}>{`${count} item${count === 1 ? '' : 's'}`}</Text>}
      </View>

      {count === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <ShoppingCart size={30} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Find something they’ll love — flowers, cakes, room decor and more.</Text>
          <Button label="Browse gifts" color={colors.primary} onPress={() => navigation.navigate('Products')} style={styles.center} />
        </View>
      ) : (
        <View style={[styles.body, wide && styles.bodyWide]}>
          <View style={[styles.items, wide && styles.itemsWide]}>
            <View style={styles.address}>
              <MapPin size={20} color={colors.primary} />
              <View style={styles.addressInfo}>
                {address ? (
                  <>
                    <Text style={styles.addressName}>
                      Deliver to {address.name} · {address.label}
                    </Text>
                    <Text style={styles.addressLine} numberOfLines={2}>
                      {address.line}, {address.city} – {address.pincode}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.addressName}>Where should we deliver?</Text>
                )}
              </View>
              <Pressable accessibilityRole="button" onPress={() => setAddressOpen(true)} hitSlop={8}>
                <Text style={styles.change}>{address ? 'Change' : 'Add address'}</Text>
              </Pressable>
            </View>
            {state.cart.map((l) => (
              <Line key={l.product.id} line={l} />
            ))}
          </View>

          <View style={[styles.summary, wide && styles.summaryWide]}>
            <Text style={styles.summaryTitle}>Order summary</Text>
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Subtotal</Text>
              <Text style={styles.sumValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Delivery</Text>
              <Text style={[styles.sumValue, delivery === 0 && styles.free]}>{delivery ? formatPrice(delivery) : 'Free'}</Text>
            </View>
            {delivery > 0 && <Text style={styles.hint}>Add {formatPrice(FREE_DELIVERY_FROM - subtotal)} more for free delivery.</Text>}
            <View style={[styles.sumRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text accessibilityLabel={`Total ${formatPrice(subtotal + delivery)}`} style={styles.totalValue}>
                {formatPrice(subtotal + delivery)}
              </Text>
            </View>
            {!!notice && (
              <Text accessibilityRole="alert" style={styles.notice}>
                {notice}
              </Text>
            )}
            <Button
              label="Proceed to checkout"
              color={colors.primary}
              onPress={checkout}
              style={styles.block}
              pillStyle={styles.blockPill}
            />
          </View>
        </View>
      )}

      <AddressModal open={addressOpen} onClose={() => setAddressOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  center: { alignSelf: 'center', marginTop: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginBottom: 20 },
  title: { ...type.largeTitle, color: colors.text },
  count: { ...type.subhead, color: colors.textMuted },

  body: { gap: 24 },
  bodyWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 40 },
  items: {},
  itemsWide: { flex: 1.6 },

  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 8,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  addressInfo: { flex: 1, gap: 2 },
  addressName: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.text },
  addressLine: { ...type.footnote, color: colors.textMuted },
  change: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.primary },

  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  thumb: { width: 84, height: 84, borderRadius: 12, backgroundColor: colors.surface },
  lineInfo: { flex: 1, gap: 2 },
  lineName: { ...type.headline, color: colors.text },
  linePrice: { ...type.footnote, color: colors.textMuted },
  lineActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  remove: { padding: 6 },
  lineTotal: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.text },

  summary: { gap: 12, padding: 20, borderRadius: radius.lg, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, boxShadow: shadows.card },
  summaryWide: { flex: 1, maxWidth: 380 },
  summaryTitle: { ...type.title3, color: colors.text, marginBottom: 4 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { ...type.subhead, color: colors.textMuted },
  sumValue: { ...type.subhead, color: colors.text },
  free: { fontFamily: fonts.semiBold, color: colors.primary },
  hint: { ...type.footnote, color: colors.textMuted },
  totalRow: { paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.separator },
  totalLabel: { ...type.headline, color: colors.text },
  totalValue: { ...type.headline, color: colors.text },
  notice: { padding: 12, borderRadius: 12, backgroundColor: colors.primaryTint, ...type.footnote, fontFamily: fonts.medium, color: colors.primary },
  block: { alignSelf: 'stretch', marginTop: 4 },
  blockPill: { flex: 1, justifyContent: 'center', minHeight: 50, borderRadius: radius.md },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 48 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint, marginBottom: 8 },
  emptyTitle: { ...type.title3, color: colors.text },
  emptyText: { ...type.subhead, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },
});

export default Cart;
