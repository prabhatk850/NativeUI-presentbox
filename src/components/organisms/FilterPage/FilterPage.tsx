import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IndianRupee, X } from '../../../theme/icons';
import ProductCategoryBubble from '../../atoms/ProductCategoryBubble/ProductCategoryBubble';
import Tabs from '../../atoms/Tabs/Tabs';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import { GENDERS, NO_FILTERS, type Filters, type Occasion } from '../../../utils';
import { breakpoints, colors, fonts, radius, shadows, type } from '../../../theme';

const RATINGS = [4.5, 4, 3];
const GENDER_TABS = GENDERS.map((g) => ({ value: g, label: g }));

type Props = {
  sheet?: boolean; // bottom sheet on phones: full width, rounded top, grab handle
  initial?: Filters; // the filters currently applied, so reopening shows them
  occasions?: Occasion[];
  onClose?: () => void;
  onApply?: (filters: Filters) => void;
};

type PriceInputProps = { label: string; placeholder: string; value: string; onChange: (v: string) => void };

function PriceInput({ label, placeholder, value, onChange }: PriceInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputWrap}>
      <IndianRupee size={16} color={colors.textSubtle} style={styles.inputIcon} />
      <TextInput
        value={value}
        onChangeText={(t) => onChange(t.replace(/[^0-9]/g, ''))}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        accessibilityLabel={label}
        keyboardType="number-pad"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.inputFocused]}
      />
    </View>
  );
}

function Section({ title, children, flex }: { title: string; children: React.ReactNode; flex: boolean }) {
  return (
    <View style={[styles.section, flex && styles.sectionTwo]}>
      <Text style={styles.label}>{title}</Text>
      {children}
    </View>
  );
}

function FilterPage({ sheet = false, initial = NO_FILTERS, occasions = [], onClose, onApply }: Props) {
  const [tab, setTab] = useState('basic');
  const [filters, setFilters] = useState<Filters>(initial);
  const twoCols = useWindowDimensions().width >= breakpoints.sm;
  const { bottom } = useSafeAreaInsets();

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((p) => ({ ...p, [key]: value }));
  const toggleOccasion = (id: number) =>
    set('occasionIds', filters.occasionIds.includes(id) ? filters.occasionIds.filter((i) => i !== id) : [...filters.occasionIds, id]);

  const apply = () => {
    onApply?.(filters);
    onClose?.();
  };

  return (
    <View accessibilityLabel="Filters" style={[styles.wrapper, sheet ? [styles.sheet, { paddingBottom: 16 + bottom }] : styles.panel]}>
      {sheet && <View style={styles.grabber} />}
      <View style={styles.titleRow}>
        <View style={styles.flex}>
          <Text accessibilityRole="header" style={styles.title}>
            Filters
          </Text>
          <Text style={styles.subtitle}>Narrow down gifts that fit just right.</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close filters" onPress={onClose} hitSlop={8} style={styles.close}>
          <X size={16} color={colors.textMuted} strokeWidth={2.5} />
        </Pressable>
      </View>

      <Tabs
        variant="segmented"
        tabs={[{ value: 'basic', label: 'Basic Filters' }, { value: 'more', label: 'More Filters' }]}
        value={tab}
        onChange={setTab}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.body, twoCols && styles.bodyTwo]}>
        {tab === 'basic' ? (
          <>
            <Section title="Gender" flex={twoCols}>
              <Tabs variant="segmented" tabs={GENDER_TABS} value={filters.gender} onChange={(g) => set('gender', g)} />
            </Section>
            {occasions.length > 0 && (
              <Section title="Occasion" flex={twoCols}>
                <View style={styles.bubbles}>
                  {occasions.map((o) => (
                    <ProductCategoryBubble key={o.id} category={o.name} isActive={filters.occasionIds.includes(o.id)} onPress={() => toggleOccasion(o.id)} />
                  ))}
                </View>
              </Section>
            )}
            <Section title="Price Range" flex={twoCols}>
              <View style={styles.priceRow}>
                <PriceInput label="Minimum price" placeholder="Min" value={filters.min} onChange={(v) => set('min', v)} />
                <Text style={styles.dash}>–</Text>
                <PriceInput label="Maximum price" placeholder="Max" value={filters.max} onChange={(v) => set('max', v)} />
              </View>
            </Section>
          </>
        ) : (
          <>
            <Section title="Minimum Rating" flex={twoCols}>
              <View style={styles.bubbles}>
                {RATINGS.map((r) => (
                  <ProductCategoryBubble
                    key={r}
                    category={`${r}★ & up`}
                    isActive={filters.minRating === r}
                    onPress={() => set('minRating', filters.minRating === r ? null : r)}
                  />
                ))}
              </View>
            </Section>
            <Section title="Deals" flex={twoCols}>
              <Checkbox label="On sale only" checked={filters.onSale} onChange={(v) => set('onSale', v)} />
            </Section>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable accessibilityRole="button" onPress={() => setFilters(NO_FILTERS)} style={styles.clear} hitSlop={8}>
          <Text style={styles.clearText}>Clear all</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={apply}
          style={({ pressed }) => [styles.apply, sheet && styles.flex, pressed && styles.pressed]}
        >
          <Text style={styles.applyText}>Apply Filters</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', backgroundColor: colors.white, gap: 16 },
  panel: { maxWidth: 720, maxHeight: '90%', borderRadius: radius.lg, padding: 24, boxShadow: shadows.modal },
  sheet: { maxHeight: '88%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingHorizontal: 20, paddingTop: 8 },
  grabber: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: colors.border },
  flex: { flex: 1 },
  pressed: { opacity: 0.7 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { ...type.title2, color: colors.text },
  subtitle: { ...type.subhead, color: colors.textMuted, marginTop: 2 },
  close: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 0 },
  body: { gap: 24, paddingVertical: 8 },
  bodyTwo: { flexDirection: 'row', flexWrap: 'wrap' },
  section: { gap: 12 },
  sectionTwo: { flexGrow: 1, flexBasis: 280 },
  label: { ...type.footnote, fontFamily: fonts.semiBold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  bubbles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dash: { color: colors.textSubtle },
  inputWrap: { flex: 1, justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 12, zIndex: 1 },
  input: {
    height: 44,
    paddingVertical: 0,
    paddingRight: 12,
    paddingLeft: 34,
    backgroundColor: colors.fill,
    borderRadius: radius.sm,
    color: colors.text,
    ...type.body,
  },
  inputFocused: { boxShadow: `0 0 0 3px ${colors.primaryRing}` },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  clear: { paddingVertical: 8 },
  clearText: { ...type.body, color: colors.primary },
  apply: { height: 50, paddingHorizontal: 28, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  applyText: { ...type.headline, color: colors.white },
});

export default FilterPage;
