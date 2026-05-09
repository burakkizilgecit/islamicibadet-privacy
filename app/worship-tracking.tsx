import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme';
import { usePrayerStore } from '../store/usePrayerStore';
import { useDhikrStore } from '../store/useDhikrStore';
import { useGoalsStore } from '../store/useGoalsStore';
import { DAYS_SHORT_TR, GREGORIAN_MONTHS_TR } from '../services/hijriService';

const TABS = ['Günlük', 'Haftalık', 'Aylık'];
const PRAYER_ORDER = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
const PRAYER_SHORT: Record<string, string> = { fajr: 'Sabah', dhuhr: 'Öğle', asr: 'İkindi', maghrib: 'Akşam', isha: 'Yatsı' };
const PRAYER_ICON: Record<string, string> = { fajr: 'weather-night', dhuhr: 'weather-sunny', asr: 'weather-partly-cloudy', maghrib: 'weather-sunset-down', isha: 'moon-waning-crescent' };

export default function WorshipTrackingScreen() {
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İbadet Takip</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)}>
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SPACING.md }}>
        {/* Date */}
        <View style={styles.dateRow}>
          <Ionicons name="chevron-back" size={20} color={COLORS.gold} />
          <Text style={styles.dateText}>{now.getDate()} {GREGORIAN_MONTHS_TR[now.getMonth()]} {now.getFullYear()}</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
        </View>

        {/* Progress Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.progressCircleWrap}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressPercent}>%{progressPercent}</Text>
              <Text style={styles.progressLabel}>Tamamlama</Text>
            </View>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{prayersDone}/5</Text>
              <Text style={styles.statLabel}>Namaz</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{goals.filter(g => g.progress >= g.target).length}/{goals.length}</Text>
              <Text style={styles.statLabel}>Hedefler</Text>
            </View>
          </View>
        </View>

        {/* Prayer Tracking */}
        <Text style={styles.sectionTitle}>Namaz Takibi</Text>
        <View style={styles.prayerGrid}>
          {PRAYER_ORDER.map(key => {
            const done = todayComp[key];
            return (
              <TouchableOpacity key={key} style={[styles.prayerCell, done && styles.prayerCellDone]} onPress={() => togglePrayer(todayKey, key)}>
                <MaterialCommunityIcons name={PRAYER_ICON[key] as any} size={20} color={done ? COLORS.background : COLORS.gold} />
                <Text style={[styles.prayerCellLabel, done && { color: COLORS.background }]}>{PRAYER_SHORT[key]}</Text>
                {done && <Ionicons name="checkmark-circle" size={14} color={COLORS.background} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daily Goals */}
        <Text style={styles.sectionTitle}>Günlük Hedefler</Text>
        <View style={styles.card}>
          {goals.map((goal, i) => {
            const progress = Math.min(goal.progress / goal.target, 1);
            return (
              <View key={goal.id} style={[styles.goalRow, i < goals.length - 1 && styles.goalRowBorder]}>
                <MaterialCommunityIcons name={goal.icon as any} size={20} color={COLORS.gold} />
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
        <Text style={styles.sectionTitle}>Bu Haftaki Namaz Kaydı</Text>
        <View style={styles.weekCard}>
          <View style={styles.weekRow}>
            {weekDays.map((d, i) => {
              const isToday = d.date.toDateString() === now.toDateString();
              const pct = d.count / 5;
              return (
                <View key={i} style={styles.weekCol}>
                  <Text style={[styles.weekDay, isToday && { color: COLORS.gold }]}>{DAYS_SHORT_TR[d.date.getDay()]}</Text>
                  <View style={[styles.weekBar, isToday && { borderColor: COLORS.gold, borderWidth: 1 }]}>
                    <View style={[styles.weekFill, { height: `${pct * 100}%`, backgroundColor: pct === 1 ? COLORS.green : COLORS.gold }]} />
                  </View>
                  <Text style={[styles.weekCount, isToday && { color: COLORS.gold }]}>{d.count}</Text>
                </View>
              );
            })}
          </View>
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
  tabs: { flexDirection: 'row', marginHorizontal: SPACING.md, backgroundColor: COLORS.cardBg, borderRadius: RADIUS.full, padding: 3, borderColor: COLORS.cardBorder, borderWidth: 1, marginBottom: SPACING.sm },
  tab: { flex: 1, paddingVertical: SPACING.xs + 2, alignItems: 'center', borderRadius: RADIUS.full },
  tabActive: { backgroundColor: COLORS.gold },
  tabLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '500' },
  tabLabelActive: { color: COLORS.background, fontWeight: '700' },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  dateText: { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '600' },
  summaryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, gap: SPACING.md },
  progressCircleWrap: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 50, borderWidth: 8, borderColor: COLORS.gold },
  progressInfo: { alignItems: 'center' },
  progressPercent: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  progressLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  summaryStats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statValue: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  statLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.cardBorder },
  sectionTitle: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm, marginTop: SPACING.md },
  prayerGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  prayerCell: { flex: 1, backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center', gap: 4 },
  prayerCellDone: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  prayerCellLabel: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '500' },
  card: { backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, overflow: 'hidden' },
  goalRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2, gap: SPACING.sm },
  goalRowBorder: { borderBottomColor: COLORS.cardBorder, borderBottomWidth: 1 },
  goalInfo: { flex: 1 },
  goalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalTitle: { color: COLORS.textPrimary, fontSize: FONT_SIZE.sm, fontWeight: '500' },
  goalProgress: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  progressBar: { height: 6, backgroundColor: COLORS.cardBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 3 },
  weekCard: { backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.xl },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 90 },
  weekCol: { alignItems: 'center', gap: 4, flex: 1 },
  weekDay: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  weekBar: { width: 24, height: 60, backgroundColor: COLORS.cardBorder, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  weekFill: { width: '100%', borderRadius: 4 },
  weekCount: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
});
