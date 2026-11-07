import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Link from '../../atoms/Link/Link';
import { fonts } from '../../../theme';

type Crumb = { label: string; to?: string };

// The last item is the current page and is never a link.
function Breadcrumb({ items = [], color = '#000' }: { items?: Crumb[]; color?: string }) {
  if (items.length === 0) return null;
  return (
    <View accessibilityLabel="Breadcrumb" style={styles.list}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <View key={item.label} style={styles.item}>
            {last || !item.to ? (
              <Text style={[styles.text, { color }]}>{item.label}</Text>
            ) : (
              <Link to={item.to} color={color} style={styles.text}>
                {item.label}
              </Link>
            )}
            {!last && <Text style={[styles.text, styles.separator, { color }]}>/</Text>}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  item: { flexDirection: 'row', gap: 8 },
  text: { fontFamily: fonts.semiBold, fontSize: 16 },
  separator: { opacity: 0.5, fontFamily: fonts.regular },
});

export default Breadcrumb;
