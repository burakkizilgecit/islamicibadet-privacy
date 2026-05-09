export interface Dua {
  id: string;
  title: string;
  title_en: string;
  arabic: string;
  turkish: string;
  english: string;
  source: string;
  category: string;
}

export const DUA_CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'morning', label: 'Sabah-Akşam' },
  { id: 'prayer', label: 'Namaz' },
  { id: 'daily', label: 'Günlük' },
  { id: 'quran', label: "Kur'an" },
  { id: 'special', label: 'Özel' },
];

export const DUAS: Dua[] = [
  {
    id: '1', category: 'morning',
    title: 'Sabah Duası', title_en: 'Morning Supplication',
    arabic: 'اَللّٰهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    turkish: "Allah'ım! Senin adınla sabaha erdik, senin adınla akşama erdik, senin adınla yaşar ve senin adınla ölürüz. Dönüş de sanadır.",
    english: 'O Allah! By Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
    source: 'Tirmizi, 3391',
  },
  {
    id: '2', category: 'morning',
    title: 'Akşam Duası', title_en: 'Evening Supplication',
    arabic: 'اَللّٰهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    turkish: "Allah'ım! Senin adınla akşama erdik, senin adınla sabaha erdik, senin adınla yaşar ve senin adınla ölürüz. Dönüş de sanadır.",
    english: 'O Allah! By Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.',
    source: 'Tirmizi, 3391',
  },
  {
    id: '3', category: 'daily',
    title: 'Yemek Duası', title_en: 'Meal Supplication',
    arabic: 'بِسْمِ اللّٰهِ وَعَلٰى بَرَكَةِ اللّٰهِ',
    turkish: "Allah'ın adıyla ve Allah'ın bereketi üzerine (yiyorum).",
    english: 'In the name of Allah and with the blessings of Allah.',
    source: 'Ebû Dâvûd, 3767',
  },
  {
    id: '4', category: 'daily',
    title: 'Yemek Sonrası Duası', title_en: 'After Meal Supplication',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِى أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    turkish: "Bizi yedirip içiren ve bizi Müslüman kılan Allah'a hamdolsun.",
    english: 'All praise is due to Allah Who fed us, gave us drink, and made us Muslims.',
    source: 'Tirmizi, 3457',
  },
  {
    id: '5', category: 'daily',
    title: 'Uyku Duası', title_en: 'Sleep Supplication',
    arabic: 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا',
    turkish: "Allah'ım! Senin adınla ölür (uyur) ve dirilir (uyanırım).",
    english: 'O Allah! In Your name I die and I live.',
    source: 'Buhârî, 6312',
  },
  {
    id: '6', category: 'daily',
    title: 'Uyanış Duası', title_en: 'Waking Up Supplication',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِى أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    turkish: "Bizi öldürdükten sonra dirilten Allah'a hamdolsun. Dönüş de O'nadır.",
    english: 'All praise is due to Allah Who gave us life after He had caused us to die, and unto Him is the resurrection.',
    source: 'Buhârî, 6312',
  },
  {
    id: '7', category: 'daily',
    title: 'Eve Girerken', title_en: 'Entering Home',
    arabic: 'اَللّٰهُمَّ إِنِّى أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ',
    turkish: "Allah'ım! Girişinin hayrını ve çıkışının hayrını senden istiyorum.",
    english: 'O Allah! I ask You for the good of the entrance and the good of the exit.',
    source: 'Ebû Dâvûd, 5096',
  },
  {
    id: '8', category: 'daily',
    title: 'Tuvalete Girerken', title_en: 'Entering Restroom',
    arabic: 'اَللّٰهُمَّ إِنِّى أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    turkish: "Allah'ım! Erkek ve dişi şeytanlardan sana sığınırım.",
    english: 'O Allah! I seek refuge in You from male and female devils.',
    source: 'Buhârî, 142',
  },
  {
    id: '9', category: 'prayer',
    title: 'Namaz Öncesi Niyet', title_en: 'Intention Before Prayer',
    arabic: 'اَللّٰهُمَّ إِنِّى أُرِيدُ أَنْ أُصَلِّىَ',
    turkish: "Allah'ım! Namaz kılmayı niyyet ediyorum.",
    english: 'O Allah! I intend to pray.',
    source: 'Genel',
  },
  {
    id: '10', category: 'prayer',
    title: 'Sübhaneke', title_en: 'Opening Supplication (Subhanaka)',
    arabic: 'سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالٰى جَدُّكَ وَلَا إِلٰهَ غَيْرُكَ',
    turkish: "Allah'ım! Seni eksikliklerden tenzih eder, sana hamdederim. İsmin mübarektir, şanın yücedir. Senden başka ilah yoktur.",
    english: 'Glory be to You, O Allah, and praise be to You. Blessed is Your name and exalted is Your majesty. There is no god but You.',
    source: 'Ebû Dâvûd, 775',
  },
  {
    id: '11', category: 'quran',
    title: 'Fatiha Suresi', title_en: 'Surah Al-Fatiha',
    arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\nاَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ\nالرَّحْمٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    turkish: "Rahman ve Rahim olan Allah'ın adıyla.\nÂlemlerin Rabbi Allah'a hamdolsun.\nO Rahman'dır, Rahim'dir.\nDin gününün sahibidir.\nYalnız sana ibadet eder, yalnız senden yardım dileriz.\nBizi doğru yola ilet.\nNimet verdiklerinin yoluna; gazaba uğrayanların ve sapıtanların yoluna değil.",
    english: "In the name of Allah, the Most Gracious, the Most Merciful.\nAll praise is due to Allah, Lord of all worlds.\nThe Most Gracious, the Most Merciful.\nMaster of the Day of Judgment.\nYou alone we worship, and You alone we ask for help.\nGuide us on the straight path.\nThe path of those upon whom You have bestowed favor; not of those who have earned anger or those who are astray.",
    source: "Kur'an-ı Kerim, 1. Sure",
  },
  {
    id: '12', category: 'quran',
    title: 'Ayetel Kürsi', title_en: 'Ayat Al-Kursi',
    arabic: 'اَللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    turkish: "Allah, kendisinden başka hiçbir ilah olmayandır. O, Hay'dır, Kayyum'dur. O'nu ne bir uyuklama, ne de uyku tutar.",
    english: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
    source: 'Bakara, 255',
  },
  {
    id: '13', category: 'special',
    title: 'Salavat-ı Şerife', title_en: 'Salawat (Blessings upon the Prophet)',
    arabic: 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ',
    turkish: "Allah'ım! Hz. Muhammed'e ve onun aile efradına salât eyle.",
    english: 'O Allah! Send blessings upon Muhammad and upon the family of Muhammad.',
    source: 'Buhârî, 3370',
  },
  {
    id: '14', category: 'special',
    title: 'İstiğfar', title_en: 'Seeking Forgiveness (Istighfar)',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِى لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    turkish: "Kendisinden başka ilah olmayan, Hay ve Kayyum olan Azim Allah'tan bağışlanma diler ve O'na tövbe ederim.",
    english: "I seek forgiveness from Allah the Almighty, beside Whom there is no god, the Ever-Living, the Eternal, and I repent to Him.",
    source: 'Tirmizi, 3577',
  },
  {
    id: '15', category: 'special',
    title: 'Yolculuk Duası', title_en: 'Travel Supplication',
    arabic: 'اَللّٰهُمَّ إِنَّا نَسْأَلُكَ فِى سَفَرِنَا هٰذَا الْبِرَّ وَالتَّقْوٰى',
    turkish: "Allah'ım! Bu yolculuğumuzda senden iyilik ve takva istiyoruz.",
    english: 'O Allah! We ask You in this journey for righteousness and piety.',
    source: 'Müslim, 1342',
  },
  {
    id: '16', category: 'morning',
    title: 'Sabah Sığınma Duası', title_en: 'Morning Protection Supplication',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    turkish: "Allah'ın eksiksiz kelimelerine sığınırım, yarattığı şeylerin şerrinden.",
    english: "I seek refuge in Allah's perfect words from the evil of what He has created.",
    source: 'Müslim, 2708',
  },
];

export function getDailyDua(): Dua {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const morningEveningDuas = DUAS.filter(d => d.category === 'morning');
  return morningEveningDuas[dayOfYear % morningEveningDuas.length];
}
