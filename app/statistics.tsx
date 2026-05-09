import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '../i18n';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme';
import { usePrayerStore } from '../store/usePrayerStore';
import { useDhikrStore } from '../store/useDhikrStore';
import { DAYS_SHORT_TR, GREGORIAN_MONTHS_TR } from '../services/hijriService';

const TABS = ['Haftalık', 'Aylık', 'Yıllık'];

export default function StatisticsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { completion } = usePrayerStore();
  const { getWeeklyHistory } = useDhikrStore();
  const now = new Date();

  const weekHistory = getWeeklyHistory();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const dayComp = completion[key] ?? {};
    const count = Object.values(dayComp).filter(Boolean).length;
    return { date: d, key, count, label: DAYS_SHORT_TR[d.getDay()] };
  });

  const weekStart = weekDays[0].date;
  const weekEnd = weekDays[6].date;
  const weekLabel = `${weekStart.getDate()} - ${weekEnd.getDate()} ${GREGORIAN_MONTHS_TR[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  const totalPrayers = weekDays.reduce((s, d) => s + d.count, 0);
  const maxPossible = 7 * 5;
  const prayerRate = Math.round((totalPrayers / maxPossible) * 100);

  const maxDhikr = Math.max(...weekHistory.map(d => d.total), 1);
  const totalDhikr = weekHistory.reduce((s, d) => s + d.total, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İstatistikler</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)}>
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SPACING.md }}>
        {/* Week range */}
        <View style={styles.rangeRow}>
          <Ionicons name="chevron-back" size={20} color={COLORS.gold} />
          <Text style={styles.rangeText}>{weekLabel}</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
        </View>

        {/* Prayer rate */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View>
              <Text style={styles.statTitle}>Namaz Kılma Oranı</Text>
              <Text style={styles.statMain}>%{prayerRate}</Text>
              <Text style={styles.statSub}>Toplam {totalPrayers}/{maxPossible} vakit</Text>
            </View>
            <View style={styles.rateBadge}>
              <Text style={styles.rateBadgeText}>%{prayerRate}</Text>
            </View>
          </View>

          {/* Bar Chart */}
          <View style={styles.barChart}>
            {weekDays.map((d, i) => {
              const pct = d.count / 5;
              const isToday = d.date.toDateString() === now.toDateString();
              return (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barPct}>{d.count > 0 ? `${Math.round(pct * 100)}%` : ''}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${pct * 100}%`, backgroundColor: isToday ? COLORS.gold : pct === 1 ? COLORS.green : COLORS.gold + '88' }]} />
                  </View>
                  <Text style={[styles.barLabel, isToday && { color: COLORS.gold }]}>{d.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Dhikr Stats */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Zikir Adedi</Text>
          <Text style={styles.statMain}>Toplam {totalDhikr}</Text>

          <View style={styles.lineChart}>
            {weekHistory.map((d, i) => {
              const pct = d.total / maxDhikr;
              const isToday = i === 6;
              return (
                <View key={i} style={styles.lineCol}>
                  <Text style={styles.barPct}>{d.total > 0 ? d.total : ''}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${pct * 100}%`, backgroundColor: isToday ? COLORS.gold : COLORS.gold + '66' }]} />
                  </View>
                  <Text style={[styles.barLabel, isToday && { color: COLORS.gold }]}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="clock-time-five-outline" size={24} color={COLORS.gold} />
            <Text style={styles.summaryValue}>{totalPrayers}</Text>
            <Text style={styles.summaryLabel}>Namaz Kılındı</Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="circle-outline" size={24} color={COLORS.gold} />
            <Text style={styles.summaryValue}>{totalDhikr}</Text>
            <Text style={styles.summaryLabel}>Zikir Yapıldı</Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="fire" size={24} color={COLORS.gold} />
            <Text style={styles.summaryValue}>
              {weekDays.filter(d => d.count > 0).length}
            </Text>
            <Text style={styles.summaryLabel}>Aktif Gün</Text>
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
  rangeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  rangeText: { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '600' },
  statCard: { backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  statTitle: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  statMain: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xxl, fontWeight: '700' },
  statSub: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  rateBadge: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, borderColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  rateBadgeText: { color: COLORS.gold, fontSize: FONT_SIZE.md, fontWeight: '700' },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  lineChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90, marginTop: SPACING.md },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  lineCol: { flex: 1, alignItems: 'center', gap: 4 },
  barPct: { color: COLORS.textMuted, fontSize: 9 },
  barTrack: { width: 26, height: 70, backgroundColor: COLORS.cardBorder, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  summaryCard: { flex: 1, backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', gap: SPACING.xs },
  summaryValue: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  summaryLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, textAlign: 'center' },
});
