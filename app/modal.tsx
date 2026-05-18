import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function ModalScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Modal</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.link}>
        <Text style={[styles.linkText, { color: colors.gold }]}>Kapat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: { fontSize: 16, fontWeight: '600' },
});
