import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getProducts } from '../../cms';
import { breakpoints, colors, fonts, radius, type } from '../../theme';

type Catalog = Awaited<ReturnType<typeof getProducts>>;

// "Shop by occasion": one photo tile per occasion. A tile opens the products page on that occasion's chip.
function Occasions() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const columns = width >= breakpoints.mobile ? 4 : width >= breakpoints.tablet ? 3 : 2;
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    getProducts()
      .then(setCatalog)
      .catch((error) => console.error('Error fetching occasions:', error));
  }, []);

  const tiles = (catalog?.occasions ?? []).map((o) => {
    const gifts = catalog!.data.filter((p) => p.occasionIds.includes(o.id));
    // cover photo: the occasion's best-rated gift
    const cover = [...gifts].sort((a, b) => b.Raiting - a.Raiting)[0];
    return { ...o, count: gifts.length, img: cover?.img };
  });

  return (
    <>
      <Text accessibilityRole="header" style={styles.title}>
        Shop by occasion
      </Text>
      <Text style={styles.subtitle}>Find the right gift for the moment, from birthdays to just-because days.</Text>

      <View style={styles.grid}>
        {tiles.map((t) => (
          <View key={t.id} style={[styles.cell, { width: `${100 / columns}%` }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${t.name}, ${t.count} gifts`}
              onPress={() => navigation.navigate('Products', { category: t.name })}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              {!!t.img && <Image source={{ uri: t.img }} style={StyleSheet.absoluteFill} resizeMode="cover" />}
              <View style={styles.scrim} />
              <View style={styles.label}>
                <Text style={styles.name}>{t.name}</Text>
                <Text style={styles.count}>{t.count} gifts</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8 },
  title: { ...type.largeTitle, color: colors.text },
  subtitle: { ...type.subhead, color: colors.textMuted, marginTop: 4, marginBottom: 20 },
  // percentage cells + half-gap padding, like ProductGrid
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 16, marginHorizontal: -8 },
  cell: { paddingHorizontal: 8 },
  tile: { aspectRatio: 4 / 5, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.surface },
  scrim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.32)' },
  label: { padding: 14, gap: 2 },
  name: { ...type.title3, fontFamily: fonts.bold, color: colors.white },
  count: { ...type.footnote, fontFamily: fonts.medium, color: 'rgba(255, 255, 255, 0.85)' },
});

export default Occasions;
