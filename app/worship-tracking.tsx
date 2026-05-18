import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '../i18n';
import { SPACING, RADIUS, FONT_SIZE } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { usePrayerStore } from '../store/usePrayerStore';
import { useDhikrStore } from '../store/useDhikrStore';
import { useGoalsStore } from '../store/useGoalsStore';
import { DAYS_SHORT_TR, GREGORIAN_MONTHS_TR } from '../services/hijriService';

const WORSHIP_TAB_KEYS = ['worshipTabDaily', 'worshipTabWeekly', 'worshipTabMonthly'] as const;
const PRAYER_ORDER = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
const PRAYER_LABEL_KEYS: Record<string, string> = { fajr: 'prayerFajr', dhuhr: 'prayerDhuhr', asr: 'prayerAsr', maghrib: 'prayerMaghrib', isha: 'prayerIsha' };
const PRAYER_ICON: Record<string, string> = { fajr: 'weather-night', dhuhr: 'weather-sunny', asr: 'weather-partly-cloudy', maghrib: 'weather-sunset-down', isha: 'moon-waning-crescent' };

export default function WorshipTrackingScreen() {
  const { t } = useTranslation();
  const { colors, fs } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors, fs), [colors, fs]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { completion, togglePrayer } = usePrayerStore();
  const { getTotalToday } = useDhikrStore();
  const { goals, getCompletionRate } = useGoalsStore();
  const now = new Date();
  const todayKey = now.toISOString().split('T')[0];
  const todayComp = completion[todayKey] ?? { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
  const prayersDone = Object.values(todayComp).filter(Boolean).length;
  const completionRate = getCompletionRate();
  const dhikrToday = getTotalToday();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const comp = completion[key] ?? { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
    const count = Object.values(comp).filter(Boolean).length;
    return { date: d, key, comp, count };
  });

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const overallProgress = (prayersDone / 5 * 0.6 + completionRate / 100 * 0.4);
  const progressPercent = Math.round(overallProgress * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('worshipTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {WORSHIP_TAB_KEYS.map((key, i) => (
          <TouchableOpacity key={key} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)}>
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>{t(key as any)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SPACING.md }}>
        {/* Date */}
        <View style={styles.dateRow}>
          <Ionicons name="chevron-back" size={20} color={colors.gold} />
          <Text style={styles.dateText}>{now.getDate()} {GREGORIAN_MONTHS_TR[now.getMonth()]} {now.getFullYear()}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gold} />
        </View>

        {/* Progress Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.progressCircleWrap}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressPercent}>%{progressPercent}</Text>
              <Text style={styles.progressLabel}>{t('worshipCompletion')}</Text>
            </View>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{prayersDone}/5</Text>
              <Text style={styles.statLabel}>{t('worshipPrayer')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{goals.filter(g => g.progress >= g.target).length}/{goals.length}</Text>
              <Text style={styles.statLabel}>{t('worshipGoals')}</Text>
            </View>
          </View>
        </View>

        {/* Prayer Tracking */}
        <Text style={styles.sectionTitle}>{t('worshipPrayerSection')}</Text>
        <View style={styles.prayerGrid}>
          {PRAYER_ORDER.map(key => {
            const done = todayComp[key];
            return (
              <TouchableOpacity key={key} style={[styles.prayerCell, done && styles.prayerCellDone]} onPress={() => togglePrayer(todayKey, key)}>
                <MaterialCommunityIcons name={PRAYER_ICON[key] as any} size={20} color={done ? colors.background : colors.gold} />
                <Text style={[styles.prayerCellLabel, done && { color: colors.background }]}>{t(PRAYER_LABEL_KEYS[key] as any)}</Text>
                {done && <Ionicons name="checkmark-circle" size={14} color={colors.background} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daily Goals */}
        <Text style={styles.sectionTitle}>{t('worshipGoalsSection')}</Text>
        <View style={styles.card}>
          {goals.map((goal, i) => {
            const progress = Math.min(goal.progress / goal.target, 1);
            return (
              <View key={goal.id} style={[styles.goalRow, i < goals.length - 1 && styles.goalRowBorder]}>
                <MaterialCommunityIcons name={goal.icon as any} size={20} color={colors.gold} />
                <View style={styles.goalInfo}>
                  <View style={styles.goalTitleRow}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalProgress}>{goal.progress}/{goal.target} {goal.unit}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Weekly View */}
        <Text style={styles.sectionTitle}>{t('worshipWeeklySection')}</Text>
        <View style={styles.weekCard}>
          <View style={styles.weekRow}>
            {weekDays.map((d, i) => {
              const isToday = d.date.toDateString() === now.toDateString();
              const pct = d.count / 5;
              return (
                <View key={i} style={styles.weekCol}>
                  <Text style={[styles.weekDay, isToday && { color: colors.gold }]}>{DAYS_SHORT_TR[d.date.getDay()]}</Text>
                  <View style={[styles.weekBar, isToday && { borderColor: colors.gold, borderWidth: 1 }]}>
                    <View style={[styles.weekFill, { height: `${pct * 100}%`, backgroundColor: pct === 1 ? colors.green : colors.gold }]} />
                  </View>
                  <Text style={[styles.weekCount, isToday && { color: colors.gold }]}>{d.count}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any, fs: (n: number) => number) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  tabs: { flexDirection: 'row', marginHorizontal: SPACING.md, backgroundColor: colors.cardBg, borderRadius: RADIUS.full, padding: 3, borderColor: colors.cardBorder, borderWidth: 1, marginBottom: SPACING.sm },
  tab: { flex: 1, paddingVertical: SPACING.xs + 2, alignItems: 'center', borderRadius: RADIUS.full },
  tabActive: { backgroundColor: colors.gold },
  tabLabel: { color: colors.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '500' },
  tabLabelActive: { color: colors.background, fontWeight: '700' },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  dateText: { color: colors.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '600' },
  summaryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, gap: SPACING.md },
  progressCircleWrap: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 50, borderWidth: 8, borderColor: colors.gold },
  progressInfo: { alignItems: 'center' },
  progressPercent: { color: colors.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  progressLabel: { color: colors.textMuted, fontSize: FONT_SIZE.xs },
  summaryStats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statValue: { color: colors.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  statLabel: { color: colors.textMuted, fontSize: FONT_SIZE.xs },
  statDivider: { width: 1, height: 40, backgroundColor: colors.cardBorder },
  sectionTitle: { color: colors.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm, marginTop: SPACING.md },
  prayerGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  prayerCell: { flex: 1, backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center', gap: 4 },
  prayerCellDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  prayerCellLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '500' },
  card: { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, overflow: 'hidden' },
  goalRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2, gap: SPACING.sm },
  goalRowBorder: { borderBottomColor: colors.cardBorder, borderBottomWidth: 1 },
  goalInfo: { flex: 1 },
  goalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalTitle: { color: colors.textPrimary, fontSize: FONT_SIZE.sm, fontWeight: '500' },
  goalProgress: { color: colors.textMuted, fontSize: FONT_SIZE.xs },
  progressBar: { height: 6, backgroundColor: colors.cardBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 3 },
  weekCard: { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.xl },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 90 },
  weekCol: { alignItems: 'center', gap: 4, flex: 1 },
  weekDay: { color: colors.textMuted, fontSize: FONT_SIZE.xs },
  weekBar: { width: 24, height: 60, backgroundColor: colors.cardBorder, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  weekFill: { width: '100%', borderRadius: 4 },
  weekCount: { color: colors.textMuted, fontSize: FONT_SIZE.xs },
});
