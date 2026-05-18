import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FONT_SIZE, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';

interface TabConfig {
  route: string;
  labelKey: string;
  iconName: { active: string; inactive: string; lib: 'ion' | 'mci' };
}

const TABS: TabConfig[] = [
  { route: 'index',        labelKey: 'tabHome',   iconName: { active: 'home',         inactive: 'home-outline',              lib: 'ion' } },
  { route: 'prayer-times', labelKey: 'tabPrayer', iconName: { active: 'clock-time-five', inactive: 'clock-time-five-outline', lib: 'mci' } },
  { route: 'qibla',        labelKey: 'tabQibla',  iconName: { active: 'compass',       inactive: 'compass-outline',           lib: 'ion' } },
  { route: 'dhikr',        labelKey: 'tabDhikr',  iconName: { active: 'circle-outline',inactive: 'circle-outline',           lib: 'mci' } },
  { route: 'mosques',      labelKey: 'tabMosques',iconName: { active: 'mosque',        inactive: 'mosque',                    lib: 'mci' } },
  { route: 'more',         labelKey: 'tabMenu',   iconName: { active: 'apps',          inactive: 'apps-outline',              lib: 'ion' } },
];

function TabItem({ tab, isActive, onPress, label }: { tab: TabConfig; isActive: boolean; onPress: () => void; label: string }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dotAnim   = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(dotAnim, { toValue: isActive ? 1 : 0, useNativeDriver: true, tension: 120, friction: 8 }),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: isActive ? 1.12 : 1, duration: 120, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200 }),
      ]),
    ]).start();
  }, [isActive]);

  const iconColor = isActive ? colors.tabActive : colors.tabInactive;
  const iconName  = isActive ? tab.iconName.active : tab.iconName.inactive;

  return (
    <TouchableOpacity style={styles.tab} onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[
        styles.iconWrap,
        { transform: [{ scale: scaleAnim }] },
        isActive && { backgroundColor: colors.goldGlow },
      ]}>
        {tab.iconName.lib === 'mci'
          ? <MaterialCommunityIcons name={iconName as any} size={22} color={iconColor} />
          : <Ionicons name={iconName as any} size={22} color={iconColor} />
        }
      </Animated.View>
      <Text style={[styles.label, { color: colors.tabInactive }, isActive && { color: colors.tabActive, fontWeight: '700' }]} numberOfLines={1}>{label}</Text>
      <Animated.View style={[styles.dot, { backgroundColor: colors.tabActive, opacity: dotAnim, transform: [{ scaleX: dotAnim }] }]} />
    </TouchableOpacity>
  );
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const visibleRoutes = state.routes.filter(r => TABS.some(t => t.route === r.name));

  return (
    <View style={[styles.container, { backgroundColor: colors.tabBar, paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {visibleRoutes.map((route) => {
          const tab = TABS.find(t => t.route === route.name);
          if (!tab) return null;
          const isActive = state.routes[state.index].name === route.name;
          return (
            <TabItem
              key={route.key}
              tab={tab}
              label={t(tab.labelKey as any)}
              isActive={isActive}
              onPress={() => { if (!isActive) navigation.navigate(route.name); }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(30,42,64,0.8)',
    ...SHADOWS.md,
  },
  bar: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingBottom: 4,
  },
  iconWrap: {
    width: 40,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  dot: {
    width: 16,
    height: 3,
    borderRadius: 2,
    marginTop: 1,
  },
});
