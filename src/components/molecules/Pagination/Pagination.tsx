import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { ChevronLeft, ChevronRight } from '../../../icons';
import { colors, fonts, radius } from '../../../theme';

type Props = {
  page: number; // 1-based
  totalPages: number;
  onChange?: (page: number) => void;
  style?: StyleProp<ViewStyle>;
};

// First, last and current ±1; a gap of one page shows the page instead of "…". null = ellipsis.
// Caps at 7 slots so it fits a 360px phone with the arrows.
export function pageItems(page: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const show = (p: number) => p === 1 || p === total || Math.abs(p - page) <= 1;
  const items: (number | null)[] = [];
  for (let p = 1; p <= total; p++) {
    if (show(p) || (show(p - 1) && show(p + 1))) items.push(p);
    else if (items[items.length - 1] !== null) items.push(null);
  }
  return items;
}

function Pagination({ page, totalPages, onChange, style }: Props) {
  if (totalPages <= 1) return null;
  const go = (p: number) => p !== page && onChange?.(p);
  const first = page <= 1;
  const last = page >= totalPages;

  return (
    <View accessibilityRole="toolbar" accessibilityLabel="Pagination" style={[styles.row, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Previous page"
        accessibilityState={{ disabled: first }}
        disabled={first}
        onPress={() => go(page - 1)}
        style={[styles.item, first && styles.disabled]}
      >
        <ChevronLeft size={18} color={colors.text} />
      </Pressable>

      {pageItems(page, totalPages).map((p, i) =>
        p === null ? (
          <Text key={`gap-${i}`} style={styles.ellipsis}>…</Text>
        ) : (
          <Pressable
            key={p}
            accessibilityRole="button"
            accessibilityLabel={`Page ${p}`}
            accessibilityState={{ selected: p === page }}
            onPress={() => go(p)}
            style={[styles.item, p === page && styles.active]}
          >
            <Text style={p === page ? styles.activeText : styles.text}>{p}</Text>
          </Pressable>
        ),
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Next page"
        accessibilityState={{ disabled: last }}
        disabled={last}
        onPress={() => go(page + 1)}
        style={[styles.item, last && styles.disabled]}
      >
        <ChevronRight size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  item: { minWidth: 36, height: 36, paddingHorizontal: 8, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.primary },
  disabled: { opacity: 0.3 },
  text: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  activeText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.white },
  ellipsis: { width: 20, textAlign: 'center', fontFamily: fonts.medium, fontSize: 15, color: colors.textMuted },
});

export default Pagination;
