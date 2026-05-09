export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameTurkish: string;
  nameTranslit: string;
  verseCount: number;
  revelationType: 'Meccan' | 'Medinan';
}

export const SURAHS: SurahMeta[] = [
  { number: 1,   nameArabic: 'الفاتحة',    nameTurkish: 'Fâtiha',         nameTranslit: 'Al-Faatiha',    verseCount: 7,   revelationType: 'Meccan' },
  { number: 2,   nameArabic: 'البقرة',     nameTurkish: 'Bakara',         nameTranslit: 'Al-Baqara',     verseCount: 286, revelationType: 'Medinan' },
  { number: 3,   nameArabic: 'آل عمران',   nameTurkish: 'Âl-i İmrân',    nameTranslit: "Aal-i-Imraan",  verseCount: 200, revelationType: 'Medinan' },
  { number: 4,   nameArabic: 'النساء',     nameTurkish: 'Nisâ',           nameTranslit: 'An-Nisaa',      verseCount: 176, revelationType: 'Medinan' },
  { number: 5,   nameArabic: 'المائدة',    nameTurkish: 'Mâide',          nameTranslit: 'Al-Maaida',     verseCount: 120, revelationType: 'Medinan' },
  { number: 6,   nameArabic: 'الأنعام',    nameTurkish: "En'âm",          nameTranslit: 'Al-Anaam',      verseCount: 165, revelationType: 'Meccan' },
  { number: 7,   nameArabic: 'الأعراف',    nameTurkish: "A'râf",          nameTranslit: 'Al-Araaf',      verseCount: 206, revelationType: 'Meccan' },
  { number: 8,   nameArabic: 'الأنفال',    nameTurkish: 'Enfâl',          nameTranslit: 'Al-Anfaal',     verseCount: 75,  revelationType: 'Medinan' },
  { number: 9,   nameArabic: 'التوبة',     nameTurkish: 'Tevbe',          nameTranslit: 'At-Tawba',      verseCount: 129, revelationType: 'Medinan' },
  { number: 10,  nameArabic: 'يونس',       nameTurkish: 'Yûnus',          nameTranslit: 'Yunus',         verseCount: 109, revelationType: 'Meccan' },
  { number: 11,  nameArabic: 'هود',        nameTurkish: 'Hûd',            nameTranslit: 'Hud',           verseCount: 123, revelationType: 'Meccan' },
  { number: 12,  nameArabic: 'يوسف',       nameTurkish: 'Yûsuf',          nameTranslit: 'Yusuf',         verseCount: 111, revelationType: 'Meccan' },
  { number: 13,  nameArabic: 'الرعد',      nameTurkish: "Ra'd",           nameTranslit: 'Ar-Rad',        verseCount: 43,  revelationType: 'Medinan' },
  { number: 14,  nameArabic: 'إبراهيم',    nameTurkish: 'İbrâhîm',        nameTranslit: 'Ibrahim',       verseCount: 52,  revelationType: 'Meccan' },
  { number: 15,  nameArabic: 'الحجر',      nameTurkish: 'Hicr',           nameTranslit: 'Al-Hijr',       verseCount: 99,  revelationType: 'Meccan' },
  { number: 16,  nameArabic: 'النحل',      nameTurkish: 'Nahl',           nameTranslit: 'An-Nahl',       verseCount: 128, revelationType: 'Meccan' },
  { number: 17,  nameArabic: 'الإسراء',    nameTurkish: 'İsrâ',           nameTranslit: 'Al-Isra',       verseCount: 111, revelationType: 'Meccan' },
  { number: 18,  nameArabic: 'الكهف',      nameTurkish: 'Kehf',           nameTranslit: 'Al-Kahf',       verseCount: 110, revelationType: 'Meccan' },
  { number: 19,  nameArabic: 'مريم',       nameTurkish: 'Meryem',         nameTranslit: 'Maryam',        verseCount: 98,  revelationType: 'Meccan' },
  { number: 20,  nameArabic: 'طه',         nameTurkish: 'Tâhâ',           nameTranslit: 'Taa-Haa',       verseCount: 135, revelationType: 'Meccan' },
  { number: 36,  nameArabic: 'يس',         nameTurkish: 'Yâsîn',          nameTranslit: 'Yaseen',        verseCount: 83,  revelationType: 'Meccan' },
  { number: 55,  nameArabic: 'الرحمن',     nameTurkish: 'Rahmân',         nameTranslit: 'Ar-Rahman',     verseCount: 78,  revelationType: 'Medinan' },
  { number: 56,  nameArabic: 'الواقعة',    nameTurkish: 'Vâkıa',          nameTranslit: 'Al-Waqia',      verseCount: 96,  revelationType: 'Meccan' },
  { number: 67,  nameArabic: 'الملك',      nameTurkish: 'Mülk',           nameTranslit: 'Al-Mulk',       verseCount: 30,  revelationType: 'Meccan' },
  { number: 78,  nameArabic: 'النبأ',      nameTurkish: "Nebe'",          nameTranslit: 'An-Naba',       verseCount: 40,  revelationType: 'Meccan' },
  { number: 112, nameArabic: 'الإخلاص',    nameTurkish: 'İhlâs',          nameTranslit: 'Al-Ikhlas',     verseCount: 4,   revelationType: 'Meccan' },
  { number: 113, nameArabic: 'الفلق',      nameTurkish: 'Felak',          nameTranslit: 'Al-Falaq',      verseCount: 5,   revelationType: 'Meccan' },
  { number: 114, nameArabic: 'الناس',      nameTurkish: 'Nâs',            nameTranslit: 'An-Nas',        verseCount: 6,   revelationType: 'Meccan' },
];

