import { I18nManager } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';
import { tr, type TKey } from './tr';
import { en } from './en';
import { ar } from './ar';

export type Language = 'tr' | 'en' | 'ar';

const maps: Record<Language, Record<TKey, string>> = { tr, en, ar };

export function useTranslation() {
  const language = (useSettingsStore(s => s.settings.language) ?? 'tr') as Language;
  const isRTL = language === 'ar';

  const t = (key: TKey, params?: Record<string, string | number>): string => {
    let str = maps[language]?.[key] ?? tr[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  return { t, language, isRTL };
}

export function applyRTL(language: Language) {
  const shouldBeRTL = language === 'ar';
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    return true;
  }
  return false;
}
