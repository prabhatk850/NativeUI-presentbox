import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useHeaderCenter } from '../../components/templates/MainLayout/MainLayout';
import ProductHeader, { CategoryBubbles } from '../../components/organisms/ProductHeader/ProductHeader';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import Button from '../../components/atoms/Button/Button';
import type { ProductLayout } from '../../components/molecules/ProductCard/ProductCard';
import type { RootStackParamList } from '../../app/navigation';
import { getProducts } from '../../cms';
import { ALL_PRODUCTS, NO_FILTERS, activeFilterCount, filterProducts, groupByCategory, searchCatalog, type Filters, type Product } from '../../utils';
import { breakpoints, colors, fonts, radius, type } from '../../theme';

// named collections a link can open (footer "Best Sellers"), beside categories and occasions
const COLLECTIONS: Record<string, (p: Product) => boolean> = { 'Best Sellers': (p) => p.type === 'Hot' };
type ProductPage = Awaited<ReturnType<typeof getProducts>>;

// The products page's block (an appSection in Contentful). Reads ?category= and ?q= from the route.
function Product() {
  const route = useRoute<RouteProp<RootStackParamList, 'Products'>>();
  const dynamicCategory = route.params?.category ?? null;
  const q = route.params?.q?.trim() ?? '';
  const navigation = useNavigation();
  const wide = useWindowDimensions().width >= breakpoints.mobile;
  const [selected, setSelected] = useState(dynamicCategory || ALL_PRODUCTS);
  const [layout, setLayout] = useState<ProductLayout>('grid');
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [page, setPage] = useState<ProductPage>({ categories: [], occasions: [], data: [] });

  useEffect(() => {
    getProducts()
      .then(setPage)
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // follow the category (or a new search) whenever we're navigated here again (none = back to All Products)
  useEffect(() => {
    setSelected(dynamicCategory || ALL_PRODUCTS);
  }, [dynamicCategory, q]);

  const groups = useMemo(() => groupByCategory(page.data, page.categories), [page]);
  // a name from navigation that isn't a category (an occasion such as "Birthday", or "Best Sellers") gets its own chip, first so it is visible without scrolling
  const tabs = Object.keys(groups);
  const categories = dynamicCategory ? Array.from(new Set([dynamicCategory, ...tabs])) : tabs;
  const occasion = page.occasions.find((o) => o.name === selected);
  const collection = COLLECTIONS[selected];
  const inTab =
    groups[selected] ??
    (occasion ? page.data.filter((p) => p.occasionIds.includes(occasion.id)) : collection ? page.data.filter(collection) : page.data);
  const searched = q ? searchCatalog({ ...page, data: inTab }, q).products : inTab;
  const products = filterProducts(searched, filters);
  const bubbles = <CategoryBubbles categories={categories} selected={selected} onSelect={setSelected} floating={wide} />;
  useHeaderCenter(wide ? bubbles : undefined);

  return (
    <>
      <ProductHeader
        bubbles={wide ? undefined : bubbles}
        heading=""
        subheading=""
        layout={layout}
        onLayoutChange={setLayout}
        filters={filters}
        occasions={page.occasions}
        onFiltersChange={setFilters}
      />
      {!!q && (
        <View style={styles.searchBanner}>
          <Text style={styles.searchText} numberOfLines={1}>
            {`${products.length} result${products.length === 1 ? '' : 's'} for `}
            <Text style={styles.searchQuery}>{`“${q}”`}</Text>
          </Text>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Products', {})} hitSlop={8}>
            <Text style={styles.searchClear}>Clear search</Text>
          </Pressable>
        </View>
      )}
      {products.length > 0 || page.data.length === 0 ? (
        <ProductGrid products={products} layout={layout} />
      ) : (
        <View style={styles.empty}>
          <Text accessibilityRole="header" style={styles.emptyTitle}>
            {q ? `No gifts match “${q}”` : 'No gifts match these filters'}
          </Text>
          <Text style={styles.emptyText}>
            {q ? 'Try a different word, or search all products.' : 'Try another gender or occasion, or widen the price range.'}
          </Text>
          {activeFilterCount(filters) > 0 && (
            <Button label="Clear filters" color={colors.primary} onPress={() => setFilters(NO_FILTERS)} style={styles.center} />
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: { alignSelf: 'center', marginTop: 12 },
  searchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
  },
  searchText: { flex: 1, ...type.subhead, color: colors.text },
  searchQuery: { fontFamily: fonts.semiBold, color: colors.primary },
  searchClear: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.primary },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 48 },
  emptyTitle: { ...type.title3, color: colors.text },
  emptyText: { ...type.subhead, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },
});

export default Product;
