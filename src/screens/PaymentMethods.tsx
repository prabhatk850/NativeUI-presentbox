import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MainLayout from '../components/templates/MainLayout/MainLayout';
import { CreditCard, Smartphone, Trash, Wallet, type LucideIcon } from '../icons';
import { getPaymentMethods } from '../api';
import { colors, fonts, radius, type } from '../theme';

type Method = Awaited<ReturnType<typeof getPaymentMethods>>['data'][number];

const ICONS: Record<string, LucideIcon> = { UPI: Smartphone, Card: CreditCard, Wallet };

// Saved payment methods: tap one to make it the default, or remove it.
// ponytail: demo data held in screen state, so changes reset on leaving; move to the store / API with real payments.
function PaymentMethods() {
  const [methods, setMethods] = useState<Method[]>([]);
  const [defaultId, setDefaultId] = useState<number | null>(null);

  useEffect(() => {
    getPaymentMethods()
      .then((res) => {
        setMethods(res.data);
        setDefaultId(res.data.find((m) => m.isDefault)?.id ?? res.data[0]?.id ?? null);
      })
      .catch((error) => console.error('Error fetching payment methods:', error));
  }, []);

  const remove = (id: number) => {
    const rest = methods.filter((m) => m.id !== id);
    setMethods(rest);
    if (id === defaultId) setDefaultId(rest[0]?.id ?? null);
  };

  return (
    <MainLayout>
      <View style={styles.page}>
        <Text accessibilityRole="header" style={styles.title}>
          Payment Methods
        </Text>
        <Text style={styles.subtitle}>Your default method is picked first at checkout.</Text>

        <View accessibilityRole="radiogroup" style={styles.group}>
          {methods.map((m, i) => {
            const Icon = ICONS[m.type] ?? CreditCard;
            const selected = m.id === defaultId;
            return (
              <View key={m.id} style={[styles.row, i < methods.length - 1 && styles.divider]}>
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={`${m.label}, ${m.detail}`}
                  onPress={() => setDefaultId(m.id)}
                  style={styles.main}
                >
                  <View style={styles.iconTile}>
                    <Icon size={18} color={colors.primary} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.label}>{m.label}</Text>
                    <Text style={styles.detail}>{m.detail}</Text>
                  </View>
                  {selected ? <Text style={styles.default}>Default</Text> : <View style={styles.radio} />}
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${m.label}`} onPress={() => remove(m.id)} style={styles.remove} hitSlop={8}>
                  <Trash size={16} color={colors.textMuted} />
                </Pressable>
              </View>
            );
          })}
        </View>
        {methods.length === 0 && <Text style={styles.subtitle}>No saved payment methods.</Text>}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  page: { gap: 8, width: '100%', maxWidth: 640, alignSelf: 'center' },
  title: { ...type.largeTitle, color: colors.text },
  subtitle: { ...type.subhead, color: colors.textMuted, marginBottom: 12 },
  group: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center' },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.separator },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingLeft: 16 },
  iconTile: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint },
  label: { ...type.headline, color: colors.text },
  detail: { ...type.footnote, color: colors.textMuted },
  default: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    ...type.caption,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    overflow: 'hidden',
  },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderHover },
  remove: { padding: 16 },
});

export default PaymentMethods;
