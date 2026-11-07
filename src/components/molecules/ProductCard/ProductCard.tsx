import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, Heart, ShoppingCart, Star } from '../../../icons';
import { colors, fonts, radius, type } from '../../../theme';

export type ProductLayout = 'list' | 'grid';
type Props = {
  type?: string; // badge such as "New", shown like Apple's orange "New" label
  rating: number;
  name: string;
  price: string;
  img: string;
  layout?: ProductLayout; // list = row with thumbnail, grid = square tile
  onPress?: () => void;
  wishlisted?: boolean;
  onToggleWishlist?: () => void; // shows the heart on the image
  onAddToCart?: () => void; // shows the "Add to cart" button
  cartVerb?: 'Add' | 'Move'; // "Move to cart" in the wishlist
};

function Rating({ value }: { value: number }) {
  return (
    <View style={styles.rating}>
      <Star size={12} color={colors.star} fill={colors.star} />
      <Text style={styles.ratingText}>{value}</Text>
    </View>
  );
}

// The whole card is one tap target, as in native store apps (no separate arrow button).
function ProductCard({ type: badge, rating, name, price, img, layout = 'grid', onPress, wishlisted = false, onToggleWishlist, onAddToCart, cartVerb = 'Add' }: Props) {
  const list = layout === 'list';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${name}`}
      onPress={onPress}
      style={({ pressed }) => [list ? styles.row : styles.tile, pressed && styles.pressed]}
    >
      <View style={list ? styles.thumb : styles.image}>
        <Image source={{ uri: img }} accessibilityLabel={name} style={styles.fill} resizeMode="cover" />
        {onToggleWishlist && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
            accessibilityState={{ selected: wishlisted }}
            onPress={onToggleWishlist}
            style={[styles.heart, list && styles.heartSmall]}
            hitSlop={6}
          >
            <Heart size={list ? 13 : 16} color={wishlisted ? colors.primary : colors.text} fill={wishlisted ? colors.primary : 'transparent'} />
          </Pressable>
        )}
      </View>
      <View style={list ? styles.rowInfo : styles.tileInfo}>
        {!!badge && <Text style={styles.badge}>{badge}</Text>}
        <Text style={list ? styles.rowName : styles.tileName} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.price}>{price}</Text>
        <Rating value={rating} />
        {onAddToCart && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${cartVerb} ${name} to cart`}
            onPress={onAddToCart}
            style={({ pressed }) => [styles.add, pressed && styles.pressed]}
          >
            <ShoppingCart size={14} color={colors.white} />
            <Text style={styles.addText}>{cartVerb} to cart</Text>
          </Pressable>
        )}
      </View>
      {list && !onAddToCart && <ChevronRight size={18} color={colors.textSubtle} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.6 },
  fill: { width: '100%', height: '100%' },

  // grid tile
  tile: { flex: 1 },
  image: { width: '100%', aspectRatio: 1, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.surface },
  tileInfo: { paddingTop: 10, gap: 2 },
  tileName: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.text },

  // list row
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  thumb: { width: 88, height: 88, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface },
  rowInfo: { flex: 1, gap: 2 },
  rowName: { ...type.headline, color: colors.text },

  badge: { ...type.caption, fontFamily: fonts.semiBold, color: colors.primary },
  price: { ...type.subhead, color: colors.text },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { ...type.footnote, color: colors.textMuted },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  heartSmall: { top: 4, right: 4, width: 26, height: 26, borderRadius: 13 },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  addText: { ...type.caption, fontFamily: fonts.semiBold, color: colors.white },
});

export default ProductCard;
