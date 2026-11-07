import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ProductCategoryBubble from '../../atoms/ProductCategoryBubble/ProductCategoryBubble';
import Tabs from '../../atoms/Tabs/Tabs';
import Dropdown from '../../molecules/Dropdown/Dropdown';
import PageHeading from '../../molecules/PageHeading/PageHeading';
import type { ProductLayout } from '../../molecules/ProductCard/ProductCard';
import Filter from '../Filter/Filter';
import type { Filters, Occasion } from '../../../helper';
import { LayoutGrid, List } from '../../../icons';
import { colors, layout as spacing, shadows } from '../../../theme';

const SORT_OPTIONS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Customer Reviews'];
const LAYOUT_TABS = [
  { value: 'list', label: 'List view', icon: List },
  { value: 'grid', label: 'Grid view', icon: LayoutGrid },
];

type BubblesProps = {
  categories: string[];
  selected: string;
  onSelect: (c: string) => void;
  floating?: boolean; // white floating pill (desktop header centre); otherwise a plain edge-to-edge row
};

// Category chips; scroll sideways when they don't fit.
export function CategoryBubbles({ categories, selected, onSelect, floating = false }: BubblesProps) {
  return (
    <View style={floating ? styles.floating : styles.bleed}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.noGrow}
        contentContainerStyle={[styles.bubbles, floating ? styles.floatingPad : styles.bleedPad]}
      >
        {categories.map((c) => (
          <ProductCategoryBubble key={c} category={c} isActive={selected === c} onPress={() => onSelect(c)} />
        ))}
      </ScrollView>
    </View>
  );
}

type Props = {
  heading?: string;
  subheading?: string;
  bubbles?: React.ReactNode; // inline chips (phones); on desktop they live in the header
  layout?: ProductLayout;
  onLayoutChange?: (layout: ProductLayout) => void;
  filters?: Filters;
  occasions?: Occasion[];
  onFiltersChange?: (filters: Filters) => void;
};

function ProductHeader({ heading, subheading, bubbles, layout = 'grid', onLayoutChange, filters, occasions, onFiltersChange }: Props) {
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const controls = (
    <View style={styles.controls}>
      <Dropdown label="Sort" options={SORT_OPTIONS} value={sort} onChange={setSort} />
      <Filter value={filters} occasions={occasions} onApply={onFiltersChange} />
      <Tabs
        variant="segmented"
        style={styles.toggle}
        tabs={LAYOUT_TABS}
        value={layout}
        onChange={(v) => onLayoutChange?.(v as ProductLayout)}
      />
    </View>
  );

  return (
    <View style={styles.root}>
      {!!heading && <PageHeading heading={heading} subheading={subheading} />}
      {bubbles}
      {controls}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 16, marginBottom: 20 },
  noGrow: { flexGrow: 0 },
  bubbles: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  // chips run to the screen edges on phones, like native filter bars
  bleed: { marginHorizontal: -spacing.mobileGutter },
  bleedPad: { paddingHorizontal: spacing.mobileGutter },
  floating: {
    alignSelf: 'center',
    maxWidth: '100%',
    backgroundColor: colors.bar,
    borderRadius: 30,
    boxShadow: shadows.float,
    overflow: 'hidden',
  },
  floatingPad: { paddingVertical: 10, paddingHorizontal: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggle: { marginLeft: 'auto', width: 92 },
});

export default ProductHeader;
