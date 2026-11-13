import React from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Quote } from '../../../theme/icons';
import { breakpoints, colors, fonts, radius, type } from '../../../theme';

export type Review = { name: string; rating: number; avatar: string; title: string; message: string };

const ReviewCard = ({ data }: { data: Review }) => {
  const { name, rating, avatar, title, message } = data;
  const m = useWindowDimensions().width < breakpoints.mobile;

  return (
    <View style={[styles.card, m && styles.cardM]}>
      <View style={[styles.left, m && styles.leftM]}>
        <View style={[styles.circle, m && styles.circleM]}>
          <Image source={{ uri: avatar }} accessibilityLabel={name} style={[styles.avatar, m && styles.avatarM]} />
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.stars}>{'★'.repeat(rating)}</Text>
        </View>
      </View>
      <View style={[styles.right, m && styles.rightM]}>
        <View style={[styles.square, m && styles.squareM]}>
          <Quote size={m ? 22 : 40} color={colors.textSubtle} />
          <View>
            <Text style={[styles.title, m && styles.titleM]}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, flexDirection: 'row', height: 400 },
  cardM: { flexDirection: 'column', height: undefined },
  left: { justifyContent: 'space-between', padding: 24 },
  leftM: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 12, padding: 16, paddingBottom: 0 },
  right: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 28, margin: 24, paddingHorizontal: 15 },
  rightM: { margin: 12, paddingHorizontal: 0, borderRadius: radius.md },
  circle: { backgroundColor: colors.white, width: 120, height: 120, borderRadius: 60 },
  circleM: { width: 48, height: 48, borderRadius: 24 },
  avatar: { width: 94, height: 94, margin: 13, borderRadius: 47 },
  avatarM: { width: 40, height: 40, margin: 4, borderRadius: 20 },
  name: { ...type.subhead, fontFamily: fonts.semiBold, color: colors.text },
  stars: { color: colors.star, fontSize: 13, letterSpacing: 1 },
  square: { flex: 1, backgroundColor: colors.surface, gap: 40, height: 327, padding: 15, borderRadius: 18 },
  squareM: { height: undefined, gap: 8, padding: 16, backgroundColor: colors.white },
  title: { ...type.title3, marginBottom: 8, color: colors.text },
  titleM: { ...type.headline, marginBottom: 4 },
  message: { ...type.subhead, lineHeight: 21, color: colors.textMuted },
});

export default ReviewCard;
