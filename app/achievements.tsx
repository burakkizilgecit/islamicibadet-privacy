import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme';
import { usePrayerStore, type PrayerCompletion } from '../store/usePrayerStore';
import { useDhikrStore, type DhikrHistory } from '../store/useDhikrStore';

// ── Calculation helpers ────────────────────────────────────────────────────

function prayerStreak(completion: PrayerCompletion, prayer: string): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const day = completion[key] as any;
    if (day?.[prayer]) streak++;
    else break;
  }
  return streak;
}

function anyPrayerStreak(completion: PrayerCompletion): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const day = completion[key];
    const hasAny = day && Object.values(day).some(Boolean);
    if (hasAny) streak++;
    else break;
  }
  return streak;
}

function totalPrayersEver(completion: PrayerCompletion): number {
  let n = 0;
  for (const day of Object.values(completion)) {
    n += Object.values(day).filter(Boolean).length;
  }
  return n;
}

function activeDays(completion: PrayerCompletion): number {
  return Object.values(completion).filter(day => Object.values(day).some(Boolean)).length;
}

function totalDhikrById(history: DhikrHistory, id: string): number {
  let n = 0;
  for (const day of Object.values(history)) {
    n += (day as any)[id] ?? 0;
  }
  return n;
}

function totalDhikrAll(history: DhikrHistory): number {
  let n = 0;
  for (const day of Object.values(history)) {
    n += Object.values(day as any).reduce((a: number, b: any) => a + (b as number), 0);
  }
  return n;
}

function fridayStreak(completion: PrayerCompletion): number {
  let count = 0;
  const today = new Date();
  // go back up to 8 weeks, check each Friday
  for (let w = 0; w < 8; w++) {
    const friday = new Date(today);
    const dayOfWeek = today.getDay(); // 0=Sun
    const daysToLastFriday = ((dayOfWeek + 7 - 5) % 7) + w * 7;
    friday.setDate(today.getDate() - daysToLastFriday);
    const key = friday.toISOString().split('T')[0];
    const day = completion[key];
    if (day && Object.values(day).some(Boolean)) count++;
    else break;
  }
  return count;
}

// ── Achievement definitions ────────────────────────────────────────────────

interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  category: string;
  xp: number;
  goal: number;
  getValue: (c: PrayerCompletion, h: DhikrHistory) => number;
}

