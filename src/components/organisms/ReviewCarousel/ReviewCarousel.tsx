import React, { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { ChevronLeft, ChevronRight } from '../../../icons';
import ReviewCard, { type Review } from '../../molecules/ReviewCard/ReviewCard';
import { breakpoints, colors, type } from '../../../theme';

const REVIEWS: Review[] = [
  {
    name: 'Alice Johnson',
    rating: 5,
    title: 'Fantastic Service!',
    message:
      'I had an amazing experience shopping here. The products are top-notch and the customer service is outstanding!',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    name: 'Bob Smith',
    rating: 4,
    title: 'Great Quality',
    message:
      'The quality of the items I purchased exceeded my expectations. Will definitely shop here again.',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    name: 'Catherine Lee',
    rating: 5,
    title: 'Highly Recommend',
    message:
      'Fast shipping and excellent customer support. I highly recommend this store to all my friends and family.',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    name: 'David Brown',
    rating: 4,
    title: 'Very Satisfied',
    message:
      "Overall, I'm very satisfied with my purchase. The website was easy to navigate and the checkout process was smooth.",
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
];

const GAP_WIDE = 24;
const GAP_NARROW = 12;
const EDGE = 5; // px tolerance before an arrow counts as enabled

function ReviewCarousel({ reviews = REVIEWS }: { reviews?: Review[] }) {
  const listRef = useRef<FlatList<Review>>(null);
  const offset = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const { width } = useWindowDimensions();
  const narrow = width < breakpoints.sm; // phones swipe; arrows only on larger screens
  const GAP = narrow ? GAP_NARROW : GAP_WIDE;

  // same card widths as the web CSS: 3 per row (min 730px card), 2 on tablets, 85% on phones
  const itemWidth = narrow
    ? trackWidth * 0.85
    : width < breakpoints.mobile
    ? (trackWidth - GAP) / 2
    : Math.max((trackWidth - 2 * GAP) / 3, 730);
  const step = itemWidth + GAP;

  const onScroll = ({
    nativeEvent: e,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    offset.current = e.contentOffset.x;
    const max = e.contentSize.width - e.layoutMeasurement.width;
    setCanPrev(offset.current > EDGE);
    setCanNext(offset.current < max - EDGE);
  };

  const scrollByCard = (direction: 1 | -1) =>
    listRef.current?.scrollToOffset({
      offset: Math.max(0, offset.current + step * direction),
      animated: true,
    });

  return (
    <View>
      <View style={[styles.header, narrow && styles.headerNarrow]}>
        <View style={styles.flex}>
          <Text
            accessibilityRole="header"
            style={[styles.heading, narrow && styles.headingNarrow]}
          >
            What customers are saying
          </Text>
          <Text style={styles.sub}>
            Experience the convenience and satisfaction shared by our community
            of shoppers.
          </Text>
        </View>
        {!narrow && (
          <View style={styles.controls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous review"
              accessibilityState={{ disabled: !canPrev }}
              disabled={!canPrev}
              onPress={() => scrollByCard(-1)}
              style={[styles.btn, !canPrev && styles.disabled]}
            >
              <ChevronLeft size={20} color={colors.text} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next review"
              accessibilityState={{ disabled: !canNext }}
              disabled={!canNext}
              onPress={() => scrollByCard(1)}
              style={[
                styles.btn,
                styles.btnActive,
                !canNext && styles.disabled,
              ]}
            >
              <ChevronRight size={20} color={colors.white} />
            </Pressable>
          </View>
        )}
      </View>

      <View
        testID="review-track"
        onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
      >
        {trackWidth > 0 && (
          <FlatList
            ref={listRef}
            data={reviews}
            horizontal
            keyExtractor={r => r.name}
            renderItem={({ item }) => (
              <View style={{ width: itemWidth }}>
                <ReviewCard data={item} />
              </View>
            )}
            contentContainerStyle={{ gap: GAP }}
            showsHorizontalScrollIndicator={false}
            snapToInterval={step}
            decelerationRate="fast"
            onScroll={onScroll}
            scrollEventThrottle={32}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 16,
  },
  headerNarrow: {},
  heading: { ...type.title1, color: colors.text },
  headingNarrow: { ...type.title2 },
  sub: { marginTop: 4, ...type.subhead, color: colors.textMuted },
  controls: { flexDirection: 'row', gap: 8 },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.fill,
  },
  btnActive: { backgroundColor: colors.primary },
  disabled: { opacity: 0.4 },
});

export default ReviewCarousel;
