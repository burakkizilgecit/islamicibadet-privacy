import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, ImageBackground, Dimensions,
  Modal, FlatList, Share,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import ShareCard from '../../components/ShareCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { formatPrayerTime, getNextPrayer, getCountdown } from '../../services/prayerService';
import { formatGregorianDate, formatHijriDate, DAYS_TR } from '../../services/hijriService';
import { getDailyHadith } from '../../data/hadiths';
import { getDailyDua } from '../../data/duas';

const NOTIF_ICONS: Record<string, string> = {
  prayer: 'clock-time-five-outline',
  hadith: 'format-quote-close',
  dua: 'hands-pray',
  dhikr: 'circle-outline',
  event: 'calendar-star',
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Az önce';
  if (m < 60) return `${m}dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}sa önce`;
  return `${Math.floor(h / 24)}g önce`;
}

const { width } = Dimensions.get('window');

const MOSQUE_DAY = require('../../assets/images/mosque-day.png');
const MOSQUE_NIGHT = require('../../assets/images/mosque-night.png');

const PRAYER_ICONS: Record<string, string> = {
  fajr: 'weather-night', sunrise: 'weather-sunset-up',
  dhuhr: 'weather-sunny', asr: 'weather-partly-cloudy',
  maghrib: 'weather-sunset-down', isha: 'moon-waning-crescent',
};

const PRAYER_LABELS: Record<string, string> = {
  fajr: 'Sabah', sunrise: 'Güneş', dhuhr: 'Öğle',
  asr: 'İkindi', maghrib: 'Akşam', isha: 'Yatsı',
};

