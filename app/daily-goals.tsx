import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme';
import { useGoalsStore } from '../store/useGoalsStore';

export default function DailyGoalsScreen() {
  const router = useRouter();
  const { goals, setTarget, updateProgress } = useGoalsStore();
  const [targets, setTargets] = useState<Record<string, string>>(
    Object.fromEntries(goals.map(g => [g.id, String(g.target)]))
  );

  const handleSave = () => {
    Object.entries(targets).forEach(([id, val]) => {
      const num = parseInt(val);
      if (!isNaN(num) && num > 0) setTarget(id, num);
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Günlük Hedefler</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SPACING.md }}>
        <Text style={styles.hint}>Hedeflerini belirle, istikranı artır.</Text>

        <View style={styles.card}>
          {goals.map((goal, i) => {
            const progress = Math.min(goal.progress / goal.target, 1);
            return (
              <View key={goal.id} style={[styles.goalRow, i < goals.length - 1 && styles.goalRowBorder]}>
                <View style={styles.goalIconBox}>
                  <MaterialCommunityIcons name={goal.icon as any} size={24} color={COLORS.gold} />
                </View>
                <View style={styles.goalInfo}>
                  <View style={styles.goalTitleRow}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <TouchableOpacity style={styles.editBtn} onPress={() => updateProgress(goal.id, 1)}>
                      <Ionicons name="pencil-outline" size={14} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{goal.progress}/{goal.target}</Text>
                  </View>
                  <View style={styles.targetRow}>
                    <Text style={styles.targetLabel}>Hedef: </Text>
                    <TextInput
                      style={styles.targetInput}
                      value={targets[goal.id]}
                      onChangeText={v => setTargets(t => ({ ...t, [goal.id]: v }))}
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                    <Text style={styles.targetUnit}>{goal.unit}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '700' },
  hint: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, marginBottom: SPACING.md },
  card: { backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.lg },
  goalRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: SPACING.sm },
  goalRowBorder: { borderBottomColor: COLORS.cardBorder, borderBottomWidth: 1 },
  goalIconBox: { width: 44, height: 44, borderRadius: RADIUS.sm, backgroundColor: 'rgba(200,168,83,0.12)', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  goalInfo: { flex: 1 },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xs },
  goalTitle: { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '600' },
  editBtn: { padding: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  progressBar: { flex: 1, height: 6, backgroundColor: COLORS.cardBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 3 },
  progressText: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, minWidth: 40, textAlign: 'right' },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  targetLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  targetInput: { backgroundColor: COLORS.background, borderColor: COLORS.cardBorder, borderWidth: 1, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 3, color: COLORS.textPrimary, fontSize: FONT_SIZE.sm, minWidth: 50, textAlign: 'center' },
  targetUnit: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs },
  saveBtn: { backgroundColor: COLORS.gold, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  saveBtnText: { color: COLORS.background, fontSize: FONT_SIZE.md, fontWeight: '700' },
});
