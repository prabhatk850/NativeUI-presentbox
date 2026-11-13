import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heart } from '../../../theme/icons';
import ExpandableSheet from '../../molecules/ExpandableSheet/ExpandableSheet';
import ProductCard from '../../molecules/ProductCard/ProductCard';
import { CategoryBubbles } from '../ProductHeader/ProductHeader';
import Button from '../../atoms/Button/Button';
import { getProducts } from '../../../cms';
import { ALL_PRODUCTS, groupByCategory, type Category } from '../../../utils';
import { shop, useShop } from '../../../store';
import { colors, type } from '../../../theme';

// Wishlist in the expandable sheet (card → full screen on scroll): category pills on top, a 2-column grid of
// saved gifts below. Tap a gift to open it, the heart to drop it, or move it straight to the cart.
function WishlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wishlist } = useShop();
  const navigation = useNavigation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState(ALL_PRODUCTS);
  const title = `Wishlist${wishlist.length ? ` (${wishlist.length})` : ''}`;

  useEffect(() => {
    if (!open || categories.length) return;
    getProducts()
      .then((res) => setCategories(res.categories))
      .catch((error) => console.error('Error fetching categories:', error));
  }, [open, categories.length]);

  // only categories that have saved gifts get a pill; if the picked one empties, fall back to All
  const groups = groupByCategory(wishlist, categories);
  const tabs = Object.keys(groups).filter((name) => groups[name].length > 0);
  const current = tabs.includes(selected) ? selected : ALL_PRODUCTS;
  const items = groups[current] ?? wishlist;

  const close = () => {
    setSelected(ALL_PRODUCTS);
    onClose();
  };
  const go = (then: () => void) => {
    close();
    then();
  };

  return (
    <Modal transparent statusBarTranslucent visible={open} animationType="none" onRequestClose={close}>
      <ExpandableSheet title={title} onClose={close}>
        <View style={styles.content}>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {wishlist.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Heart size={28} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Nothing saved yet</Text>
              <Text style={styles.emptyText}>Tap the heart on any gift to keep it here for later.</Text>
              <Button label="Browse gifts" color={colors.primary} onPress={() => go(() => navigation.navigate('Products'))} style={styles.emptyBtn} />
            </View>
          ) : (
            <>
              {tabs.length > 2 && <CategoryBubbles categories={tabs} selected={current} onSelect={setSelected} />}
              <View style={styles.grid}>
                {items.map((p) => (
                  <View key={p.id} style={styles.cell}>
                    <ProductCard
                      rating={p.Raiting}
                      name={p.name}
                      price={p.price}
                      img={p.img}
                      type={p.type}
                      wishlisted
                      onToggleWishlist={() => shop.toggleWishlist(p)}
                      cartVerb="Move"
                      onAddToCart={() => {
                        shop.addToCart(p);
                        shop.toggleWishlist(p);
                      }}
                      onPress={() => go(() => navigation.navigate('ProductDetail', { id: p.id }))}
                    />
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ExpandableSheet>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  title: { ...type.title2, color: colors.text, paddingRight: 44 },
  // percentage cells + half-gap padding, like ProductGrid
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 20, marginHorizontal: -6 },
  cell: { width: '50%', paddingHorizontal: 6 },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint, marginBottom: 8 },
  emptyTitle: { ...type.headline, color: colors.text },
  emptyText: { ...type.subhead, color: colors.textMuted, textAlign: 'center', maxWidth: 280 },
  emptyBtn: { alignSelf: 'center', marginTop: 12 },
});

export default WishlistModal;
