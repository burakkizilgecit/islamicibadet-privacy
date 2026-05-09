import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SHADOWS } from '../constants/theme';

interface TabConfig {
  route: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const TABS: TabConfig[] = [
  {
    route: 'index',
    label: 'Ana Sayfa',
    icon: (a) => <Ionicons name={a ? 'home' : 'home-outline'} size={22} color={a ? COLORS.gold : COLORS.tabInactive} />,
  },
  {
    route: 'prayer-times',
    label: 'Vakitler',
    icon: (a) => <MaterialCommunityIcons name={a ? 'clock-time-five' : 'clock-time-five-outline'} size={22} color={a ? COLORS.gold : COLORS.tabInactive} />,
  },
  {
    route: 'qibla',
    label: 'Kıble',
    icon: (a) => <Ionicons name={a ? 'compass' : 'compass-outline'} size={22} color={a ? COLORS.gold : COLORS.tabInactive} />,
  },
  {
    route: 'dhikr',
    label: 'Zikir',
    icon: (a) => <MaterialCommunityIcons name="circle-outline" size={22} color={a ? COLORS.gold : COLORS.tabInactive} />,
  },
  {
    route: 'mosques',
    label: 'Camiler',
    icon: (a) => <MaterialCommunityIcons name="mosque" size={22} color={a ? COLORS.gold : COLORS.tabInactive} />,
  },
  {
    route: 'more',
    label: 'Menü',
    icon: (a) => <Ionicons name={a ? 'apps' : 'apps-outline'} size={22} color={a ? COLORS.gold : COLORS.tabInactive} />,
  },
];

function TabItem({ tab, isActive, onPress }: { tab: TabConfig; isActive: boolean; onPress: () => void }) {
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

  return (
    <TouchableOpacity style={styles.tab} onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }, isActive && styles.iconWrapActive]}>
        {tab.icon(isActive)}
      </Animated.View>
      <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>{tab.label}</Text>
      <Animated.View style={[styles.dot, {
        opacity: dotAnim,
        transform: [{ scaleX: dotAnim }],
      }]} />
    </TouchableOpacity>
  );
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const visibleRoutes = state.routes.filter(r => TABS.some(t => t.route === r.name));

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {visibleRoutes.map((route) => {
          const tab = TABS.find(t => t.route === route.name);
          if (!tab) return null;
          const isActive = state.routes[state.index].name === route.name;
          return (
            <TabItem
              key={route.key}
              tab={tab}
              isActive={isActive}
              onPress={() => {
                if (!isActive) navigation.navigate(route.name);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.tabBar,
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
  iconWrapActive: {
    backgroundColor: COLORS.goldGlow,
  },
  label: {
    fontSize: 10,
    color: COLORS.tabInactive,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  dot: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginTop: 1,
  },
});
