import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, StatusBar, Modal, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme';
import { useSettingsStore, type AppSettings } from '../store/useSettingsStore';

const PRIVACY_POLICY_URL = 'https://burakkizilgecit.github.io/islamicibadet-privacy';
const APP_VERSION = '1.0.0';

type NotifKey = keyof AppSettings['notifications'];

interface SettingItem {
  key: NotifKey;
  label: string;
  desc: string;
  icon: string;
}

const NOTIFICATION_SETTINGS: SettingItem[] = [
  { key: 'prayerTimes',   label: 'Namaz Vakitleri',         desc: 'Tüm vakitler için bildirim al',    icon: 'clock-time-five-outline' },
  { key: 'earlyReminder', label: 'Vakit Öncesi Hatırlatma', desc: 'Namazdan 10 dk önce hatırlat',     icon: 'bell-ring-outline' },
  { key: 'dailyHadith',   label: 'Günlük Hadis',            desc: 'Her gün yeni hadis bildirimi al',  icon: 'format-quote-close' },
  { key: 'dailyDua',      label: 'Günlük Dua',              desc: 'Her gün yeni dua bildirimi al',    icon: 'hands-pray' },
  { key: 'dhikrReminder', label: 'Zikir Hatırlatması',      desc: 'Bugünkü zikiri hatırlatır',        icon: 'circle-outline' },
  { key: 'islamicDays',   label: 'Dini Günler',             desc: 'Bayramlar, kandiller için bildirim', icon: 'calendar-star' },
];

// ── Time Picker ──────────────────────────────────────────────────────────────

interface TimeParts { h: number; m: number }

function parseTime(t: string): TimeParts {
  const [h, m] = t.split(':').map(Number);
  return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m };
}
function fmt(p: TimeParts) {
  return `${String(p.h).padStart(2, '0')}:${String(p.m).padStart(2, '0')}`;
}

interface TimePickerProps {
  visible: boolean;
  startTime: string;
  endTime: string;
  onSave: (start: string, end: string) => void;
  onClose: () => void;
}

