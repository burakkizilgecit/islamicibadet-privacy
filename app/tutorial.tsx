import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  FlatList, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../constants/theme';
import { useTutorialStore } from '../store/useTutorialStore';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: string;
  iconLib: 'ion' | 'mci';
  accent: string;
  title: string;
  desc: string;
}

const SLIDES: Slide[] = [
  {
    id: '1', iconLib: 'mci', icon: 'mosque',
    accent: '#C8A853',
    title: 'İslami İbadet\'e\nHoş Geldiniz',
    desc: 'Günlük ibadetlerinizi düzenli tutmanıza yardımcı olan kapsamlı İslami yaşam uygulaması.',
  },
  {
    id: '2', iconLib: 'ion', icon: 'home-outline',
    accent: '#7BB8F5',
    title: 'Ana Sayfa',
    desc: 'Sıradaki namaz vaktine geri sayım, günün hadisi ve duası, bugünkü namaz takibi — hepsi tek ekranda.',
  },
  {
    id: '3', iconLib: 'mci', icon: 'clock-time-five-outline',
    accent: '#A78BFA',
    title: 'Namaz Vakitleri',
    desc: 'Konumunuza göre hesaplanan günlük vakitler. Kıldığınız namazları işaretleyin, haftalık takibi görün.',
  },
  {
    id: '4', iconLib: 'ion', icon: 'compass-outline',
    accent: '#34D399',
    title: 'Kıble & En Yakın Cami',
    desc: 'Cihazınızın pusulasıyla kıble yönünü bulun. Yakınınızdaki camileri haritada görüp yol tarifi alın.',
  },
  {
    id: '5', iconLib: 'mci', icon: 'circle-double',
    accent: '#F472B6',
    title: 'Zikirmatik',
    desc: 'Tespih, salavat ve istiğfarı sayın. Haftalık zikir geçmişinizi grafik olarak takip edin.',
  },
  {
    id: '6', iconLib: 'mci', icon: 'book-open-page-variant-outline',
    accent: '#FBBF24',
    title: 'Kur\'an-ı Kerim',
    desc: '114 surenin tamamını okuyun, Al-Afasy sesiyle dinleyin. Ayet ayet veya tüm sure sesli tilavetiyle.',
  },
  {
    id: '7', iconLib: 'ion', icon: 'notifications-outline',
    accent: '#FB923C',
    title: 'Bildirimler',
    desc: 'Namaz vakitlerinde ve 10 dakika öncesinde hatırlatma alın. Ayarlar\'dan istediğinizi açıp kapatın.',
  },
  {
    id: '8', iconLib: 'ion', icon: 'checkmark-circle-outline',
    accent: '#4ADE80',
    title: 'Her Şey Hazır!',
    desc: 'İslami İbadet ile günlük ibadetlerinizi düzenli, bilinçli ve huzurlu şekilde sürdürün.\n\nAllah kabul etsin 🤲',
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const { complete } = useTutorialStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const isLast = activeIndex === SLIDES.length - 1;

  const goTo = (index: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.4, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setActiveIndex(index);
    flatRef.current?.scrollToIndex({ index, animated: true });
  };

  const next = () => {
    if (isLast) finish();
    else goTo(activeIndex + 1);
  };

  const finish = async () => {
    await complete();
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
      <View style={[styles.iconWrap, { backgroundColor: item.accent + '22', borderColor: item.accent + '44' }]}>
        {item.iconLib === 'mci'
          ? <MaterialCommunityIcons name={item.icon as any} size={64} color={item.accent} />
          : <Ionicons name={item.icon as any} size={64} color={item.accent} />
        }
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={finish}>
          <Text style={styles.skipText}>Geç</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={s => s.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goTo(i)}>
            <View style={[
              styles.dot,
              i === activeIndex && styles.dotActive,
              { backgroundColor: i === activeIndex ? SLIDES[activeIndex].accent : COLORS.cardBorder },
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomRow}>
        {activeIndex > 0 ? (
          <TouchableOpacity style={styles.backBtn} onPress={() => goTo(activeIndex - 1)}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: SLIDES[activeIndex].accent }]}
          onPress={next}
          activeOpacity={0.85}
        >
          {isLast ? (
            <>
              <Text style={styles.nextText}>Başlayalım</Text>
              <Ionicons name="rocket-outline" size={18} color={COLORS.background} />
            </>
          ) : (
            <>
              <Text style={styles.nextText}>İleri</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.background} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.background },

  skipBtn:    { position: 'absolute', top: SPACING.lg + 8, right: SPACING.lg, zIndex: 10, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: RADIUS.full },
  skipText:   { color: COLORS.textMuted, fontSize: FONT_SIZE.sm, fontWeight: '600' },

  list:       { flex: 1 },
  slide:      { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl, paddingBottom: 60 },

  iconWrap:   { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl, borderWidth: 1.5 },

  title:      { color: COLORS.textPrimary, fontSize: FONT_SIZE.xxxl, fontWeight: '800', textAlign: 'center', marginBottom: SPACING.md, lineHeight: 42 },
  desc:       { color: COLORS.textSecondary, fontSize: FONT_SIZE.md, textAlign: 'center', lineHeight: 26, maxWidth: 320 },

  dots:       { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xs, paddingBottom: SPACING.lg },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  dotActive:  { width: 24, borderRadius: 4 },

  bottomRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, gap: SPACING.md },
  backBtn:    { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: COLORS.cardBorder },
  nextBtn:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, height: 52, borderRadius: RADIUS.xl },
  nextText:   { color: COLORS.background, fontSize: FONT_SIZE.md, fontWeight: '800' },
});