const DEFS: AchievementDef[] = [
  {
    id: 'first_step', title: 'İlk Adım', icon: 'star', color: '#FFD700', category: 'Diğer', xp: 50, goal: 1,
    desc: 'Uygulamayı ilk kez kullandın',
    getValue: () => 1,
  },
  {
    id: 'fajr_7', title: 'Sabah Ustası', icon: 'weather-night', color: '#7B61FF', category: 'Namaz', xp: 100, goal: 7,
    desc: '7 gün üst üste sabah namazı kıl',
    getValue: (c) => prayerStreak(c, 'fajr'),
  },
  {
    id: 'asr_7', title: 'İkindi Ustası', icon: 'weather-partly-cloudy', color: '#2196F3', category: 'Namaz', xp: 100, goal: 7,
    desc: '7 gün üst üste ikindi namazı kıl',
    getValue: (c) => prayerStreak(c, 'asr'),
  },
  {
    id: 'isha_7', title: 'Gece Kuşu', icon: 'moon-waning-crescent', color: '#9C27B0', category: 'Namaz', xp: 100, goal: 7,
    desc: '7 gün üst üste yatsı namazı kıl',
    getValue: (c) => prayerStreak(c, 'isha'),
  },
  {
    id: 'prayers_50', title: 'Namaz Ehli', icon: 'mosque', color: COLORS.gold, category: 'Namaz', xp: 150, goal: 50,
    desc: 'Toplam 50 vakit namaz kıl',
    getValue: (c) => totalPrayersEver(c),
  },
  {
    id: 'prayers_200', title: 'Namaz Sultanı', icon: 'mosque', color: '#FF8C42', category: 'Namaz', xp: 300, goal: 200,
    desc: 'Toplam 200 vakit namaz kıl',
    getValue: (c) => totalPrayersEver(c),
  },
  {
    id: 'streak_30', title: 'Devam Eden', icon: 'fire', color: '#FF5722', category: 'Diğer', xp: 200, goal: 30,
    desc: '30 gün üst üste en az 1 namaz kıl',
    getValue: (c) => anyPrayerStreak(c),
  },
  {
    id: 'friday_4', title: 'Cuma Ustası', icon: 'calendar-check', color: '#4CAF50', category: 'Namaz', xp: 150, goal: 4,
    desc: '4 hafta üst üste Cuma namazı kıl',
    getValue: (c) => fridayStreak(c),
  },
  {
    id: 'active_7', title: 'Haftalık Kahraman', icon: 'shield-star', color: '#00BCD4', category: 'Diğer', xp: 100, goal: 7,
    desc: '7 farklı gün namaz kıl',
    getValue: (c) => Math.min(activeDays(c), 7),
  },
  {
    id: 'dhikr_100', title: 'Zikir Sever', icon: 'circle-outline', color: COLORS.gold, category: 'Zikir', xp: 75, goal: 100,
    desc: 'Toplam 100 tespih çek',
    getValue: (_, h) => totalDhikrById(h, 'subhanallah'),
  },
  {
    id: 'dhikr_500', title: 'Zikir Sever II', icon: 'circle-double', color: '#C8A853', category: 'Zikir', xp: 150, goal: 500,
    desc: 'Toplam 500 tespih çek',
    getValue: (_, h) => totalDhikrById(h, 'subhanallah'),
  },
  {
    id: 'salavat_100', title: 'Salavat Yolcusu', icon: 'rotate-right', color: '#FF8C42', category: 'Zikir', xp: 100, goal: 100,
    desc: 'Toplam 100 salavat getir',
    getValue: (_, h) => totalDhikrById(h, 'salavat'),
  },
  {
    id: 'istigfar_100', title: 'İstiğfar Ehli', icon: 'hands-pray', color: '#E91E63', category: 'Zikir', xp: 100, goal: 100,
    desc: 'Toplam 100 istiğfar çek',
    getValue: (_, h) => totalDhikrById(h, 'istigfar'),
  },
  {
    id: 'dhikr_total_1000', title: 'Zikir Sultanı', icon: 'star-circle', color: '#FFD700', category: 'Zikir', xp: 300, goal: 1000,
    desc: 'Toplam 1000 zikir yap',
    getValue: (_, h) => totalDhikrAll(h),
  },
];

const FILTER_TABS = ['Tümü', 'Namaz', 'Zikir', 'Diğer'];

const XP_LEVELS = [
  { level: 1, title: 'Başlangıç',       min: 0 },
  { level: 2, title: 'Öğrenci',         min: 100 },
  { level: 3, title: 'İbadet Yolcusu',  min: 300 },
  { level: 4, title: 'Mümin',           min: 600 },
  { level: 5, title: 'Takva Sahibi',    min: 1000 },
  { level: 6, title: 'İbadet Ehli',     min: 1500 },
  { level: 7, title: 'Sıddık',          min: 2200 },
];

