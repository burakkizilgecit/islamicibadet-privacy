import { create } from 'zustand';
import { saveData, loadData } from '../services/storageService';

const KEY = 'tutorial_completed';

interface TutorialStore {
  completed: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  complete: () => Promise<void>;
  reset: () => Promise<void>;
}

export const useTutorialStore = create<TutorialStore>((set) => ({
  completed: false,
  loaded: false,

  load: async () => {
    const val = await loadData<boolean>(KEY);
    set({ completed: val === true, loaded: true });
  },

  complete: async () => {
    await saveData(KEY, true);
    set({ completed: true });
  },

  reset: async () => {
    await saveData(KEY, false);
    set({ completed: false });
  },
}));
