import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MainLayout from '../components/templates/MainLayout/MainLayout';
import Button from '../components/atoms/Button/Button';
import { Package, RefreshCcw } from '../icons';
import { getOrders, getProducts } from '../api';
import { formatPrice, priceValue, type Product } from '../helper';
import { shop } from '../store';
import { colors, fonts, radius, shadows, type } from '../theme';

type Order = Awaited<ReturnType<typeof getOrders>>['data'][number];

const STATUS_COLORS: Record<string, string> = { Delivered: colors.success, Shipped: colors.primary, Cancelled: colors.textMuted };

// "2026-10-14" → "14 Oct 2026", read as a local date so no timezone can shift the day
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

function Orders() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([getOrders(), getProducts()])
      .then(([o, p]) => {
        setOrders(o.data);
        setProducts(p.data);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  // ponytail: orders are demo data; load the signed-in user's orders from the API once checkout exists
  const lines = (order: Order) =>
    order.items.flatMap(({ productId, qty }) => {
      const product = products.find((p) => p.id === productId);
      return product ? [{ product, qty }] : [];
    });
  const buyAgain = (order: Order) => {
    lines(order).forEach(({ product, qty }) => shop.addToCart(product, qty));
    navigation.navigate('Cart');
  };

  return (
    <MainLayout>
      <Text accessibilityRole="header" style={styles.title}>
        Your Orders
      </Text>

      {orders?.length === 0 && (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Package size={30} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>When you place an order it shows up here, with live delivery updates.</Text>
          <Button label="Browse gifts" color={colors.primary} onPress={() => navigation.navigate('Products')} style={styles.center} />
        </View>
      )}

      <View style={styles.list}>
        {orders?.map((order) => {
          const items = lines(order);
          const total = items.reduce((sum, l) => sum + priceValue(l.product.price) * l.qty, 0);
          const statusColor = STATUS_COLORS[order.status] ?? colors.text;
          return (
            <View key={order.id} accessibilityLabel={`Order ${order.id}, ${order.status}`} style={styles.card}>
              <View style={styles.cardHead}>
                <View style={styles.flex}>
                  <Text style={styles.orderId}>Order {order.id}</Text>
                  <Text style={styles.placed}>Placed on {formatDate(order.placedOn)}</Text>
                </View>
                <Text style={[styles.status, { color: statusColor, borderColor: statusColor }]}>{order.status}</Text>
              </View>
              <Text style={[styles.note, { color: statusColor }]}>{order.statusNote}</Text>

              {items.map(({ product, qty }) => (
                <Pressable
                  key={product.id}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${product.name}`}
                  onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
                  style={({ pressed }) => [styles.item, pressed && styles.pressed]}
                >
                  <Image source={{ uri: product.img }} style={styles.thumb} />
                  <View style={styles.flex}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.itemMeta}>
                      Qty {qty} · {product.price}
                    </Text>
                  </View>
                </Pressable>
              ))}

              <View style={styles.cardFoot}>
                <Text style={styles.total}>Total {formatPrice(total)}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={`Buy order ${order.id} again`} onPress={() => buyAgain(order)} hitSlop={8} style={styles.again}>
                  <RefreshCcw size={14} color={colors.primary} />
                  <Text style={styles.againText}>Buy again</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
  center: { alignSelf: 'center', marginTop: 12 },
  title: { ...type.largeTitle, color: colors.text, marginBottom: 20 },
  list: { gap: 16, width: '100%', maxWidth: 720, alignSelf: 'center' },

  card: { gap: 10, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, boxShadow: shadows.card },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  orderId: { ...type.headline, color: colors.text },
  placed: { ...type.footnote, color: colors.textMuted },
  status: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill, borderWidth: 1, ...type.caption, fontFamily: fonts.semiBold, overflow: 'hidden' },
  note: { ...type.subhead, fontFamily: fonts.medium },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.surface },
  itemName: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.text },
  itemMeta: { ...type.footnote, color: colors.textMuted },
  cardFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  total: { ...type.headline, color: colors.text },
  again: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  againText: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.primary },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 48 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint, marginBottom: 8 },
  emptyTitle: { ...type.title3, color: colors.text },
  emptyText: { ...type.subhead, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },
});

export default Orders;
