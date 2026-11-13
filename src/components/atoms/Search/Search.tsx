import React, { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Search as SearchIcon } from '../../../theme/icons';
import { colors, radius, type } from '../../../theme';

type Props = TextInputProps & { fullWidth?: boolean; trailing?: React.ReactNode }; // trailing: e.g. a clear button inside the field

// iOS-style search field: grey fill, no border, soft red ring while focused
function Search({ placeholder = 'Search...', fullWidth = false, trailing, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, fullWidth && styles.full, focused && styles.focused]}>
      <SearchIcon size={17} color={focused ? colors.primary : colors.textSubtle} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        accessibilityLabel={placeholder}
        inputMode="search"
        returnKeyType="search"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    width: 260,
    paddingHorizontal: 12,
    backgroundColor: colors.fill,
    borderRadius: radius.sm,
  },
  full: { width: '100%' },
  focused: { boxShadow: `0 0 0 3px ${colors.primaryRing}` },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    ...type.body,
    color: colors.text,
    outlineWidth: 0, // no browser focus outline on web; the field shows focus instead
  },
});

export default Search;