function getLevel(xp: number) {
  let cur = XP_LEVELS[0];
  for (const l of XP_LEVELS) { if (xp >= l.min) cur = l; else break; }
  const idx = XP_LEVELS.indexOf(cur);
  const next = XP_LEVELS[idx + 1];
  const progress = next ? (xp - cur.min) / (next.min - cur.min) : 1;
  return { ...cur, next: next?.min ?? cur.min, progress };
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { completion } = usePrayerStore();
  const { history } = useDhikrStore();
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [detail, setDetail] = useState<(typeof DEFS)[0] | null>(null);

  const achievements = useMemo(() =>
    DEFS.map(def => {
      const current = Math.min(def.getValue(completion, history), def.goal);
      const unlocked = current >= def.goal;
      return { ...def, current, unlocked, pct: Math.round((current / def.goal) * 100) };
    }),
  [completion, history]);

  const filtered = activeFilter === 'Tümü' ? achievements : achievements.filter(a => a.category === activeFilter);
  const unlockedList = achievements.filter(a => a.unlocked);
  const totalXP = unlockedList.reduce((s, a) => s + a.xp, 0);
  const levelInfo = getLevel(totalXP);

  const detailItem = detail ? achievements.find(a => a.id === detail.id) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Detail Modal */}
      <Modal visible={!!detailItem} transparent animationType="fade" onRequestClose={() => setDetail(null)}>
        <TouchableOpacity style={styles.modalBack} activeOpacity={1} onPress={() => setDetail(null)}>
          <View style={styles.detailCard} onStartShouldSetResponder={() => true}>
            {detailItem && (
              <>
                <View style={[styles.detailIconBox, { backgroundColor: detailItem.color + '22' }]}>
                  <MaterialCommunityIcons name={detailItem.icon as any} size={48} color={detailItem.unlocked ? detailItem.color : COLORS.textMuted} />
                  {!detailItem.unlocked && <View style={styles.lockBadge}><Ionicons name="lock-closed" size={16} color={COLORS.textMuted} /></View>}
                </View>
                <Text style={styles.detailTitle}>{detailItem.title}</Text>
                <Text style={styles.detailDesc}>{detailItem.desc}</Text>
                <View style={styles.detailProgressRow}>
                  <Text style={styles.detailProgressText}>{detailItem.current} / {detailItem.goal}</Text>
                  <Text style={[styles.detailXP, { color: detailItem.color }]}>+{detailItem.xp} XP</Text>
                </View>
                <View style={styles.detailBar}>
                  <View style={[styles.detailFill, { width: `${detailItem.pct}%`, backgroundColor: detailItem.color }]} />
                </View>
                <Text style={styles.detailPct}>%{detailItem.pct} tamamlandı</Text>
                {detailItem.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
                    <Text style={styles.unlockedText}>Kazanıldı!</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Başarımlar</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Level card */}
      <View style={styles.levelCard}>
        <View style={styles.hexWrap}>
          <MaterialCommunityIcons name="hexagon" size={64} color={COLORS.gold} />
          <Text style={styles.hexLevel}>{levelInfo.level}</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>{levelInfo.title}</Text>
          <Text style={styles.levelSub}>Seviye {levelInfo.level}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${Math.round(levelInfo.progress * 100)}%` }]} />
          </View>
          <Text style={styles.xpText}>{totalXP} XP{levelInfo.next > totalXP ? ` / ${levelInfo.next} XP` : ' — Maks Seviye'}</Text>
        </View>
        <View style={styles.xpSummary}>
          <Text style={styles.xpSummaryVal}>{unlockedList.length}</Text>
          <Text style={styles.xpSummaryLabel}>rozet</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>{unlockedList.length} / {DEFS.length} rozet açıldı</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(unlockedList.length / DEFS.length) * 100}%` }]} />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterLabel, activeFilter === tab && styles.filterLabelActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        numColumns={3}
        keyExtractor={a => a.id}
        contentContainerStyle={{ padding: SPACING.sm, paddingBottom: SPACING.xl }}
        columnWrapperStyle={{ gap: SPACING.sm, marginBottom: SPACING.sm }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.cell, !item.unlocked && styles.cellLocked]}
            onPress={() => setDetail(item)}
            activeOpacity={0.75}
          >
            <View style={[styles.cellIcon, { backgroundColor: item.unlocked ? item.color + '30' : COLORS.cardBorder }]}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={28}
                color={item.unlocked ? item.color : COLORS.textMuted}
              />
              {!item.unlocked && (
                <View style={styles.lockOverlay}>
                  <Ionicons name="lock-closed" size={12} color={COLORS.textMuted} />
                </View>
              )}
            </View>
            <Text style={[styles.cellTitle, !item.unlocked && { color: COLORS.textMuted }]} numberOfLines={2}>
              {item.title}
            </Text>
            {/* Mini progress bar */}
            <View style={styles.miniBar}>
              <View style={[styles.miniFill, { width: `${item.pct}%`, backgroundColor: item.unlocked ? item.color : COLORS.gold }]} />
            </View>
            <Text style={styles.miniPct}>{item.pct}%</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.background },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  backBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle:{ color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },

  // Level card
  levelCard:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.md, backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.md, gap: SPACING.md, marginBottom: SPACING.sm },
  hexWrap:    { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  hexLevel:   { position: 'absolute', color: COLORS.background, fontSize: FONT_SIZE.xl, fontWeight: '900' },
  levelInfo:  { flex: 1 },
  levelTitle: { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '700' },
  levelSub:   { color: COLORS.gold, fontSize: FONT_SIZE.xs, marginBottom: SPACING.xs },
  xpBar:      { height: 8, backgroundColor: COLORS.cardBorder, borderRadius: 4, overflow: 'hidden', marginBottom: 3 },
  xpFill:     { height: '100%', backgroundColor: COLORS.gold, borderRadius: 4 },
  xpText:     { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  xpSummary:  { alignItems: 'center' },
  xpSummaryVal:   { color: COLORS.gold, fontSize: FONT_SIZE.xxl, fontWeight: '700' },
  xpSummaryLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },

  // Progress row
  progressRow:  { paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  progressText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs, marginBottom: 4 },
  progressTrack:{ height: 5, backgroundColor: COLORS.cardBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 3 },

  // Filters
  filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.xs, marginBottom: SPACING.sm },
  filterTab: { paddingHorizontal: SPACING.sm + 2, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1 },
  filterTabActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  filterLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs, fontWeight: '500' },
  filterLabelActive: { color: COLORS.background, fontWeight: '700' },

  // Grid cell
  cell:       { flex: 1, backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center', gap: 4 },
  cellLocked: { opacity: 0.65 },
  cellIcon:   { width: 56, height: 56, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  lockOverlay:{ position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.cardBg, borderRadius: 8, padding: 2 },
  cellTitle:  { color: COLORS.textPrimary, fontSize: FONT_SIZE.xs, fontWeight: '600', textAlign: 'center', lineHeight: 15 },
  miniBar:    { width: '100%', height: 4, backgroundColor: COLORS.cardBorder, borderRadius: 2, overflow: 'hidden' },
  miniFill:   { height: '100%', borderRadius: 2 },
  miniPct:    { color: COLORS.textMuted, fontSize: 9 },

  // Detail modal
  modalBack:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  detailCard:  { width: '90%', backgroundColor: COLORS.cardBg, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.cardBorder, padding: SPACING.lg, alignItems: 'center', gap: SPACING.sm },
  detailIconBox:   { width: 88, height: 88, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  lockBadge:       { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 3 },
  detailTitle:     { color: COLORS.textPrimary, fontSize: FONT_SIZE.lg, fontWeight: '700', textAlign: 'center' },
  detailDesc:      { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, textAlign: 'center' },
  detailProgressRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  detailProgressText:{ color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  detailXP:        { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  detailBar:       { width: '100%', height: 10, backgroundColor: COLORS.cardBorder, borderRadius: 5, overflow: 'hidden' },
  detailFill:      { height: '100%', borderRadius: 5 },
  detailPct:       { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  unlockedBadge:   { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  unlockedText:    { color: COLORS.green, fontSize: FONT_SIZE.sm, fontWeight: '700' },
});
