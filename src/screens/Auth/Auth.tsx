import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from '../../theme/icons';
import Tabs from '../../components/atoms/Tabs/Tabs';
import Checkbox from '../../components/atoms/Checkbox/Checkbox';
import Field from '../../components/atoms/Field/Field';
import { shop } from '../../store';
import { breakpoints, colors, fonts, radius, shadows, type } from '../../theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { email: '', password: '', fullName: '', confirmPassword: '', rememberMe: false, agreeTerms: false };
type Form = typeof EMPTY_FORM;
type Message = { type: '' | 'error'; text: string };

const showTerms = () =>
  Platform.OS === 'web'
    ? (globalThis as { alert?: (m: string) => void }).alert?.('Terms & Conditions') // RN-web Alert is a no-op
    : Alert.alert('Terms & Conditions');

function Auth({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const { width } = useWindowDimensions();
  const twoCols = width >= 600 && !isLogin;
  const sheet = width < breakpoints.tablet; // phones: slide-up sheet, wider screens: centred card
  const { bottom } = useSafeAreaInsets();

  const set = <K extends keyof Form>(key: K) => (value: Form[K]) => setForm((p) => ({ ...p, [key]: value }));
  const fail = (text: string) => setMessage({ type: 'error', text });

  // HTML "required" / type="email" don't exist in RN, so validate here
  const submit = () => {
    if (!EMAIL.test(form.email.trim())) return fail('Please enter a valid email address.');
    if (!form.password) return fail('Please enter your password.');
    if (!isLogin && form.password !== form.confirmPassword) return fail('Passwords do not match.');
    if (!isLogin && !form.agreeTerms) return fail('You must agree to the Terms & Conditions.');

    setLoading(true);
    setMessage({ type: '', text: '' });
    // ponytail: fake request, replace with the real auth API call
    setTimeout(() => {
      const email = form.email.trim();
      shop.signIn({ name: (!isLogin && form.fullName.trim()) || email.split('@')[0], email });
      setLoading(false);
      setForm(EMPTY_FORM);
      onClose?.();
    }, 1000);
  };

  const emailField = (
    <Field
      label="Email Address"
      placeholder="you@example.com"
      keyboardType="email-address"
      autoComplete="email"
      value={form.email}
      onChangeText={set('email')}
    />
  );

  return (
    <Modal transparent statusBarTranslucent visible={open} animationType={sheet ? 'slide' : 'fade'} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.backdrop, sheet ? styles.backdropSheet : styles.backdropCentre]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close sign in" />
        <View style={[styles.card, sheet ? styles.cardSheet : [styles.cardCentre, !isLogin && styles.cardWide]]}>
          <ScrollView contentContainerStyle={[styles.cardContent, sheet && { paddingBottom: 24 + bottom }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={styles.close} hitSlop={8}>
              <X size={16} color={colors.textMuted} strokeWidth={2.5} />
            </Pressable>

            <View style={[styles.logo, !isLogin && styles.logoCompact]}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.brand, !isLogin && styles.brandCompact]}>
                PresentBox
              </Text>
              <Text style={[styles.title, !isLogin && styles.titleCompact]}>Unlock the full experience</Text>
              <Text style={[styles.intro, !isLogin && styles.introCompact]}>
                {isLogin ? 'Access your personalized well-being journey.' : 'Creating an account is free and gives you full access.'}
              </Text>
            </View>

            <Tabs
              variant="segmented"
              style={styles.tabs}
              tabs={[{ value: 'login', label: 'Sign In' }, { value: 'signup', label: 'Sign Up' }]}
              value={isLogin ? 'login' : 'signup'}
              onChange={(tab) => {
                setIsLogin(tab === 'login');
                setMessage({ type: '', text: '' });
              }}
            />

            {!!message.text && (
              <View style={styles.message}>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            )}

            <View style={styles.form}>
              {isLogin ? (
                emailField
              ) : (
                <View style={[styles.row, twoCols && styles.rowTwo]}>
                  <View style={twoCols && styles.flex}>
                    <Field label="Full Name" placeholder="John Doe" autoCapitalize="words" value={form.fullName} onChangeText={set('fullName')} />
                  </View>
                  <View style={twoCols && styles.flex}>{emailField}</View>
                </View>
              )}

              <View style={[styles.row, twoCols && styles.rowTwo]}>
                <View style={twoCols && styles.flex}>
                  <Field label="Password" placeholder="••••••••" secure value={form.password} onChangeText={set('password')} />
                </View>
                {!isLogin && (
                  <View style={twoCols && styles.flex}>
                    <Field label="Confirm Password" placeholder="••••••••" secure value={form.confirmPassword} onChangeText={set('confirmPassword')} />
                  </View>
                )}
              </View>

              {isLogin ? (
                <Checkbox label="Remember me" checked={form.rememberMe} onChange={set('rememberMe')} />
              ) : (
                <Checkbox
                  checked={form.agreeTerms}
                  onChange={set('agreeTerms')}
                  label={
                    <Text style={styles.termsText}>
                      I agree to the{' '}
                      <Text accessibilityRole="link" style={styles.termsLink} onPress={showTerms}>
                        Terms & Conditions
                      </Text>
                    </Text>
                  }
                />
              )}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: loading }}
                disabled={loading}
                onPress={submit}
                style={({ pressed }) => [styles.submit, (pressed || loading) && styles.submitDim]}
              >
                <Text style={styles.submitText}>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  backdropSheet: { justifyContent: 'flex-end' },
  backdropCentre: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', backgroundColor: colors.white, overflow: 'hidden' },
  cardSheet: { maxHeight: '94%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  cardCentre: { maxWidth: 480, maxHeight: '100%', borderRadius: radius.lg, boxShadow: shadows.modal },
  cardWide: { maxWidth: 640 },
  cardContent: { paddingTop: 32, paddingBottom: 28, paddingHorizontal: 24 },
  close: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logo: { alignItems: 'center', gap: 8, marginBottom: 28 },
  logoCompact: { marginBottom: 20 },
  brand: { paddingHorizontal: 40, fontFamily: fonts.logo, fontSize: 14, color: colors.primary, letterSpacing: 1.5, marginBottom: 8 },
  brandCompact: { marginBottom: 4 },
  title: { ...type.title1, color: colors.text, textAlign: 'center' },
  titleCompact: { ...type.title2 },
  intro: { ...type.subhead, color: colors.textMuted, textAlign: 'center' },
  introCompact: {},
  tabs: { marginBottom: 24 },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.primaryTint,
    borderRadius: 12,
  },
  messageText: { flex: 1, ...type.footnote, fontFamily: fonts.medium, color: colors.primary },
  form: { gap: 16 },
  row: { gap: 16 },
  rowTwo: { flexDirection: 'row' },
  termsText: { ...type.subhead, color: colors.textMuted },
  termsLink: { color: colors.primary },
  submit: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  submitDim: { opacity: 0.7 },
  submitText: { ...type.headline, color: colors.white },
});

export default Auth;
