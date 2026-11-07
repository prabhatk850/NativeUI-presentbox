import React, { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainLayout from '../components/templates/MainLayout/MainLayout';
import ProductCategoryBubble from '../components/atoms/ProductCategoryBubble/ProductCategoryBubble';
import type { RootStackParamList } from '../navigation';
import { ChevronDown, Mail, Phone, type LucideIcon } from '../icons';
import { getHelp } from '../api';
import { colors, fonts, radius, type } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;
type HelpData = Awaited<ReturnType<typeof getHelp>>['data'];
const ALL = 'All';

function Contact({ icon: Icon, label, detail, onPress }: { icon: LucideIcon; label: string; detail: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.contact, pressed && styles.pressed]}>
      <View style={styles.iconTile}>
        <Icon size={18} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactDetail} numberOfLines={1}>
          {detail}
        </Text>
      </View>
    </Pressable>
  );
}

// FAQs as an accordion (one open at a time), filterable by topic, plus email / phone support.
// Footer links open a topic directly: /help?topic=Returns.
function Help({ route }: Props) {
  const linkedTopic = route.params?.topic ?? ALL;
  const [help, setHelp] = useState<HelpData | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [topic, setTopic] = useState(linkedTopic);

  useEffect(() => {
    setTopic(linkedTopic);
    setOpenId(null);
  }, [linkedTopic]);

  useEffect(() => {
    getHelp()
      .then((res) => setHelp(res.data))
      .catch((error) => console.error('Error fetching help:', error));
  }, []);

  const faqs = help?.faqs.filter((f) => topic === ALL || f.topic === topic) ?? [];

  return (
    <MainLayout>
      <View style={styles.page}>
        <Text accessibilityRole="header" style={styles.title}>
          Help Center
        </Text>
        <Text style={styles.subtitle}>Answers to common questions, or get in touch with us.</Text>

        {help && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.noGrow} contentContainerStyle={styles.topics}>
              {[ALL, ...new Set(help.faqs.map((f) => f.topic))].map((t) => (
                <ProductCategoryBubble key={t} category={t} isActive={t === topic} onPress={() => setTopic(t)} />
              ))}
            </ScrollView>
            <View style={styles.group}>
              {faqs.map((f, i) => {
                const open = f.id === openId;
                return (
                  <View key={f.id} style={i < faqs.length - 1 && styles.divider}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ expanded: open }}
                      onPress={() => setOpenId(open ? null : f.id)}
                      style={styles.question}
                    >
                      <View style={styles.flex}>
                        <Text style={styles.topic}>{f.topic}</Text>
                        <Text style={styles.questionText}>{f.question}</Text>
                      </View>
                      <View style={open && styles.flipped}>
                        <ChevronDown size={18} color={colors.textSubtle} />
                      </View>
                    </Pressable>
                    {open && <Text style={styles.answer}>{f.answer}</Text>}
                  </View>
                );
              })}
            </View>

            <Text accessibilityRole="header" style={styles.section}>
              Still need help?
            </Text>
            <View style={styles.contacts}>
              <Contact icon={Mail} label="Email us" detail={help.contact.email} onPress={() => Linking.openURL(`mailto:${help.contact.email}`)} />
              <Contact icon={Phone} label="Call us" detail={help.contact.hours} onPress={() => Linking.openURL(`tel:${help.contact.phone}`)} />
            </View>
          </>
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
  page: { gap: 8, width: '100%', maxWidth: 720, alignSelf: 'center' },
  title: { ...type.largeTitle, color: colors.text },
  subtitle: { ...type.subhead, color: colors.textMuted, marginBottom: 12 },
  noGrow: { flexGrow: 0 },
  topics: { gap: 8, paddingBottom: 12 },
  group: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.separator },
  question: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  topic: { ...type.caption, fontFamily: fonts.semiBold, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.6 },
  questionText: { ...type.headline, color: colors.text },
  flipped: { transform: [{ rotate: '180deg' }] },
  answer: { ...type.subhead, color: colors.textMuted, paddingHorizontal: 16, paddingBottom: 16 },
  section: { ...type.title3, color: colors.text, marginTop: 24, marginBottom: 4 },
  contacts: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  contact: { flexGrow: 1, flexBasis: 240, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: radius.lg, backgroundColor: colors.surface },
  iconTile: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryTint },
  contactLabel: { ...type.headline, color: colors.text },
  contactDetail: { ...type.footnote, color: colors.textMuted },
});

export default Help;
