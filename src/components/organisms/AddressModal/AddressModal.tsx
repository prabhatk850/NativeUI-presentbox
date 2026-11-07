import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MapPin, Plus, Trash } from '../../../icons';
import Sheet from '../../molecules/Sheet/Sheet';
import Field from '../../atoms/Field/Field';
import Tabs from '../../atoms/Tabs/Tabs';
import Button from '../../atoms/Button/Button';
import { shop, useShop, type Address, type AddressLabel } from '../../../store';
import { colors, fonts, radius, type } from '../../../theme';

const EMPTY_FORM = { label: 'Home' as AddressLabel, name: '', phone: '', pincode: '', line: '', city: '' };
const LABELS = ['Home', 'Work', 'Other'].map((l) => ({ value: l, label: l }));

function validate(f: typeof EMPTY_FORM) {
  if (!f.name) return 'Please enter the receiver’s name.';
  if (!/^[6-9]\d{9}$/.test(f.phone)) return 'Please enter a valid 10-digit mobile number.';
  if (!/^[1-9]\d{5}$/.test(f.pincode)) return 'Please enter a valid 6-digit pincode.';
  if (!f.line) return 'Please enter the house number and street.';
  if (!f.city) return 'Please enter the city.';
  return '';
}

function AddressRow({ address, selected, onSelect }: { address: Address; selected: boolean; onSelect: () => void }) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={`${address.label}: ${address.name}, ${address.line}, ${address.city} ${address.pincode}`}
        onPress={onSelect}
        style={styles.cardMain}
      >
        <View style={[styles.radio, selected && styles.radioOn]}>{selected && <View style={styles.radioDot} />}</View>
        <View style={styles.flex}>
          <View style={styles.cardHead}>
            <Text style={styles.name}>{address.name}</Text>
            <Text style={styles.chip}>{address.label}</Text>
          </View>
          <Text style={styles.line}>{address.line}</Text>
          <Text style={styles.line}>
            {address.city} – {address.pincode}
          </Text>
          <Text style={styles.phone}>{address.phone}</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${address.label} address`}
        onPress={() => shop.removeAddress(address.id)}
        style={styles.remove}
        hitSlop={8}
      >
        <Trash size={16} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

// One scrolling sheet: add-address form, then every saved address (tap one to deliver there).
// "Save address" sits in the sheet footer, so it stays put while the body scrolls.
function AddressModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addresses, selectedAddressId } = useShop();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const set = (key: keyof typeof EMPTY_FORM) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const clear = () => {
    setForm(EMPTY_FORM);
    setError('');
  };
  const close = () => {
    clear();
    onClose();
  };
  const save = () => {
    const f = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()])) as typeof EMPTY_FORM;
    const problem = validate(f);
    if (problem) return setError(problem);
    shop.addAddress(f);
    clear();
  };

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Delivery address"
      footer={<Button label="Save address" icon={Plus} color={colors.primary} onPress={save} style={styles.block} pillStyle={styles.blockPill} />}
    >
      <View style={styles.form}>
        <Text accessibilityRole="header" style={styles.section}>
          Add a new address
        </Text>
        {!!error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}
        <Field label="Receiver’s name" placeholder="Aanya Sharma" autoCapitalize="words" autoComplete="name" value={form.name} onChangeText={set('name')} />
        <Field label="Mobile number" placeholder="98765 43210" keyboardType="phone-pad" autoComplete="tel" maxLength={10} value={form.phone} onChangeText={set('phone')} />
        <Field label="Pincode" placeholder="110001" keyboardType="number-pad" autoComplete="postal-code" maxLength={6} value={form.pincode} onChangeText={set('pincode')} />
        <Field label="House no., building, street" placeholder="Flat 4B, Rose Apartments, MG Road" autoCapitalize="sentences" value={form.line} onChangeText={set('line')} />
        <Field label="City" placeholder="New Delhi" autoCapitalize="words" value={form.city} onChangeText={set('city')} />
        <View style={styles.labelGroup}>
          <Text style={styles.labelTitle}>Save as</Text>
          <Tabs variant="segmented" tabs={LABELS} value={form.label} onChange={set('label')} />
        </View>
      </View>

      {addresses.length > 0 && (
        <View style={styles.saved}>
          <Text accessibilityRole="header" style={styles.section}>
            {`Saved addresses (${addresses.length})`}
          </Text>
          <View style={styles.hint}>
            <MapPin size={14} color={colors.textSubtle} />
            <Text style={styles.hintText}>Tap an address to deliver there.</Text>
          </View>
          <View accessibilityRole="radiogroup" style={styles.list}>
            {addresses.map((a) => (
              <AddressRow
                key={a.id}
                address={a}
                selected={a.id === selectedAddressId}
                onSelect={() => {
                  shop.selectAddress(a.id);
                  close();
                }}
              />
            ))}
          </View>
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { gap: 14 },
  section: { ...type.headline, color: colors.text },
  saved: { gap: 10, marginTop: 28, paddingTop: 20, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.separator },
  error: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    ...type.footnote,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  labelGroup: { gap: 6 },
  labelTitle: { ...type.footnote, fontFamily: fonts.medium, color: colors.textMuted },
  block: { alignSelf: 'stretch' },
  blockPill: { flex: 1, justifyContent: 'center', minHeight: 50, borderRadius: radius.md },

  list: { gap: 12 },
  card: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  cardMain: { flex: 1, flexDirection: 'row', gap: 12, padding: 14 },
  radio: { width: 20, height: 20, marginTop: 2, borderRadius: 10, borderWidth: 2, borderColor: colors.borderHover, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  name: { ...type.headline, color: colors.text },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.fill,
    ...type.caption,
    color: colors.textMuted,
    overflow: 'hidden',
  },
  line: { ...type.subhead, color: colors.textMuted },
  phone: { ...type.footnote, color: colors.textSubtle, marginTop: 4 },
  remove: { padding: 14 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hintText: { ...type.footnote, color: colors.textSubtle },
});

export default AddressModal;