export default function HomeScreen() {
  const { prayerTimes, location, setLocation, loadCompletion, togglePrayer, getTodayCompletion } = usePrayerStore();
  const { notifications, loadNotifications, markRead, markAllRead, getUnreadCount, generateDailyIfNeeded } = useNotificationStore();
  const [countdown, setCountdown] = useState('--:--:--');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);
  const [shareData, setShareData] = useState<any>(null);
  const shareCardRef = useRef<ViewShot>(null);
  const unreadCount = getUnreadCount();

  const captureAndShare = async () => {
    try {
      const uri = await shareCardRef.current?.capture?.();
      if (!uri) return;
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Paylaş' });
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          await MediaLibrary.saveToLibraryAsync(uri);
        }
      }
    } catch {}
    setShareData(null);
  };
  const hadith = getDailyHadith();
  const dua = getDailyDua();
  const now = new Date();
  const hour = now.getHours();
  const isNight = hour >= 18 || hour < 6;
  const mosqueImage = isNight ? MOSQUE_NIGHT : MOSQUE_DAY;
  const completion = getTodayCompletion();
  const todayKey = now.toISOString().split('T')[0];

  useEffect(() => {
    loadCompletion();
    loadNotifications();
    generateDailyIfNeeded(hadith.text, dua.title);
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          const city = geo[0]?.city ?? geo[0]?.region ?? 'Bilinmiyor';
          setLocation(loc.coords.latitude, loc.coords.longitude, city);
        } else {
          setLocation(41.0082, 28.9784, 'İstanbul');
        }
      } catch {
        setLocation(41.0082, 28.9784, 'İstanbul');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Restart interval whenever prayerTimes updates (location changes)
  useEffect(() => {
    if (!prayerTimes) return;
    const lat = location?.lat ?? 41.0082;
    const lng = location?.lng ?? 28.9784;

    const tick = () => {
      const n = getNextPrayer(prayerTimes, lat, lng);
      setNextPrayer(n);
      setCountdown(getCountdown(n.time));
    };

    tick(); // run immediately — no 1-second blank wait
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayerTimes]);

  const prayerKeys = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
  const toggleablePrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Notification Panel Modal */}
      <Modal visible={showNotifs} transparent animationType="fade" onRequestClose={() => setShowNotifs(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowNotifs(false)}>
          <View style={styles.notifPanel} onStartShouldSetResponder={() => true}>
            <View style={styles.notifPanelHeader}>
              <Text style={styles.notifPanelTitle}>Bildirimler</Text>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
                  <Text style={styles.markAllText}>Tümünü Oku</Text>
                </TouchableOpacity>
              )}
            </View>
            {notifications.length === 0 ? (
              <View style={styles.notifEmpty}>
                <Ionicons name="notifications-off-outline" size={40} color={COLORS.textMuted} />
                <Text style={styles.notifEmptyText}>Henüz bildirim yok</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                style={{ maxHeight: 420 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.notifItem, item.read && styles.notifItemRead]}
                    onPress={() => markRead(item.id)}
                  >
                    <View style={[styles.notifIconBox, item.read && { opacity: 0.5 }]}>
                      <MaterialCommunityIcons name={NOTIF_ICONS[item.type] as any} size={20} color={COLORS.gold} />
                    </View>
                    <View style={styles.notifContent}>
                      <Text style={[styles.notifTitle, item.read && { color: COLORS.textMuted }]}>{item.title}</Text>
                      <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
                      <Text style={styles.notifTime}>{timeAgo(item.timestamp)}</Text>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.cardBorder }} />}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero with mosque background */}
        <ImageBackground source={mosqueImage} style={styles.hero} resizeMode="cover">
          <View style={styles.heroOverlay}>
            <SafeAreaView edges={['top']}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerBtn} />
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color={COLORS.gold} />
                  <Text style={styles.cityText}>{location?.city ?? '...'}</Text>
                  <Ionicons name="chevron-down" size={14} color={COLORS.gold} />
                </View>
                <TouchableOpacity style={styles.headerBtn} onPress={() => setShowNotifs(true)}>
                  <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Date */}
              <View style={styles.dateContainer}>
                <Text style={styles.dayText}>{DAYS_TR[now.getDay()]}</Text>
                <Text style={styles.dateText}>{formatGregorianDate(now)}</Text>
                <Text style={styles.hijriText}>{formatHijriDate(now)}</Text>
              </View>

              {/* Next Prayer Card — countdown is the hero */}
              <View style={styles.nextPrayerCard}>
                {loading ? (
                  <ActivityIndicator color={COLORS.gold} size="large" />
                ) : (
                  <>
                    <View style={styles.nextPrayerLeft}>
                      <View style={styles.nextPrayerIconBox}>
                        <MaterialCommunityIcons
                          name={isNight ? 'moon-waning-crescent' : 'weather-sunny'}
                          size={20} color={COLORS.gold}
                        />
                      </View>
                      <View>
                        <Text style={styles.nextPrayerLabel}>SIRADAKI NAMAZ</Text>
                        <Text style={styles.nextPrayerName}>
                          {nextPrayer ? `${nextPrayer.name} Namazı'na` : 'Tüm Namazlar Kılındı'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.countdownBox}>
                      <Text style={styles.countdownText}>{countdown}</Text>
                      <Text style={styles.countdownLabel}>K A L D I</Text>
                    </View>
                  </>
                )}
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>

        {/* Prayer Times */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Namaz Vakitleri</Text>
          <View style={styles.card}>
            {prayerKeys.map((key, i) => {
              const time = prayerTimes?.[key];
              const isPast = time ? time < now : false;
              const isNext = nextPrayer?.name === PRAYER_LABELS[key];
              const isToggleable = toggleablePrayers.includes(key as any);
              const isDone = isToggleable && completion[key as keyof typeof completion];

              return (
                <View key={key} style={[styles.prayerRow, isNext && styles.prayerRowActive, i < 5 && styles.prayerRowBorder]}>
                  <View style={styles.prayerLeft}>
                    <MaterialCommunityIcons
                      name={PRAYER_ICONS[key] as any}
                      size={20}
                      color={isNext ? COLORS.gold : isPast ? COLORS.textMuted : COLORS.textSecondary}
                    />
                    <Text style={[styles.prayerName, isNext && { color: COLORS.gold }, isPast && !isNext && { color: COLORS.textMuted }]}>
                      {PRAYER_LABELS[key]}
                    </Text>
                  </View>
                  <View style={styles.prayerRight}>
                    <Text style={[styles.prayerTime, isNext && { color: COLORS.gold }, isPast && !isNext && { color: COLORS.textMuted }]}>
                      {time ? formatPrayerTime(time) : '--:--'}
                    </Text>
                    {isToggleable ? (
                      <TouchableOpacity onPress={() => togglePrayer(todayKey, key as any)} style={{ marginLeft: SPACING.sm }}>
                        <Ionicons
                          name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
                          size={22}
                          color={isDone ? COLORS.green : COLORS.textMuted}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name="notifications-outline" size={18} color={COLORS.textMuted} style={{ marginLeft: SPACING.sm }} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Daily Hadith */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <MaterialIcons name="format-quote" size={20} color={COLORS.gold} />
              <Text style={styles.infoCardTitle}>Günün Hadisi</Text>
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => setShareData({ type: 'hadith', text: hadith.text, source: hadith.source })}
              >
                <Ionicons name="share-social-outline" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.infoCardText}>"{hadith.text}"</Text>
            <Text style={styles.infoCardSource}>({hadith.source})</Text>
          </View>
        </View>

        {/* Daily Dua */}
        <View style={[styles.section, { marginBottom: SPACING.xl }]}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <MaterialCommunityIcons name="hands-pray" size={20} color={COLORS.gold} />
              <Text style={styles.infoCardTitle}>Günün Duası</Text>
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => setShareData({ type: 'dua', title: dua.title, arabic: dua.arabic, turkish: dua.turkish, source: dua.source })}
              >
                <Ionicons name="share-social-outline" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.infoCardTitle2}>{dua.title}</Text>
            <Text style={styles.arabicText}>{dua.arabic}</Text>
            <Text style={styles.infoCardText}>{dua.turkish}</Text>
            <Text style={styles.infoCardSource}>({dua.source})</Text>
          </View>
        </View>

        {/* Share Preview Modal */}
        {shareData && (
          <Modal visible transparent animationType="fade" onRequestClose={() => setShareData(null)}>
            <View style={styles.shareModalBg}>
              <View style={styles.shareModalContent}>
                <Text style={styles.shareModalTitle}>Paylaşım Önizlemesi</Text>
                <ViewShot ref={shareCardRef} options={{ format: 'png', quality: 1 }}>
                  <ShareCard data={shareData} />
                </ViewShot>
                <View style={styles.shareModalBtns}>
                  <TouchableOpacity style={styles.shareCancelBtn} onPress={() => setShareData(null)}>
                    <Text style={styles.shareCancelText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareConfirmBtn} onPress={captureAndShare}>
                    <Ionicons name="share-social" size={18} color={COLORS.background} />
                    <Text style={styles.shareConfirmText}>Paylaş</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: { width, minHeight: 340 },
  heroOverlay: {
    flex: 1, minHeight: 340,
    backgroundColor: 'rgba(5,8,18,0.62)',
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2,
  },
  headerBtn: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cityText: { color: COLORS.textPrimary, fontSize: FONT_SIZE.lg, fontWeight: '700', letterSpacing: 0.3 },

  // Date block
  dateContainer: { alignItems: 'center', paddingTop: SPACING.sm, paddingBottom: SPACING.lg },
  dayText:   { color: 'rgba(255,255,255,0.55)', fontSize: FONT_SIZE.xs, letterSpacing: 2, textTransform: 'uppercase' },
  dateText:  { color: COLORS.textPrimary, fontSize: FONT_SIZE.xxl, fontWeight: '700', marginVertical: 3, letterSpacing: 0.3 },
  hijriText: { color: COLORS.gold, fontSize: FONT_SIZE.sm, letterSpacing: 0.5, opacity: 0.9 },

  // Next prayer card — full-width, prominent
  nextPrayerCard: {
    marginHorizontal: SPACING.md,
    backgroundColor: 'rgba(8,12,22,0.82)',
    borderColor: 'rgba(212,168,75,0.35)',
    borderWidth: 1,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
    overflow: 'hidden',
  },
  nextPrayerLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  nextPrayerName:  { color: COLORS.textPrimary, fontSize: FONT_SIZE.lg, fontWeight: '700', marginBottom: SPACING.sm },
  nextPrayerLeft:  { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  nextPrayerIconBox: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(212,168,75,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  countdownBox:  { alignItems: 'flex-end', marginTop: 4 },
  countdownText: {
    color: COLORS.gold,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  countdownLabel: { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, letterSpacing: 1, marginTop: 2 },

  // ── Body sections ─────────────────────────────────────────────────────────
  section:      { paddingHorizontal: SPACING.md, marginTop: SPACING.lg },
  sectionTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: SPACING.sm },

  // Prayer list card
  card: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.cardBorder, borderWidth: 1,
    borderRadius: RADIUS.xl, overflow: 'hidden',
  },
  prayerRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: 14 },
  prayerRowBorder: { borderBottomColor: COLORS.cardBorder, borderBottomWidth: 1 },
  prayerRowActive: { backgroundColor: COLORS.goldGlow },
  prayerLeft:  { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm + 2 },
  prayerName:  { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '500' },
  prayerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  prayerTime:  { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '700', fontVariant: ['tabular-nums'] },

  // Info cards — hadith & dua
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.cardBorder, borderWidth: 1,
    borderRadius: RADIUS.xl, padding: SPACING.lg,
    borderLeftColor: COLORS.gold, borderLeftWidth: 3,
  },
  infoCardHeader:  { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  infoCardTitle:   { color: COLORS.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, flex: 1 },
  infoCardTitle2:  { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '700', marginBottom: SPACING.sm },
  infoCardText:    { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, lineHeight: 22 },
  arabicText:      { color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, lineHeight: 38, textAlign: 'right', marginVertical: SPACING.sm, fontWeight: '300' },
  infoCardSource:  { color: COLORS.textMuted, fontSize: FONT_SIZE.xs, marginTop: SPACING.sm, letterSpacing: 0.3 },
  shareBtn:        { padding: 6, marginLeft: 'auto' as any },

  // ── Notification panel ────────────────────────────────────────────────────
  badge:          { position: 'absolute', top: 6, right: 6, minWidth: 15, height: 15, borderRadius: 8, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText:      { color: '#fff', fontSize: 9, fontWeight: '800' },
  modalBackdrop:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  notifPanel:     { margin: SPACING.md, marginTop: 90, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.cardBorderActive, overflow: 'hidden' },
  notifPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder },
  notifPanelTitle: { color: COLORS.textPrimary, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  markAllBtn:     { paddingHorizontal: SPACING.sm, paddingVertical: 5, backgroundColor: COLORS.goldGlow, borderRadius: RADIUS.full },
  markAllText:    { color: COLORS.gold, fontSize: FONT_SIZE.xs, fontWeight: '700' },
  notifEmpty:     { alignItems: 'center', padding: SPACING.xl, gap: SPACING.sm },
  notifEmptyText: { color: COLORS.textMuted, fontSize: FONT_SIZE.sm },
  notifItem:      { flexDirection: 'row', alignItems: 'flex-start', padding: SPACING.md, gap: SPACING.sm, backgroundColor: 'rgba(212,168,75,0.04)' },
  notifItemRead:  { backgroundColor: 'transparent' },
  notifIconBox:   { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.goldGlow, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifContent:   { flex: 1 },
  notifTitle:     { color: COLORS.textPrimary, fontSize: FONT_SIZE.sm, fontWeight: '700', marginBottom: 2 },
  notifBody:      { color: COLORS.textSecondary, fontSize: FONT_SIZE.xs, lineHeight: 17 },
  notifTime:      { color: COLORS.textMuted, fontSize: 10, marginTop: 4 },
  unreadDot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.gold, marginTop: 5, flexShrink: 0 },

  // ── Share modal ───────────────────────────────────────────────────────────
  shareModalBg:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: SPACING.md },
  shareModalContent: { width: '100%', alignItems: 'center', gap: SPACING.md },
  shareModalTitle:   { color: COLORS.textPrimary, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  shareModalBtns:    { flexDirection: 'row', gap: SPACING.sm, width: '100%' },
  shareCancelBtn:    { flex: 1, paddingVertical: SPACING.sm + 4, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorderActive },
  shareCancelText:   { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  shareConfirmBtn:   { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: SPACING.sm + 4, borderRadius: RADIUS.lg, backgroundColor: COLORS.gold },
  shareConfirmText:  { color: COLORS.background, fontSize: FONT_SIZE.md, fontWeight: '800' },
});
