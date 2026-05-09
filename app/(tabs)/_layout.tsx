import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"        options={{ title: 'Ana Sayfa' }} />
      <Tabs.Screen name="prayer-times" options={{ title: 'Vakitler' }} />
      <Tabs.Screen name="qibla"        options={{ title: 'Kıble' }} />
      <Tabs.Screen name="dhikr"        options={{ title: 'Zikir' }} />
      <Tabs.Screen name="mosques"      options={{ title: 'Camiler' }} />
      <Tabs.Screen name="more"         options={{ title: 'Menü' }} />
      <Tabs.Screen name="explore"      options={{ href: null }} />
      <Tabs.Screen name="duas"         options={{ href: null }} />
    </Tabs>
  );
}
