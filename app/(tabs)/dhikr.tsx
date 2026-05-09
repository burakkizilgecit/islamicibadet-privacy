import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Animated, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { useDhikrStore } from '../../store/useDhikrStore';

const CATEGORIES = [
  { id: 'tespih', label: 'Tespih' },
  { id: 'salavat', label: 'Salavat' },
  { id: 'istigfar', label: 'İstiğfar' },
  { id: 'diger', label: 'Diğer' },
] as const;

const R = 80;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function DhikrScreen() {
  const { items, activeCategory, increment, reset, setCategory, getTotalToday, loadData, getWeeklyHistory } = useDhikrStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0)).current;
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { loadData(); }, []);

  const filteredItems = items.filter(i => i.category === activeCategory);
  const mainItem = filteredItems[0];
  const total = getTotalToday();
  const weekHistory = getWeeklyHistory();
  const mainProgress = mainItem ? Math.min(mainItem.count / mainItem.target, 1) : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - mainProgress);

  const handleIncrement = async (id: string) => {
    increment(id);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Pulse animation on tap
    Animated.sequence([
      Animated.parallel([
        Animated.spring(pulseAnim, { toValue: 0.93, useNativeDriver: true, tension: 300, friction: 8 }),
        Animated.timing(glowAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 6 }),
        Animated.timing(glowAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zikirmatik</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistory(true)}>
          <MaterialCommunityIcons name="chart-bar" size={22} color={COLORS.gold} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabs}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, activeCategory === cat.id && styles.tabActive]}
            onPress={() => setCategory(cat.id)}
          >
            <Text style={[styles.tabLabel, activeCategory === cat.id && styles.tabLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Counter */}
        {mainItem && (
          <TouchableOpacity onPress={() => handleIncrement(mainItem.id)} activeOpacity={1}>
            <Animated.View style={[styles.counterArea, { transform: [{ scale: pulseAnim }] }]}>
              {/* Glow ring */}
              <Animated.View style={[styles.glowRing, { opacity: glowAnim }]} />
              <View style={styles.svgContainer}>
                <Svg width={220} height={220} viewBox="0 0 220 220">
                  {/* Track */}
                  <Circle cx="110" cy="110" r={R} stroke={COLORS.cardBorder} strokeWidth={12} fill="none" />
                  {/* Progress */}
                  <Circle
                    cx="110" cy="110" r={R}
                    stroke={COLORS.gold}
                    strokeWidth={12}
                    fill="none"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 110 110)"
                  />
                </Svg>
                <View style={styles.counterCenter}>
                  <Text style={styles.counterValue}>{mainItem.count}</Text>
                  <Text style={styles.counterLabel}>{mainItem.name.toUpperCase()}</Text>
                  <Text style={styles.counterTarget}>/ {mainItem.target}</Text>
                </View>
              </View>
              <Text style={styles.tapHint}>• DOKUNARAK ZİKİR YAP •</Text>
            </Animated.View>
          </TouchableOpacity>
        )}

        {/* Dhikr List */}
        <View style={styles.section}>
          {filteredItems.map((item, i) => (
            <View key={item.id} style={[styles.dhikrRow, i < filteredItems.length - 1 && styles.dhikrRowBorder]}>
              <Text style={styles.dhikrName}>{item.name}</Text>
              <View style={styles.dhikrControls}>
                <View style={styles.counterBadge}>
                  <Text style={[styles.dhikrCount, item.count >= item.target && { color: COLORS.green }]}>
                    {item.count}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.plusBtn}>
                  <Ionicons name="add" size={20} color={COLORS.background} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Reset Button */}
        <View style={{ paddingHorizontal: SPACING.md }}>
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Ionicons name="refresh" size={18} color={COLORS.textSecondary} />
            <Text style={styles.resetText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Record */}
        <View style={styles.weekSection}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>Haftalık Kayıt</Text>
            <Text style={styles.weekTotal}>Toplam: {total}</Text>
          </View>
          <View style={styles.weekBars}>
            {weekHistory.map((w, i) => {
              const maxVal = Math.max(...weekHistory.map(x => x.total), 1);
              const height = Math.max((w.total / maxVal) * 60, 4);
              return (
                <View key={i} style={styles.weekBarCol}>
                  <Text style={styles.weekBarValue}>{w.total > 0 ? w.total : ''}</Text>
                  <View style={styles.weekBarTrack}>
                    <View style={[styles.weekBarFill, { height }]} />
                  </View>
                  <Text style={styles.weekBarDay}>{w.day}</Text>
                </View>
              );
            })}
          </View>
          {total === 0 && (
            <View style={styles.reminderBanner}>
              <Ionicons name="notifications-outline" size={18} color={COLORS.gold} />
              <Text style={styles.reminderText}>Bugün zikir yapılmadı.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* History Modal */}
      <Modal visible={showHistory} transparent animationType="slide" onRequestClose={() => setShowHistory(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Haftalık Zikir Geçmişi</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)} style={styles.modalClose}>
                <Ionicons name="close" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBars}>
              {weekHistory.map((w, i) => {
                const maxVal = Math.max(...weekHistory.map(x => x.total), 1);
                const height = Math.max((w.total / maxVal) * 120, 4);
                return (
                  <View key={i} style={styles.modalBarCol}>
                    <Text style={styles.modalBarValue}>{w.total > 0 ? w.total : ''}</Text>
                    <View style={[styles.modalBarTrack, { height: 120 }]}>
                      <View style={[styles.weekBarFill, { height }]} />
                    </View>
                    <Text style={styles.weekBarDay}>{w.day}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.modalTotalRow}>
              <Text style={styles.modalTotalLabel}>Haftalık Toplam</Text>
              <Text style={styles.modalTotalValue}>{weekHistory.reduce((s, w) => s + w.total, 0)}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.background },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2 },
  headerTitle:{ color: COLORS.textPrimary, fontSize: FONT_SIZE.xxl, fontWeight: '800' },
  historyBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderColor: COLORS.cardBorderActive, borderWidth: 1 },

  tabs:           { flexDirection: 'row', marginHorizontal: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.full, padding: 4, borderColor: COLORS.cardBorderActive, borderWidth: 1, marginBottom: SPACING.md },
  tab:            { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: RADIUS.full },
  tabActive:      { backgroundColor: COLORS.gold },
  tabLabel:       { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  tabLabelActive: { color: COLORS.background, fontWeight: '800' },

  // Counter
  counterArea: { alignItems: 'center', paddingVertical: SPACING.sm, position: 'relative' },
  glowRing: {
    position: 'absolute',
    width: 230, height: 230,
    borderRadius: 115,
    backgroundColor: COLORS.goldGlow,
    top: '50%', alignSelf: 'center',
    marginTop: -115,
  },
  svgContainer:  { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  counterCenter: { position: 'absolute', alignItems: 'center' },
  counterValue:  { color: COLORS.textPrimary, fontSize: 52, fontWeight: '800', lineHeight: 58, fontVariant: ['tabular-nums'] },
  counterLabel:  { color: COLORS.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginTop: 2 },
  counterTarget: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, marginTop: 4, fontVariant: ['tabular-nums'] },
  tapHint:       { color: COLORS.textMuted, fontSize: 10, letterSpacing: 2, marginTop: SPACING.xs },

  // Dhikr list
  section:         { marginHorizontal: SPACING.md, backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.md },
  dhikrRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: 14 },
  dhikrRowBorder:  { borderBottomColor: COLORS.cardBorder, borderBottomWidth: 1 },
  dhikrName:       { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '500' },
  dhikrControls:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  counterBadge:    { minWidth: 50, alignItems: 'flex-end' },
  dhikrCount:      { color: COLORS.gold, fontSize: FONT_SIZE.xl, fontWeight: '800', fontVariant: ['tabular-nums'] },
  plusBtn:         { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },

  resetBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderColor: COLORS.cardBorderActive, borderWidth: 1, borderRadius: RADIUS.xl, paddingVertical: SPACING.sm + 4, marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  resetText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600' },

  // Weekly chart
  weekSection:   { marginHorizontal: SPACING.md, backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.xl },
  weekHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  weekTitle:     { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  weekTotal:     { color: COLORS.gold, fontSize: FONT_SIZE.sm, fontWeight: '700' },
  weekBars:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90 },
  weekBarCol:    { flex: 1, alignItems: 'center', gap: 4 },
  weekBarValue:  { color: COLORS.textMuted, fontSize: 9 },
  weekBarTrack:  { width: 22, height: 60, backgroundColor: COLORS.surface, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  weekBarFill:   { backgroundColor: COLORS.gold, borderRadius: 6, width: '100%' },
  weekBarDay:    { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  reminderBanner:{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.goldGlow, borderRadius: RADIUS.md, padding: SPACING.sm, marginTop: SPACING.sm },
  reminderText:  { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },

  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet:     { backgroundColor: COLORS.cardBg, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, paddingBottom: SPACING.xl },
  modalHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg },
  modalTitle:     { color: COLORS.textPrimary, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  modalClose:     { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  modalBars:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: SPACING.lg },
  modalBarCol:    { flex: 1, alignItems: 'center', gap: 4 },
  modalBarValue:  { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs, fontWeight: '600' },
  modalBarTrack:  { width: 28, backgroundColor: COLORS.surface, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  modalTotalRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(200,168,83,0.1)', borderRadius: RADIUS.md, padding: SPACING.md },
  modalTotalLabel:{ color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  modalTotalValue:{ color: COLORS.gold, fontSize: FONT_SIZE.lg, fontWeight: '800' },
});
