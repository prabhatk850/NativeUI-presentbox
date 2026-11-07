import React from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';

type Props = { marginTop?: number; marginBottom?: number; width?: DimensionValue };

// thin divider for dark surfaces
function Line({ marginTop = 12, marginBottom = 16, width = '100%' }: Props) {
  return (
    <View
      testID="line"
      style={[styles.line, { width, marginTop, marginBottom }]}
    />
  );
}

const styles = StyleSheet.create({
  line: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
});

export default Line;
