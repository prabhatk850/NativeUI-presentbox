import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Search from '../../atoms/Search/Search';
import { ChevronRight, Clock, Gift, LayoutGrid, SearchX, Sparkles, Star, TrendingUp, X, type LucideIcon } from '../../../theme/icons';
import { getProducts } from '../../../cms';
import { searchCatalog, searchWords, type Product } from '../../../utils';
import { shop, useShop } from '../../../store';
import { breakpoints, colors, fonts, radius, shadows, type } from '../../../theme';

type Catalog = Awaited<ReturnType<typeof getProducts>>;
const MAX_PRODUCTS = 8;
const SUGGESTIONS = ['birthday', 'cake', 'lamp', 'roses'];
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Bolds the parts of `text` that match the typed words.
function Highlight({ text, words, style }: { text: string; words: string[]; style: StyleProp<TextStyle> }) {
  const parts = words.length ? text.split(new RegExp(`(${words.map(escape).join('|')})`, 'gi')) : [text];
  return (
    <Text style={style} numberOfLines={1}>
      {parts.map((part, i) =>
        i % 2 ? (
          <Text key={i} style={styles.mark}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

function Chip({ icon: Icon, label, onPress }: { icon: LucideIcon; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
      <Icon size={14} color={colors.primary} />
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

function Section({ title, icon: Icon, action, children }: { title: string; icon?: LucideIcon; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        {Icon && <Icon size={14} color={colors.textMuted} />}
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          {title}
        </Text>
        {action}
      </View>
      {children}
    </View>
  );
}

// Spotlight-style search: full screen on phones, a floating panel on wider screens.
// Empty: recent searches, category / occasion shortcuts, trending gifts. Typing: live grouped results.
function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigation = useNavigation();
  const { recentSearches } = useShop();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const sheet = width < breakpoints.tablet;
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    if (!open || catalog) return;
    getProducts()
      .then(setCatalog)
      .catch((error) => console.error('Error fetching products:', error));
  }, [open, catalog]);

  const words = searchWords(query);
  const results = catalog ? searchCatalog(catalog, query) : null;
  const categoryName = (p: Product) => catalog?.categories.find((c) => c.id === p.categoryId)?.name;
  const trending = catalog ? [...catalog.data].sort((a, b) => b.Raiting - a.Raiting).slice(0, 8) : [];

  const close = () => {
    setQuery('');
    onClose();
  };
  // every way out of search that came from typed text remembers the query
  const leave = (go: () => void) => {
    shop.addRecentSearch(query);
    close();
    go();
  };
  const openList = (category: string) => leave(() => navigation.navigate('Products', { category }));
  const openProduct = (p: Product) => leave(() => navigation.navigate('ProductDetail', { id: p.id }));
  const seeAll = () => {
    const q = query.trim();
    if (q) leave(() => navigation.navigate('Products', { q }));
  };

  const shortcuts = results ? [...results.categories.map((c) => ({ key: `c${c.id}`, icon: LayoutGrid, name: c.name })), ...results.occasions.map((o) => ({ key: `o${o.id}`, icon: Gift, name: o.name }))] : [];

  return (
    <Modal transparent statusBarTranslucent visible={open} animationType={sheet ? 'slide' : 'fade'} onRequestClose={close}>
      <View style={[styles.backdrop, sheet ? styles.backdropSheet : styles.backdropPanel]}>
        {!sheet && <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close search backdrop" />}
        <View
          accessibilityViewIsModal
          style={sheet ? [styles.sheet, { paddingTop: insets.top + 8 }] : [styles.panel, { maxHeight: height * 0.8 }]}
        >
          <View style={styles.bar}>
            <View style={styles.flex}>
              <Search
                autoFocus
                fullWidth
                placeholder="Search gifts, categories, occasions"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={seeAll}
                trailing={
                  !!query && (
                    <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clear} hitSlop={8}>
                      <X size={12} color={colors.white} strokeWidth={3} />
                    </Pressable>
                  )
                }
              />
            </View>
            <Pressable accessibilityRole="button" onPress={close} hitSlop={8}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={[styles.body, sheet && { paddingBottom: 24 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
          >
            {!catalog ? null : words.length === 0 ? (
              <>
                {recentSearches.length > 0 && (
                  <Section
                    title="Recent"
                    icon={Clock}
                    action={
                      <Pressable accessibilityRole="button" accessibilityLabel="Clear recent searches" onPress={shop.clearRecentSearches} hitSlop={8} style={styles.headAction}>
                        <Text style={styles.link}>Clear</Text>
                      </Pressable>
                    }
                  >
                    {recentSearches.map((r) => (
                      <Pressable key={r} accessibilityRole="button" accessibilityLabel={`Search ${r}`} onPress={() => setQuery(r)} style={({ pressed }) => [styles.recent, pressed && styles.pressed]}>
                        <Clock size={16} color={colors.textSubtle} />
                        <Text style={styles.recentText}>{r}</Text>
                      </Pressable>
                    ))}
                  </Section>
                )}
                <Section title="Shop by category" icon={LayoutGrid}>
                  <View style={styles.chips}>
                    {catalog.categories.map((c) => (
                      <Chip key={c.id} icon={LayoutGrid} label={c.name} onPress={() => openList(c.name)} />
                    ))}
                  </View>
                </Section>
                <Section title="Shop by occasion" icon={Gift}>
                  <View style={styles.chips}>
                    {catalog.occasions.map((o) => (
                      <Chip key={o.id} icon={Gift} label={o.name} onPress={() => openList(o.name)} />
                    ))}
                  </View>
                </Section>
                <Section title="Trending now" icon={TrendingUp}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trending}>
                    {trending.map((p) => (
                      <Pressable
                        key={p.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${p.name}`}
                        onPress={() => openProduct(p)}
                        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                      >
                        <Image source={{ uri: p.img }} style={styles.cardImage} />
                        <Text style={styles.cardName} numberOfLines={2}>
                          {p.name}
                        </Text>
                        <View style={styles.cardMeta}>
                          <Text style={styles.cardPrice}>{p.price}</Text>
                          <Star size={11} color={colors.star} fill={colors.star} />
                          <Text style={styles.cardRating}>{p.Raiting}</Text>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </Section>
              </>
            ) : results && (shortcuts.length > 0 || results.products.length > 0) ? (
              <>
                {shortcuts.length > 0 && (
                  <Section title="Categories & occasions" icon={Sparkles}>
                    <View style={styles.chips}>
                      {shortcuts.map((s) => (
                        <Chip key={s.key} icon={s.icon} label={s.name} onPress={() => openList(s.name)} />
                      ))}
                    </View>
                  </Section>
                )}
                {results.products.length > 0 && (
                  <Section title={`Gifts (${results.products.length})`} icon={Gift}>
                    {results.products.slice(0, MAX_PRODUCTS).map((p) => (
                      <Pressable
                        key={p.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${p.name}`}
                        onPress={() => openProduct(p)}
                        style={({ pressed }) => [styles.result, pressed && styles.pressed]}
                      >
                        <Image source={{ uri: p.img }} style={styles.thumb} />
                        <View style={styles.flex}>
                          <Highlight text={p.name} words={words} style={styles.resultName} />
                          <Text style={styles.resultMeta} numberOfLines={1}>
                            {categoryName(p)} · {p.price}
                          </Text>
                        </View>
                        <ChevronRight size={18} color={colors.textSubtle} />
                      </Pressable>
                    ))}
                    <Pressable accessibilityRole="button" onPress={seeAll} style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}>
                      <Text style={styles.seeAllText}>{`See all ${results.products.length} results for “${query.trim()}”`}</Text>
                      <ChevronRight size={16} color={colors.primary} />
                    </Pressable>
                  </Section>
                )}
              </>
            ) : (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <SearchX size={28} color={colors.primary} />
                </View>
                <Text accessibilityRole="header" style={styles.emptyTitle}>{`No gifts found for “${query.trim()}”`}</Text>
                <Text style={styles.emptyText}>Check the spelling, or try one of these:</Text>
                <View style={[styles.chips, styles.center]}>
                  {SUGGESTIONS.map((s) => (
                    <Chip key={s} icon={Sparkles} label={s} onPress={() => setQuery(s)} />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
  center: { justifyContent: 'center' },
  backdrop: { flex: 1 },
  backdropSheet: { backgroundColor: colors.white },
  backdropPanel: { alignItems: 'center', paddingTop: 72, paddingHorizontal: 20, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  sheet: { flex: 1, backgroundColor: colors.white },
  panel: { width: '100%', maxWidth: 680, paddingTop: 16, borderRadius: 24, backgroundColor: colors.white, boxShadow: shadows.modal, overflow: 'hidden' },

  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
  clear: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textSubtle,
  },
  cancel: { ...type.body, color: colors.primary },
  body: { paddingHorizontal: 16, paddingBottom: 24, gap: 24 },

  section: { gap: 10 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { flex: 1, ...type.footnote, fontFamily: fonts.semiBold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  headAction: { paddingLeft: 8 },
  link: { ...type.subhead, color: colors.primary },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
  },
  chipText: { ...type.subhead, fontFamily: fonts.medium, color: colors.primary },

  recent: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 40 },
  recentText: { ...type.body, color: colors.text },

  trending: { gap: 12, paddingRight: 16 },
  card: { width: 136, gap: 6 },
  cardImage: { width: 136, height: 136, borderRadius: radius.md, backgroundColor: colors.surface },
  cardName: { ...type.footnote, fontFamily: fonts.semiBold, color: colors.text },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardPrice: { ...type.caption, color: colors.textMuted, marginRight: 4 },
  cardRating: { ...type.caption, color: colors.textMuted },

  result: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  thumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.surface },
  resultName: { ...type.headline, fontFamily: fonts.regular, color: colors.text },
  mark: { fontFamily: fonts.bold, color: colors.primary },
  resultMeta: { ...type.footnote, color: colors.textMuted },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
  },
  seeAllText: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.primary },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint, marginBottom: 8 },
  emptyTitle: { ...type.title3, color: colors.text, textAlign: 'center' },
  emptyText: { ...type.subhead, color: colors.textMuted, textAlign: 'center', marginBottom: 8 },
});

export default SearchModal;
