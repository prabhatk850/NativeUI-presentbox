import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductCard, { type ProductLayout } from '../../molecules/ProductCard/ProductCard';
import type { Product } from '../../../helper';
import { shop, useShop } from '../../../store';
import { breakpoints, colors } from '../../../theme';

// grid: 2 columns on phones, 3 on tablets, 4 on desktop. list: 1 column (2 from tablet up).
function columnsFor(layout: ProductLayout, width: number) {
  if (layout === 'list') return width >= breakpoints.tablet ? 2 : 1;
  if (width >= breakpoints.mobile) return 4;
  return width >= breakpoints.tablet ? 3 : 2;
}

// Percentage columns + half-gap padding (negative outer margin) = CSS grid gap without measuring.
function ProductGrid({ products, layout = 'grid' }: { products: Product[]; layout?: ProductLayout }) {
  const { width } = useWindowDimensions();
  const { wishlist } = useShop();
  const navigation = useNavigation();
  const columns = columnsFor(layout, width);
  const list = layout === 'list';
  const gap = list ? 24 : width >= breakpoints.mobile ? 32 : 16;

  return (
    <View style={[styles.grid, !list && styles.gridRows, { marginHorizontal: -gap / 2 }]}>
      {products.map((p) => (
        <View key={p.id} style={{ width: `${100 / columns}%`, paddingHorizontal: gap / 2 }}>
          <View style={list && styles.separated}>
            <ProductCard
              layout={layout}
              type={p.type}
              rating={p.Raiting}
              name={p.name}
              price={p.price}
              img={p.img}
              onPress={() => navigation.navigate('ProductDetail', { id: p.id })}
              wishlisted={wishlist.some((w) => w.id === p.id)}
              onToggleWishlist={() => shop.toggleWishlist(p)}
              onAddToCart={() => shop.addToCart(p)}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridRows: { rowGap: 28 },
  // hairline under each list row, like an iOS table
  separated: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.separator },
});

export default ProductGrid;
