import { create } from 'zustand';
import { saveData, loadData, STORAGE_KEYS } from '../services/storageService';

export interface Goal {
  id: string;
  title: string;
  target: number;
  unit: string;
  progress: number;
  icon: string;
}

const DEFAULT_GOALS: Goal[] = [
  { id: 'dhikr', title: 'Zikir Yap', target: 100, unit: 'tespih', progress: 0, icon: 'grain' },
  { id: 'quran', title: "Kur'an Oku", target: 30, unit: 'dk', progress: 0, icon: 'menu-book' },
  { id: 'dua', title: 'Dua Et', target: 3, unit: 'dua', progress: 0, icon: 'self-improvement' },
  { id: 'sadaka', title: 'Sadaka Ver', target: 1, unit: 'kez', progress: 0, icon: 'volunteer-activism' },
];

interface GoalsStore {
  goals: Goal[];
  updateProgress: (id: string, amount: number) => void;
  setTarget: (id: string, target: number) => void;
  resetDaily: () => void;
  loadGoals: () => Promise<void>;
  getCompletionRate: () => number;
}

export const useGoalsStore = create<GoalsStore>((set, get) => ({
  goals: DEFAULT_GOALS,

  updateProgress: (id, amount) => {
    const goals = get().goals.map(g =>
      g.id === id ? { ...g, progress: Math.min(g.target, g.progress + amount) } : g
    );
    set({ goals });
    saveData(STORAGE_KEYS.DAILY_GOALS, goals);
  },

  setTarget: (id, target) => {
    const goals = get().goals.map(g => g.id === id ? { ...g, target } : g);
    set({ goals });
    saveData(STORAGE_KEYS.DAILY_GOALS, goals);
  },

  resetDaily: () => {
    const goals = get().goals.map(g => ({ ...g, progress: 0 }));
    set({ goals });
    saveData(STORAGE_KEYS.DAILY_GOALS, goals);
  },

  loadGoals: async () => {
    const data = await loadData<Goal[]>(STORAGE_KEYS.DAILY_GOALS);
    if (data) set({ goals: data });
  },

  getCompletionRate: () => {
    const goals = get().goals;
    const completed = goals.filter(g => g.progress >= g.target).length;
    return Math.round((completed / goals.length) * 100);
  },
}));
