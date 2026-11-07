import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import CategoryCard, { type CategoryButton } from '../../molecules/CategoryCard/CategoryCard';
import { getCategoryCards } from '../../../api';
import { breakpoints } from '../../../theme';

type Card = {
  id: number;
  variant: string;
  title: string;
  description?: string;
  img?: { url?: string } | null;
  button?: CategoryButton;
};

const GAP = 16;

// Replaces the web CSS grid:
// desktop  = big cards in a left column (3fr), the rest on the right (4fr): rectangles full row, squares in pairs
// tablet   = big + rectangle full width, squares in pairs
// phone    = one column
function CategoryCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    getCategoryCards()
      .then(({ data }) => setCards(data))
      .catch((error) => console.error('Error fetching category cards:', error));
  }, []);

  const render = (c: Card, style?: object) => (
    <CategoryCard
      key={c.id}
      variant={c.variant}
      title={c.title}
      description={c.description}
      image={c.img}
      button={c.button}
      style={style}
    />
  );
  const sized = (c: Card) => render(c, c.variant === 'square' && width >= breakpoints.sm ? styles.half : styles.full);

  if (width >= breakpoints.mobile) {
    return (
      <View style={styles.row}>
        <View style={styles.left}>{cards.filter((c) => c.variant === 'big').map((c) => render(c, styles.fill))}</View>
        <View style={styles.right}>{cards.filter((c) => c.variant !== 'big').map(sized)}</View>
      </View>
    );
  }
  return <View style={styles.wrap}>{cards.map(sized)}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: GAP },
  left: { flex: 3, gap: GAP },
  right: { flex: 4, flexDirection: 'row', flexWrap: 'wrap', gap: GAP, alignContent: 'flex-start' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  fill: { flex: 1 },
  full: { flexBasis: '100%' },
  half: { flexGrow: 1, flexBasis: '40%' },
});

export default CategoryCards;
