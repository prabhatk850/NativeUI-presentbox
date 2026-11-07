import React from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowUpRight } from '../../../icons';
import Button from '../../atoms/Button/Button';
import { getImageUrl } from '../../../api';
import { breakpoints, colors, radius, type } from '../../../theme';

export type CategoryButton = { name?: string; color?: string; textColor?: string };
type Props = {
  variant?: 'big' | 'reactangle' | 'square' | string; // "reactangle" spelling comes from the API
  title: string;
  description?: string;
  image?: string | { url?: string } | null;
  button?: CategoryButton; // omit to hide, omit name for arrow-only
  style?: StyleProp<ViewStyle>;
};

function CategoryCard({ variant, title, description, image, button, style }: Props) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const narrow = width < breakpoints.sm;
  const rect = variant === 'reactangle' && !narrow;
  const uri = getImageUrl(image);

  const cta = button && (
    <Button
      onPress={() => navigation.navigate('Products', { category: title })}
      color={button.color}
      textColor={button.textColor}
      label={button.name}
      extendedIcon={ArrowUpRight}
      accessibilityLabel={button.name ? undefined : `Explore ${title}`}
    />
  );

  return (
    <View style={[styles.card, rect && styles.rect, style]}>
      <View style={rect ? styles.rectImage : styles.fullImage}>
        {uri && (
          <Image
            source={{ uri }}
            accessibilityLabel={title}
            style={[styles.image, variant === 'big' && (narrow ? styles.imageBigNarrow : styles.imageBig)]}
          />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {button && !button.name ? (
          <View style={styles.descriptionRow}>
            {description && <Text style={[styles.description, styles.flex]}>{description}</Text>}
            {cta}
          </View>
        ) : (
          <>
            {description && <Text style={styles.description}>{description}</Text>}
            {cta}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 16 },
  rect: { flexDirection: 'row-reverse', alignItems: 'center' },
  fullImage: { width: '100%' },
  rectImage: { width: 310, flexShrink: 0 },
  image: { width: '100%', height: 180, borderRadius: radius.md },
  imageBig: { height: 400 },
  imageBigNarrow: { height: 260 },
  content: { gap: 10, flex: 1 },
  title: { ...type.title2, color: colors.text },
  descriptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  description: { ...type.subhead, color: colors.textMuted },
  flex: { flex: 1 },
});

export default CategoryCard;