function TimePicker({ visible, startTime, endTime, onSave, onClose }: TimePickerProps) {
  const [start, setStart] = useState<TimeParts>(parseTime(startTime));
  const [end, setEnd] = useState<TimeParts>(parseTime(endTime));

  const adjust = (which: 'start' | 'end', field: 'h' | 'm', delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const max = field === 'h' ? 24 : 60;
    const setter = which === 'start' ? setStart : setEnd;
    setter(prev => ({ ...prev, [field]: (prev[field] + delta + max) % max }));
  };

  const Wheel = ({ value, field, which }: { value: number; field: 'h' | 'm'; which: 'start' | 'end' }) => (
    <View style={styles.wheel}>
      <TouchableOpacity onPress={() => adjust(which, field, 1)} style={styles.wheelBtn} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
        <Ionicons name="chevron-up" size={22} color={COLORS.gold} />
      </TouchableOpacity>
      <Text style={styles.wheelValue}>{String(value).padStart(2, '0')}</Text>
      <TouchableOpacity onPress={() => adjust(which, field, -1)} style={styles.wheelBtn} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
        <Ionicons name="chevron-down" size={22} color={COLORS.gold} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerCard}>
          <Text style={styles.pickerTitle}>Sessiz Saatler</Text>
          <Text style={styles.pickerHint}>Bu saatler arasında bildirim gönderilmez.</Text>

          <View style={styles.pickerRow}>
            {/* Start */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Başlangıç</Text>
              <View style={styles.timeDisplay}>
                <Wheel value={start.h} field="h" which="start" />
                <Text style={styles.timeSep}>:</Text>
                <Wheel value={start.m} field="m" which="start" />
              </View>
            </View>

            <View style={styles.pickerArrow}>
              <Ionicons name="arrow-forward" size={20} color={COLORS.textMuted} />
            </View>

            {/* End */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Bitiş</Text>
              <View style={styles.timeDisplay}>
                <Wheel value={end.h} field="h" which="end" />
                <Text style={styles.timeSep}>:</Text>
                <Wheel value={end.m} field="m" which="end" />
              </View>
            </View>
          </View>

          <View style={styles.pickerBtns}>
            <TouchableOpacity style={styles.pickerCancelBtn} onPress={onClose}>
              <Text style={styles.pickerCancelText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerSaveBtn}
              onPress={() => { onSave(fmt(start), fmt(end)); onClose(); }}
            >
              <Text style={styles.pickerSaveText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, toggleNotification, updateSettings } = useSettingsStore();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleVibrationToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateSettings({ vibration: !settings.vibration });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <TimePicker
        visible={showTimePicker}
        startTime={settings.silentHours.start}
        endTime={settings.silentHours.end}
        onSave={(start, end) => updateSettings({ silentHours: { start, end } })}
        onClose={() => setShowTimePicker(false)}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SPACING.md }}>
        {/* Notification Settings */}
        <Text style={styles.sectionTitle}>Bildirim Ayarları</Text>
        <Text style={styles.sectionDesc}>Önemli hatırlatmalar için bildirimleri ayarlayabilirsiniz.</Text>
        <View style={styles.card}>
          {NOTIFICATION_SETTINGS.map((item, i) => (
            <View key={item.key} style={[styles.settingRow, i < NOTIFICATION_SETTINGS.length - 1 && styles.rowBorder]}>
              <View style={styles.settingIcon}>
                <MaterialCommunityIcons name={item.icon as any} size={20} color={COLORS.gold} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingDesc2}>{item.desc}</Text>
              </View>
              <Switch
                value={settings.notifications[item.key]}
                onValueChange={() => toggleNotification(item.key)}
                trackColor={{ false: COLORS.cardBorder, true: COLORS.gold + '66' }}
                thumbColor={settings.notifications[item.key] ? COLORS.gold : COLORS.textMuted}
              />
            </View>
          ))}
        </View>

        {/* Other Settings */}
        <Text style={styles.sectionTitle}>Diğer Ayarlar</Text>
        <View style={styles.card}>
          {/* Silent Hours */}
          <TouchableOpacity
            style={[styles.settingRow, styles.rowBorder]}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="moon-outline" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sessiz Saatler</Text>
              <Text style={styles.settingDesc2}>Bu saatler arasında bildirim gelmez</Text>
            </View>
            <View style={styles.valueRow}>
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>{settings.silentHours.start}</Text>
              </View>
              <Text style={styles.timeDash}>–</Text>
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>{settings.silentHours.end}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>

          {/* Vibration */}
          <View style={[styles.settingRow, styles.rowBorder]}>
            <View style={styles.settingIcon}>
              <Ionicons name="phone-portrait-outline" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Titreşim</Text>
              <Text style={styles.settingDesc2}>Bildirimlerde titreşim {settings.vibration ? 'açık' : 'kapalı'}</Text>
            </View>
            <Switch
              value={settings.vibration}
              onValueChange={handleVibrationToggle}
              trackColor={{ false: COLORS.cardBorder, true: COLORS.gold + '66' }}
              thumbColor={settings.vibration ? COLORS.gold : COLORS.textMuted}
            />
          </View>

          {/* Calculation Method */}
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons name="location-outline" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Hesaplama Metodu</Text>
              <Text style={styles.settingDesc2}>Namaz vakti hesaplama yöntemi</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueText}>{settings.calculationMethod}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </View>
          </View>
        </View>

        {/* Hakkında */}
        <Text style={styles.sectionTitle}>Hakkında</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.settingRow, styles.rowBorder]}
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            activeOpacity={0.7}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Gizlilik Politikası</Text>
              <Text style={styles.settingDesc2}>Verilerinizin nasıl kullanıldığını öğrenin</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Uygulama Sürümü</Text>
              <Text style={styles.settingDesc2}>İslami İbadet v{APP_VERSION}</Text>
            </View>
          </View>
        </View>

        <View style={styles.appInfo}>
          <MaterialCommunityIcons name="mosque" size={32} color={COLORS.gold} style={{ opacity: 0.5 }} />
          <Text style={styles.appName}>İslami İbadet</Text>
          <Text style={styles.appVersion}>Sürüm {APP_VERSION}</Text>
          <Text style={styles.appCopyright}>© 2025 Tüm hakları saklıdır.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  sectionTitle: { color: COLORS.gold, fontSize: FONT_SIZE.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.xs, marginTop: SPACING.lg },
  sectionDesc: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2, gap: SPACING.sm },
  rowBorder: { borderBottomColor: COLORS.cardBorder, borderBottomWidth: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(200,168,83,0.12)', alignItems: 'center', justifyContent: 'center' },
  settingInfo: { flex: 1 },
  settingLabel: { color: COLORS.textPrimary, fontSize: FONT_SIZE.sm, fontWeight: '500' },
  settingDesc2: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, marginTop: 1 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  valueText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs },
  timeBadge: { backgroundColor: 'rgba(200,168,83,0.15)', borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(200,168,83,0.3)' },
  timeBadgeText: { color: COLORS.gold, fontSize: FONT_SIZE.sm, fontWeight: '700', fontVariant: ['tabular-nums'] },
  timeDash: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  appInfo: { alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.xl, gap: SPACING.xs },
  appName: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md, fontWeight: '600' },
  appVersion: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  appCopyright: { color: COLORS.textMuted, fontSize: 10 },

  // Time Picker Modal
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  pickerCard: { width: '88%', backgroundColor: COLORS.cardBg, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.cardBorder, padding: SPACING.lg },
  pickerTitle: { color: COLORS.textPrimary, fontSize: FONT_SIZE.lg, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  pickerHint: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, textAlign: 'center', marginBottom: SPACING.lg },
  pickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  pickerSection: { alignItems: 'center', flex: 1 },
  pickerLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm },
  timeDisplay: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeSep: { color: COLORS.gold, fontSize: 28, fontWeight: '700', marginBottom: 4 },
  pickerArrow: { paddingHorizontal: SPACING.sm, marginTop: 20 },
  wheel: { alignItems: 'center', gap: SPACING.xs },
  wheelBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  wheelValue: { color: COLORS.textPrimary, fontSize: 32, fontWeight: '700', fontVariant: ['tabular-nums'], minWidth: 44, textAlign: 'center' },
  pickerBtns: { flexDirection: 'row', gap: SPACING.sm },
  pickerCancelBtn: { flex: 1, padding: SPACING.sm + 2, borderRadius: RADIUS.lg, backgroundColor: COLORS.cardBorder, alignItems: 'center' },
  pickerCancelText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  pickerSaveBtn: { flex: 1, padding: SPACING.sm + 2, borderRadius: RADIUS.lg, backgroundColor: COLORS.gold, alignItems: 'center' },
  pickerSaveText: { color: COLORS.background, fontSize: FONT_SIZE.sm, fontWeight: '700' },
});
