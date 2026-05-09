export interface Dua {
  id: string;
  title: string;
  arabic: string;
  turkish: string;
  source: string;
  category: string;
}

export const DUA_CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'morning', label: 'Sabah-Akşam' },
  { id: 'prayer', label: 'Namaz' },
  { id: 'daily', label: 'Günlük' },
  { id: 'quran', label: 'Kur\'an' },
  { id: 'special', label: 'Özel' },
];

export const DUAS: Dua[] = [
  {
    id: '1', category: 'morning',
    title: 'Sabah Duası',
    arabic: 'اَللّٰهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    turkish: 'Allah\'ım! Senin adınla sabaha erdik, senin adınla akşama erdik, senin adınla yaşar ve senin adınla ölürüz. Dönüş de sanadır.',
    source: 'Tirmizi, 3391',
  },
  {
    id: '2', category: 'morning',
    title: 'Akşam Duası',
    arabic: 'اَللّٰهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    turkish: 'Allah\'ım! Senin adınla akşama erdik, senin adınla sabaha erdik, senin adınla yaşar ve senin adınla ölürüz. Dönüş de sanadır.',
    source: 'Tirmizi, 3391',
  },
  {
    id: '3', category: 'daily',
    title: 'Yemek Duası',
    arabic: 'بِسْمِ اللّٰهِ وَعَلٰى بَرَكَةِ اللّٰهِ',
    turkish: 'Allah\'ın adıyla ve Allah\'ın bereketi üzerine (yiyorum).',
    source: 'Ebû Dâvûd, 3767',
  },
  {
    id: '4', category: 'daily',
    title: 'Yemek Sonrası Duası',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِى أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    turkish: 'Bizi yedirip içiren ve bizi Müslüman kılan Allah\'a hamdolsun.',
    source: 'Tirmizi, 3457',
  },
  {
    id: '5', category: 'daily',
    title: 'Uyku Duası',
    arabic: 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا',
    turkish: 'Allah\'ım! Senin adınla ölür (uyur) ve dirilir (uyanırım).',
    source: 'Buhârî, 6312',
  },
  {
    id: '6', category: 'daily',
    title: 'Uyanış Duası',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِى أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    turkish: 'Bizi öldürdükten sonra dirilten Allah\'a hamdolsun. Dönüş de O\'nadır.',
    source: 'Buhârî, 6312',
  },
  {
    id: '7', category: 'daily',
    title: 'Eve Girerken',
    arabic: 'اَللّٰهُمَّ إِنِّى أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ',
    turkish: 'Allah\'ım! Girişimin hayrını ve çıkışının hayrını senden istiyorum.',
    source: 'Ebû Dâvûd, 5096',
  },
  {
    id: '8', category: 'daily',
    title: 'Tuvalete Girerken',
    arabic: 'اَللّٰهُمَّ إِنِّى أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    turkish: 'Allah\'ım! Erkek ve dişi şeytanlardan sana sığınırım.',
    source: 'Buhârî, 142',
  },
  {
    id: '9', category: 'prayer',
    title: 'Namaz Öncesi Niyet',
    arabic: 'اَللّٰهُمَّ إِنِّى أُرِيدُ أَنْ أُصَلِّىَ',
    turkish: 'Allah\'ım! Namaz kılmayı niyyet ediyorum.',
    source: 'Genel',
  },
  {
    id: '10', category: 'prayer',
    title: 'Sübhaneke',
    arabic: 'سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالٰى جَدُّكَ وَلَا إِلٰهَ غَيْرُكَ',
    turkish: 'Allah\'ım! Seni eksikliklerden tenzih eder, sana hamdederim. İsmin mübarektir, şanın yücedir. Senden başka ilah yoktur.',
    source: 'Ebû Dâvûd, 775',
  },
  {
    id: '11', category: 'quran',
    title: 'Fatiha Suresi',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\nاَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ\nالرَّحْمٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    turkish: 'Rahman ve Rahim olan Allah\'ın adıyla.\nÂlemlerin Rabbi Allah\'a hamdolsun.\nO Rahman\'dır, Rahim\'dir.\nDin gününün sahibidir.\nYalnız sana ibadet eder, yalnız senden yardım dileriz.\nBizi doğru yola ilet.\nNimet verdiklerinin yoluna; gazaba uğrayanların ve sapıtanların yoluna değil.',
    source: 'Kur\'an-ı Kerim, 1. Sure',
  },
  {
    id: '12', category: 'quran',
    title: 'Ayetel Kürsi',
    arabic: 'اَللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    turkish: 'Allah, kendisinden başka hiçbir ilah olmayandır. O, Hay\'dır, Kayyum\'dur. O\'nu ne bir uyuklama, ne de uyku tutar.',
    source: 'Bakara, 255',
  },
  {
    id: '13', category: 'special',
    title: 'Salavat-ı Şerife',
    arabic: 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ',
    turkish: 'Allah\'ım! Hz. Muhammed\'e ve onun aile efradına salât eyle.',
    source: 'Buhârî, 3370',
  },
  {
    id: '14', category: 'special',
    title: 'İstiğfar',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِى لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    turkish: 'Kendisinden başka ilah olmayan, Hay ve Kayyum olan Azim Allah\'tan bağışlanma diler ve O\'na tövbe ederim.',
    source: 'Tirmizi, 3577',
  },
  {
    id: '15', category: 'special',
    title: 'Yolculuk Duası',
    arabic: 'اَللّٰهُمَّ إِنَّا نَسْأَلُكَ فِى سَفَرِنَا هٰذَا الْبِرَّ وَالتَّقْوٰى',
    turkish: 'Allah\'ım! Bu yolculuğumuzda senden iyilik ve takva istiyoruz.',
    source: 'Müslim, 1342',
  },
  {
    id: '16', category: 'morning',
    title: 'Sabah Sığınma Duası',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    turkish: 'Allah\'ın eksiksiz kelimelerine sığınırım, yarattığı şeylerin şerrinden.',
    source: 'Müslim, 2708',
  },
];

export function getDailyDua(): Dua {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const morningEveningDuas = DUAS.filter(d => d.category === 'morning');
  return morningEveningDuas[dayOfYear % morningEveningDuas.length];
}