// Populate missing surahs 21-35, 37-54, 57-66, 68-77, 79-111
const FILL: [number, string, string, string, number, 'Meccan' | 'Medinan'][] = [
  [21,'الأنبياء',"Enbiyâ",'Al-Anbiya',112,'Meccan'],[22,'الحج','Hac','Al-Hajj',78,'Medinan'],
  [23,'المؤمنون',"Mü'minûn",'Al-Muminun',118,'Meccan'],[24,'النور','Nûr','An-Nur',64,'Medinan'],
  [25,'الفرقان','Furkân','Al-Furqan',77,'Meccan'],[26,'الشعراء',"Şuarâ",'Ash-Shuara',227,'Meccan'],
  [27,'النمل','Neml','An-Naml',93,'Meccan'],[28,'القصص','Kasas','Al-Qasas',88,'Meccan'],
  [29,'العنكبوت',"Ankebût",'Al-Ankabut',69,'Meccan'],[30,'الروم','Rûm','Ar-Rum',60,'Meccan'],
  [31,'لقمان','Lokmân','Luqman',34,'Meccan'],[32,'السجدة','Secde','As-Sajda',30,'Meccan'],
  [33,'الأحزاب','Ahzâb','Al-Ahzab',73,'Medinan'],[34,'سبأ',"Sebe'",'Saba',54,'Meccan'],
  [35,'فاطر','Fâtır','Fatir',45,'Meccan'],[37,'الصافات',"Sâffât",'As-Saffat',182,'Meccan'],
  [38,'ص',"Sâd",'Sad',88,'Meccan'],[39,'الزمر','Zümer','Az-Zumar',75,'Meccan'],
  [40,'غافر',"Mü'min",'Ghafir',85,'Meccan'],[41,'فصلت','Fussilet','Fussilat',54,'Meccan'],
  [42,'الشورى',"Şûrâ",'Ash-Shuraa',53,'Meccan'],[43,'الزخرف','Zuhruf','Az-Zukhruf',89,'Meccan'],
  [44,'الدخان','Duhân','Ad-Dukhan',59,'Meccan'],[45,'الجاثية','Câsiye','Al-Jathiya',37,'Meccan'],
  [46,'الأحقاف','Ahkâf','Al-Ahqaf',35,'Meccan'],[47,'محمد','Muhammed','Muhammad',38,'Medinan'],
  [48,'الفتح','Fetih','Al-Fath',29,'Medinan'],[49,'الحجرات','Hucurât','Al-Hujurat',18,'Medinan'],
  [50,'ق','Kâf','Qaf',45,'Meccan'],[51,'الذاريات','Zâriyât','Adh-Dhariyat',60,'Meccan'],
  [52,'الطور','Tûr','At-Tur',49,'Meccan'],[53,'النجم','Necm','An-Najm',62,'Meccan'],
  [54,'القمر','Kamer','Al-Qamar',55,'Meccan'],[57,'الحديد','Hadîd','Al-Hadid',29,'Medinan'],
  [58,'المجادلة','Mücâdele','Al-Mujadila',22,'Medinan'],[59,'الحشر','Haşr','Al-Hashr',24,'Medinan'],
  [60,'الممتحنة','Mümtehine','Al-Mumtahana',13,'Medinan'],[61,'الصف','Sâf','As-Saff',14,'Medinan'],
  [62,'الجمعة','Cuma','Al-Jumua',11,'Medinan'],[63,'المنافقون','Münâfikûn','Al-Munafiqun',11,'Medinan'],
  [64,'التغابن','Teğâbün','At-Taghabun',18,'Medinan'],[65,'الطلاق','Talâk','At-Talaq',12,'Medinan'],
  [66,'التحريم','Tahrîm','At-Tahrim',12,'Medinan'],[68,'القلم','Kalem','Al-Qalam',52,'Meccan'],
  [69,'الحاقة','Hâkka','Al-Haaqqa',52,'Meccan'],[70,'المعارج','Meâric','Al-Maarij',44,'Meccan'],
  [71,'نوح','Nûh','Nuh',28,'Meccan'],[72,'الجن','Cin','Al-Jinn',28,'Meccan'],
  [73,'المزمل','Müzzemmil','Al-Muzzammil',20,'Meccan'],[74,'المدثر','Müddessir','Al-Muddaththir',56,'Meccan'],
  [75,'القيامة','Kıyâmet','Al-Qiyama',40,'Meccan'],[76,'الإنسان','İnsân','Al-Insan',31,'Medinan'],
  [77,'المرسلات','Mürselât','Al-Mursalat',50,'Meccan'],[79,'النازعات',"Nâziât",'An-Naziat',46,'Meccan'],
  [80,'عبس','Abese','Abasa',42,'Meccan'],[81,'التكوير','Tekvîr','At-Takwir',29,'Meccan'],
  [82,'الإنفطار','İnfitâr','Al-Infitar',19,'Meccan'],[83,'المطففين','Mutaffifîn','Al-Mutaffifin',36,'Meccan'],
  [84,'الإنشقاق','İnşikâk','Al-Inshiqaq',25,'Meccan'],[85,'البروج','Burûc','Al-Burooj',22,'Meccan'],
  [86,'الطارق','Târık','At-Tariq',17,'Meccan'],[87,'الأعلى',"A'lâ",'Al-Ala',19,'Meccan'],
  [88,'الغاشية','Ğâşiye','Al-Ghashiya',26,'Meccan'],[89,'الفجر','Fecr','Al-Fajr',30,'Meccan'],
  [90,'البلد','Beled','Al-Balad',20,'Meccan'],[91,'الشمس','Şems','Ash-Shams',15,'Meccan'],
  [92,'الليل','Leyl','Al-Lail',21,'Meccan'],[93,'الضحى','Duhâ','Ad-Duhaa',11,'Meccan'],
  [94,'الشرح','İnşirâh','Ash-Sharh',8,'Meccan'],[95,'التين','Tîn','At-Tin',8,'Meccan'],
  [96,'العلق','Alak','Al-Alaq',19,'Meccan'],[97,'القدر','Kadr','Al-Qadr',5,'Meccan'],
  [98,'البينة','Beyyine','Al-Bayyina',8,'Medinan'],[99,'الزلزلة','Zilzâl','Az-Zalzala',8,'Medinan'],
  [100,'العاديات',"Âdiyât",'Al-Adiyat',11,'Meccan'],[101,'القارعة','Kâria','Al-Qaria',11,'Meccan'],
  [102,'التكاثر','Tekâsür','At-Takathur',8,'Meccan'],[103,'العصر','Asr','Al-Asr',3,'Meccan'],
  [104,'الهمزة','Hümeze','Al-Humaza',9,'Meccan'],[105,'الفيل','Fîl','Al-Fil',5,'Meccan'],
  [106,'قريش','Kureyş','Quraish',4,'Meccan'],[107,'الماعون',"Mâûn",'Al-Maun',7,'Meccan'],
  [108,'الكوثر','Kevser','Al-Kawthar',3,'Meccan'],[109,'الكافرون','Kâfirûn','Al-Kafirun',6,'Meccan'],
  [110,'النصر','Nasr','An-Nasr',3,'Medinan'],[111,'المسد','Mesed','Al-Masad',5,'Meccan'],
];

for (const [n, a, t, tr, v, r] of FILL) {
  SURAHS.push({ number: n, nameArabic: a, nameTurkish: t, nameTranslit: tr, verseCount: v, revelationType: r });
}
SURAHS.sort((a, b) => a.number - b.number);

export interface Verse {
  number: number;
  arabic: string;
  turkish: string;
  audioUrl: string;
}

export async function fetchSurah(number: number): Promise<{ meta: SurahMeta; verses: Verse[] }> {
  const meta = SURAHS.find(s => s.number === number)!;
  const res = await fetch(
    `https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,tr.diyanet`,
  );
  if (!res.ok) throw new Error('Sure yüklenemedi.');
  const json = await res.json();
  const arabic: any[] = json.data[0].ayahs;
  const turkish: any[] = json.data[1].ayahs;
  const verses: Verse[] = arabic.map((a: any, i: number) => ({
    number: a.numberInSurah,
    arabic: a.text,
    turkish: turkish[i]?.text ?? '',
    audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`,
  }));
  return { meta, verses };
}
