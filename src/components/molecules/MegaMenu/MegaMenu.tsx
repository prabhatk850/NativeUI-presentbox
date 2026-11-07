import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Line from '../../atoms/Line/Line';
import Link from '../../atoms/Link/Link';
import { getImageUrl } from '../../../api';
import { colors, fonts } from '../../../theme';
import { withCategory } from '../../../navigation';
import type { MenuItem } from '../FooterMenuCard/FooterMenuCard';

type LinkGroup = { id: number; navlinks?: MenuItem[]; items?: MenuItem[] };
type Links = LinkGroup[] | MenuItem[] | MenuItem[][];
type Img = string | { url?: string } | null;
type Props = { heading?: string; subheading?: string; links?: Links; img?: Img | Img[]; grid?: string };

function chunkArray<T>(arr: T[], n: number): T[][] {
  const result: T[][] = Array.from({ length: n }, () => []);
  arr.forEach((item, i) => result[i % n].push(item));
  return result;
}

// flatten the API shapes into one list of links (single-column menus)
export function flattenLinksForMenu(links?: Links): MenuItem[] {
  if (!Array.isArray(links) || links.length === 0) return [];
  const first = links[0] as LinkGroup;
  if (Array.isArray(first?.navlinks)) return (links as LinkGroup[]).flatMap((g) => g.navlinks ?? []);
  if (Array.isArray(first?.items)) return (links as LinkGroup[]).flatMap((g) => g.items ?? []);
  return links as MenuItem[];
}

// normalize the API shapes into three columns
export function normalizeGroupsForThreeColumns(links?: Links): MenuItem[][] {
  if (!Array.isArray(links) || links.length === 0) return [[], [], []];
  const first = links[0] as LinkGroup | MenuItem[];
  if (Array.isArray((first as LinkGroup).navlinks)) return (links as LinkGroup[]).map((g) => g.navlinks ?? []);
  if (Array.isArray((first as LinkGroup).items)) return (links as LinkGroup[]).map((g) => g.items ?? []);
  if (Array.isArray(first)) {
    const cols = links as MenuItem[][];
    return [cols[0] ?? [], cols[1] ?? [], cols[2] ?? []];
  }
  return chunkArray(links as MenuItem[], 3);
}

const LinkList = ({ items, style }: { items: MenuItem[]; style?: object }) => (
  <View style={[styles.links, style]}>
    {items.map(({ id, lable, url }) => (
      <Link key={id} href={withCategory(url, lable)} color={colors.white} arrow style={styles.linkText}>
        {lable}
      </Link>
    ))}
  </View>
);

// Desktop header mega menu. grid picks the layout:
// heading_menu_item_image = text | links | image, heading_image_image = text | image,
// menu_item_menu_item_menu_item = three link columns.
function MegaMenu({ heading, subheading, links, img, grid }: Props) {
  const template = grid ?? 'heading_image_image';
  const imageUri = getImageUrl(img == null ? null : [img].flat()[0]);
  const withText = template === 'heading_image_image' || template === 'heading_menu_item_image';

  return (
    <View style={styles.root}>
      <Line />
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.grid}>
        {withText && (
          <View style={template === 'heading_image_image' ? styles.wide : styles.narrow}>
            {!!subheading && <Text style={styles.subheading}>{subheading}</Text>}
          </View>
        )}

        {template === 'heading_menu_item_image' && (
          <LinkList items={flattenLinksForMenu(links)} style={styles.narrow} />
        )}

        {template === 'menu_item_menu_item_menu_item' &&
          normalizeGroupsForThreeColumns(links).map((col, i) => (
            <LinkList key={i} items={col} style={styles.column} />
          ))}

        {withText && (
          <View style={styles.imageWrap}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} accessibilityLabel={heading || 'img'} style={styles.image} />
            ) : (
              <View style={styles.placeholder} />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.4,
    color: colors.white,
    marginBottom: 16,
  },
  grid: { flexDirection: 'row', gap: 50, marginTop: 10, alignItems: 'flex-start' },
  subheading: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 28, maxWidth: 420, color: colors.white },
  wide: { width: '35%' },
  narrow: { width: '25%' },
  links: { gap: 18 },
  column: { flex: 1, paddingTop: 16 },
  linkText: { textDecorationLine: 'underline', lineHeight: 24 },
  imageWrap: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  image: { width: '100%', height: 250, borderRadius: 16 },
  placeholder: { height: 320, backgroundColor: 'rgba(255,255,255,0.03)' },
});

export default MegaMenu;
