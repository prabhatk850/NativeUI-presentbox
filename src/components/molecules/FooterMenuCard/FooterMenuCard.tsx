import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Link from '../../atoms/Link/Link';
import { fonts } from '../../../theme';
import { withCategory } from '../../../navigation';

// "lable" spelling comes from the API
export type MenuItem = { id: number; lable: string; url: string };

function FooterMenuCard({ heading, items = [], arrow = false }: { heading: string; items?: MenuItem[]; arrow?: boolean }) {
  return (
    <View style={styles.wrapper}>
      <Text accessibilityRole="header" style={styles.heading}>
        {heading}
      </Text>
      <View style={styles.list}>
        {items.map((item) => (
          <Link key={item.id} href={withCategory(item.url, item.lable)} color="#fff" arrow={arrow}>
            {item.lable}
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 20 },
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  list: { gap: 12 },
});

export default FooterMenuCard;
