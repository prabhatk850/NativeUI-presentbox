import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from '../../../icons';
import { colors, fonts, type } from '../../../theme';

// Label + input, with an optional show/hide toggle for passwords.
function Field({ label, secure, ...input }: TextInputProps & { label: string; secure?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={secure && !visible}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, secure && styles.inputWithIcon, focused && styles.inputFocused]}
          {...input}
        />
        {secure && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? `Hide ${label}` : `Show ${label}`}
            onPress={() => setVisible((v) => !v)}
            style={styles.eye}
            hitSlop={8}
          >
            {visible ? <EyeOff size={18} color={colors.textSubtle} /> : <Eye size={18} color={colors.textSubtle} />}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 6 },
  label: { ...type.footnote, fontFamily: fonts.medium, color: colors.textMuted },
  inputWrap: { justifyContent: 'center' },
  input: {
    height: 50,
    paddingVertical: 0,
    paddingHorizontal: 16,
    backgroundColor: colors.fill,
    borderRadius: 12,
    ...type.body,
    color: colors.text,
  },
  inputWithIcon: { paddingRight: 48 },
  inputFocused: { boxShadow: `0 0 0 3px ${colors.primaryRing}` },
  eye: { position: 'absolute', right: 10, padding: 8 },
});

export default Field;
