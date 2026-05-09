export const Colors = {
  light: { text: '#11181C', background: '#fff', tint: '#0a7ea4', icon: '#687076', tabIconDefault: '#687076', tabIconSelected: '#0a7ea4' },
  dark:  { text: '#ECEDEE', background: '#151718', tint: '#fff', icon: '#9BA1A6', tabIconDefault: '#9BA1A6', tabIconSelected: '#fff' },
};

export const COLORS = {
  // Backgrounds — layered depth system
  background:          '#080C16',
  backgroundSecondary: '#0C1020',
  surface:             '#111827',
  surfaceElevated:     '#172035',
  cardBg:              '#141B2D',
  cardBorder:          '#1E2A40',
  cardBorderActive:    '#2E3F60',

  // Brand
  gold:      '#D4A84B',
  goldLight: '#F0C060',
  goldDim:   '#A07830',
  goldGlow:  'rgba(212,168,75,0.18)',

  // Text
  textPrimary:   '#F8F9FC',
  textSecondary: '#8B95B0',
  textMuted:     '#4E5A75',
  textInverse:   '#080C16',

  // Status
  green:    '#34C759',
  greenBg:  'rgba(52,199,89,0.12)',
  red:      '#FF453A',
  redBg:    'rgba(255,69,58,0.12)',
  blue:     '#0A84FF',
  blueBg:   'rgba(10,132,255,0.12)',
  orange:   '#FF9F0A',
  orangeBg: 'rgba(255,159,10,0.12)',

  // Tab bar
  tabBar:     '#080C16',
  tabActive:  '#D4A84B',
  tabInactive:'#3A4560',
  overlay:    'rgba(0,0,0,0.6)',
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  36,
  xxl: 52,
};

export const RADIUS = {
  xs:   6,
  sm:   10,
  md:   14,
  lg:   18,
  xl:   24,
  xxl:  32,
  full: 999,
};

export const FONT_SIZE = {
  xs:   11,
  sm:   13,
  md:   15,
  lg:   17,
  xl:   20,
  xxl:  26,
  xxxl: 36,
  hero: 48,
};

export const FONT_WEIGHT: Record<string, '400'|'500'|'600'|'700'|'800'|'900'> = {
  regular:    '400',
  medium:     '500',
  semibold:   '600',
  bold:       '700',
  extrabold:  '800',
  black:      '900',
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 7,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 12,
  },
  gold: {
    shadowColor: '#D4A84B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};
