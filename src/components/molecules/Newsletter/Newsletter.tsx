import React, { memo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ArrowRight } from '../../../theme/icons';
import Button from '../../atoms/Button/Button';
import { colors, fonts } from '../../../theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = { heading?: string; placeholder?: string; onSubmit?: (email: string) => void };

// translucent pill for red backgrounds; white ring on focus
function Newsletter({ heading = 'Subscribe to our Newsletter', placeholder = 'Enter your email', onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState<'' | 'error' | 'done'>('');

  const submit = () => {
    const value = email.trim();
    if (!EMAIL.test(value)) return setStatus('error');
    onSubmit?.(value);
    setEmail('');
    setStatus('done');
  };

  return (
    <View>
      <Text style={styles.heading}>{heading}</Text>
      <View style={[styles.form, focused && styles.focused]}>
        <TextInput
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setStatus('');
          }}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          accessibilityLabel={placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="send"
          onSubmitEditing={submit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        <Button
          onPress={submit}
          extendedIcon={ArrowRight}
          extendedIconSize={20}
          textColor={colors.primary}
          circleStyle={styles.submit}
          accessibilityLabel="Subscribe"
        />
      </View>
      {status === 'error' && <Text style={styles.note}>Please enter a valid email address.</Text>}
      {status === 'done' && <Text style={styles.note}>Thanks for subscribing!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: 12, fontFamily: fonts.semiBold, fontSize: 18, color: colors.white },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: 420,
    paddingVertical: 6,
    paddingRight: 6,
    paddingLeft: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 999,
  },
  focused: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: colors.white,
    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.15)',
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  submit: { padding: 12 },
  note: { marginTop: 8, fontFamily: fonts.regular, fontSize: 13, color: colors.white },
});

export default memo(Newsletter);
