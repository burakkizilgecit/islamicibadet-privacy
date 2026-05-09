import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { usePrayerStore } from '../store/usePrayerStore';
import { useDhikrStore } from '../store/useDhikrStore';
import { useGoalsStore } from '../store/useGoalsStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useNotificationStore } from '../store/useNotificationStore';
import {
  setupNotificationChannel,
  setupNotificationHandler,
  requestNotificationPermission,
  scheduleAllNotifications,
} from '../services/notificationService';

export default function RootLayout() {
  const loadCompletion   = usePrayerStore(s => s.loadCompletion);
  const loadDhikr        = useDhikrStore(s => s.loadData);
  const loadGoals        = useGoalsStore(s => s.loadGoals);
  const loadSettings     = useSettingsStore(s => s.loadSettings);
  const loadNotifications = useNotificationStore(s => s.loadNotifications);
  const location         = usePrayerStore(s => s.location);
  const settings         = useSettingsStore(s => s.settings);
  const notifListener    = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Load persisted data
    loadCompletion();
    loadDhikr();
    loadGoals();
    loadSettings();
    loadNotifications();

    // Set up notification infrastructure
    setupNotificationHandler();
    setupNotificationChannel();

    // Handle notification taps
    notifListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      // Could navigate to relevant screen here
    });

    // Request permission
    requestNotificationPermission();

    return () => { notifListener.current?.remove(); };
  }, []);

  // Reschedule notifications when location or settings change
  useEffect(() => {
    if (!location) return;
    scheduleAllNotifications(location.lat, location.lng, settings).catch(() => {});
  }, [location?.lat, location?.lng, settings.notifications, settings.silentHours]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="worship-tracking" />
        <Stack.Screen name="islamic-calendar" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="achievements" />
        <Stack.Screen name="statistics" />
        <Stack.Screen name="daily-goals" />
        <Stack.Screen name="upcoming-events" />
        <Stack.Screen name="quran" />
        <Stack.Screen name="quran-surah" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
