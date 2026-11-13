import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ExpandableSheet from '../../components/molecules/ExpandableSheet/ExpandableSheet';
import ProductCard from '../../components/molecules/ProductCard/ProductCard';
import AddressModal from '../../components/organisms/AddressModal/AddressModal';
import { ShopActions } from '../../components/organisms/Header/ShopActions';
import Stepper from '../../components/atoms/Stepper/Stepper';
import Button from '../../components/atoms/Button/Button';
import { Check, Heart, MapPin, Share2, ShoppingBag, ShoppingCart, Star, type LucideIcon } from '../../theme/icons';
import { getProducts } from '../../cms';
import { selectedAddress, shop, useShop } from '../../store';
import type { RootStackParamList } from '../../app/navigation';
import { colors, fonts, radius, type } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;
type ProductPage = Awaited<ReturnType<typeof getProducts>>;

type ActionProps = { icon: LucideIcon; label: string; a11yLabel?: string; active?: boolean; onPress: () => void };

function Action({ icon: Icon, label, a11yLabel, active, onPress }: ActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={active === undefined ? undefined : { selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <Icon size={18} color={active ? colors.primary : colors.text} fill={active ? colors.primary : 'transparent'} />
      <Text style={[styles.actionText, active && styles.actionTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Detail({ id }: { id: number }) {
  const navigation = useNavigation();
  const state = useShop();
  const [page, setPage] = useState<ProductPage | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setPage)
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const product = page?.data.find((p) => p.id === id);
  const close = () => navigation.goBack();
  const goToCart = () => navigation.navigate('Cart');

  if (!page || !product) {
    return (
      <ExpandableSheet title="Product" onClose={close}>
        {page && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <ShoppingBag size={30} color={colors.primary} />
            </View>
            <Text accessibilityRole="header" style={styles.emptyTitle}>
              Product not found
            </Text>
            <Text style={styles.emptyText}>It may have sold out or moved. Take a look at what’s in store instead.</Text>
            <Button label="Browse gifts" color={colors.primary} onPress={() => navigation.navigate('Products')} style={styles.center} />
          </View>
        )}
      </ExpandableSheet>
    );
  }

  const category = page.categories.find((c) => c.id === product.categoryId)?.name;
  const occasions = page.occasions.filter((o) => product.occasionIds.includes(o.id));
  const related = page.data.filter((p) => p.categoryId === product.categoryId && p.id !== product.id);
  const tags = [category, product.gender === 'All' ? 'For everyone' : `For ${product.gender}`, ...occasions.map((o) => o.name)].filter(Boolean) as string[];
  const wishlisted = state.wishlist.some((w) => w.id === product.id);
  const address = selectedAddress(state);
  const share = () => Share.share({ message: `${product.name} (${product.price}) on PresentBox` }).catch(() => {});

  const footer = (
    <View style={styles.footerRow}>
      <Button
        label={added ? 'Go to cart' : 'Add to cart'}
        icon={ShoppingCart}
        color={colors.primary}
        onPress={() => {
          if (added) return goToCart();
          shop.addToCart(product, qty);
          setAdded(true);
        }}
        style={styles.flex}
        pillStyle={styles.footerPill}
      />
      <Button
        label="Buy now"
        color={colors.text}
        onPress={() => {
          if (!added) shop.addToCart(product, qty);
          goToCart();
        }}
        style={styles.flex}
        pillStyle={styles.footerPill}
      />
    </View>
  );

  return (
    <ExpandableSheet title={product.name} onClose={close} footer={footer} headerRight={<ShopActions color={colors.text} />}>
      <Image source={{ uri: product.img }} accessibilityLabel={product.name} style={styles.image} resizeMode="cover" />

      <View style={styles.actions}>
        <Action
          icon={Heart}
          label={wishlisted ? 'Wishlisted' : 'Wishlist'}
          a11yLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          active={wishlisted} onPress={() => shop.toggleWishlist(product)} />
        <Action icon={Share2} label="Share" onPress={share} />
      </View>

      <View style={styles.info}>
        <Text accessibilityRole="header" style={styles.name}>
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{product.Raiting}</Text>
            <Star size={11} color={colors.white} fill={colors.white} />
          </View>
          {!!product.type && <Text style={styles.badge}>{product.type}</Text>}
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.tax}>incl. of all taxes</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {tags.map((t) => (
          <Text key={t} style={styles.chip}>
            {t}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.info}>
        {!!product.description && <Text style={styles.description}>{product.description}</Text>}
        {!!product.highlights?.length && (
          <View style={styles.highlights}>
            {product.highlights.map((h) => (
              <View key={h} style={styles.highlight}>
                <Check size={16} color={colors.primary} />
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.delivery}>
          <MapPin size={18} color={colors.primary} />
          <View style={styles.flex}>
            <Text style={styles.deliveryTitle} numberOfLines={1}>
              {address ? `Deliver to ${address.name} · ${address.city} ${address.pincode}` : 'Add a delivery address'}
            </Text>
            <Text style={styles.deliveryText}>Free delivery on orders above INR 999.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => setAddressOpen(true)} hitSlop={8}>
            <Text style={styles.link}>{address ? 'Change' : 'Add'}</Text>
          </Pressable>
        </View>

        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Quantity</Text>
          <Stepper value={qty} onChange={setQty} label={product.name} min={1} />
        </View>
      </View>

      {related.length > 0 && (
        <View style={styles.related}>
          <Text accessibilityRole="header" style={styles.relatedTitle}>
            You may also like
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedRow}>
            {related.map((p) => (
              <View key={p.id} style={styles.relatedCard}>
                <ProductCard
                  rating={p.Raiting}
                  name={p.name}
                  price={p.price}
                  img={p.img}
                  type={p.type}
                  wishlisted={state.wishlist.some((w) => w.id === p.id)}
                  onToggleWishlist={() => shop.toggleWishlist(p)}
                  onPress={() => navigation.setParams({ id: p.id })}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <AddressModal open={addressOpen} onClose={() => setAddressOpen(false)} />
    </ExpandableSheet>
  );
}

// Drawn as a sheet over the page underneath (transparentModal route).
// key = product id: opening a related product starts a fresh sheet with quantity 1.
function ProductDetail({ route }: Props) {
  return <Detail key={route.params.id} id={route.params.id} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.6 },
  center: { alignSelf: 'center', marginTop: 12 },
  image: { width: '100%', aspectRatio: 4 / 5, backgroundColor: colors.surface },

  actions: { flexDirection: 'row', gap: 8, padding: 12 },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: radius.sm, backgroundColor: colors.surface },
  actionText: { ...type.subhead, fontFamily: fonts.medium, color: colors.text },
  actionTextActive: { color: colors.primary },

  info: { paddingHorizontal: 16, gap: 6 },
  name: { ...type.title3, color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: colors.success },
  ratingText: { ...type.caption, fontFamily: fonts.bold, color: colors.white },
  badge: { ...type.caption, fontFamily: fonts.semiBold, color: colors.primary },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 },
  price: { ...type.title2, color: colors.text },
  tax: { ...type.footnote, color: colors.textSubtle },

  chips: { gap: 8, paddingHorizontal: 16, paddingVertical: 14 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...type.footnote,
    fontFamily: fonts.medium,
    color: colors.text,
    overflow: 'hidden',
  },

  description: { ...type.body, color: colors.text },
  highlights: { gap: 8, marginTop: 8 },
  highlight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  highlightText: { ...type.subhead, color: colors.text, flex: 1 },
  delivery: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface },
  deliveryTitle: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.text },
  deliveryText: { ...type.footnote, color: colors.textMuted },
  link: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.primary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  qtyLabel: { ...type.headline, color: colors.text },

  related: { gap: 12, marginTop: 28, paddingBottom: 24 },
  relatedTitle: { ...type.title3, color: colors.text, paddingHorizontal: 16 },
  relatedRow: { gap: 12, paddingHorizontal: 16 },
  relatedCard: { width: 150 },

  footerRow: { flexDirection: 'row', gap: 12 },
  footerPill: { flex: 1, justifyContent: 'center', minHeight: 50, borderRadius: radius.md },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 64, paddingHorizontal: 24 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint, marginBottom: 8 },
  emptyTitle: { ...type.title3, color: colors.text },
  emptyText: { ...type.subhead, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },
});

export default ProductDetail;
