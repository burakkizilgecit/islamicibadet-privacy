import { create } from 'zustand';
import { saveData, loadData } from '../services/storageService';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'prayer' | 'hadith' | 'dua' | 'dhikr' | 'event';
  timestamp: number;
  read: boolean;
}

interface NotificationStore {
  notifications: AppNotification[];
  loadNotifications: () => Promise<void>;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  getUnreadCount: () => number;
  generateDailyIfNeeded: (hadithText: string, duaTitle: string) => void;
}

const KEY = 'app_notifications';
const DAILY_KEY = 'last_daily_gen';

const save = (notifications: AppNotification[]) =>
  saveData(KEY, notifications.slice(0, 50)); // keep last 50

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  loadNotifications: async () => {
    const data = await loadData<AppNotification[]>(KEY);
    if (data) set({ notifications: data });
  },

  addNotification: (n) => {
    const newNotif: AppNotification = {
      ...n,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      read: false,
    };
    const updated = [newNotif, ...get().notifications];
    set({ notifications: updated });
    save(updated);
  },

  markRead: (id) => {
    const updated = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
    set({ notifications: updated });
    save(updated);
  },

  markAllRead: () => {
    const updated = get().notifications.map(n => ({ ...n, read: true }));
    set({ notifications: updated });
    save(updated);
  },

  getUnreadCount: () => get().notifications.filter(n => !n.read).length,

  generateDailyIfNeeded: (hadithText, duaTitle) => {
    const todayKey = new Date().toISOString().split('T')[0];
    loadData<string>(DAILY_KEY).then(lastDay => {
      if (lastDay === todayKey) return; // already generated today
      saveData(DAILY_KEY, todayKey);

      const { addNotification } = get();
      addNotification({
        type: 'hadith',
        title: '📖 Günün Hadisi',
        body: hadithText.length > 100 ? hadithText.slice(0, 97) + '...' : hadithText,
      });
      addNotification({
        type: 'dua',
        title: '🤲 Günün Duası',
        body: duaTitle,
      });
      addNotification({
        type: 'prayer',
        title: '🕌 Namaz Vakitleri',
        body: 'Bugünün namaz vakitleri güncellendi. Vakitleri kaçırmayın.',
      });
    });
  },
}));
