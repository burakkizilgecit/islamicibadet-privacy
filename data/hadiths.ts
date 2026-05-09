export interface Hadith {
  text: string;
  source: string;
}

export const HADITHS: Hadith[] = [
  { text: "Gülümsemen kardeşine sadakadır.", source: "Tirmizi, 1956" },
  { text: "Mümin, müminin aynasıdır.", source: "Ebû Dâvûd, 4918" },
  { text: "İnsanların en hayırlısı, insanlara en çok faydalı olandır.", source: "Taberânî" },
  { text: "Bir zorluktan kolaylık gösterene, Allah da dünyada ve ahirette kolaylık gösterir.", source: "Müslim, 2699" },
  { text: "Komşusu açken tok yatan bizden değildir.", source: "Hâkim, 2166" },
  { text: "Temizlik imanın yarısıdır.", source: "Müslim, 223" },
  { text: "Bir işi güzel yapın; Allah güzel iş yapanı sever.", source: "Taberânî" },
  { text: "Sizin en hayırlınız, Kur'an'ı öğrenen ve öğretendir.", source: "Buhârî, 5027" },
  { text: "Allah'ım! Faydasız ilimden, huşu duymayan kalpten, doymayan nefisten ve kabul edilmeyen duadan sana sığınırım.", source: "Müslim, 2722" },
  { text: "Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.", source: "Buhârî, 69" },
  { text: "Sabır bir ışıktır.", source: "Müslim, 223" },
  { text: "Kişi sevdiğiyle beraberdir.", source: "Buhârî, 6168" },
  { text: "Büyüklerimize saygı göstermeyen, küçüklerimize merhamet etmeyen bizden değildir.", source: "Tirmizi, 1919" },
  { text: "Helâl kazanmak farzdır.", source: "Taberânî" },
  { text: "Her kim Allah'a ve ahiret gününe iman ediyorsa ya hayır söylesin ya da sussun.", source: "Buhârî, 6018" },
  { text: "Dünya müminin zindanı, kâfirin cennetidir.", source: "Müslim, 2956" },
  { text: "Ana babana iyi davran, çocukların da sana iyi davransın.", source: "Taberânî" },
  { text: "Dini bütün müslüman öfkelendiğinde kendine hâkim olandır.", source: "Tirmizi" },
  { text: "Güçlü olan, güreşte yenmeyen değil; öfkelendiğinde kendine hâkim olandır.", source: "Buhârî, 6114" },
  { text: "Sizi seven kimsenin yüzüne gülün.", source: "Buhârî" },
  { text: "Bir şeye acıyan kimse onu korur, acımayan onu mahveder.", source: "Buhârî, 7376" },
  { text: "İlim öğrenmek her Müslümana farzdır.", source: "İbn Mâce, 224" },
  { text: "Cennete giren kimse oradan çıkmak istemez.", source: "Buhârî, 3246" },
  { text: "Kim Allah için tevazu gösterirse Allah onu yükseltir.", source: "Müslim, 2588" },
  { text: "Amellerin en hayırlısı az da olsa devamlı olanıdır.", source: "Buhârî, 6465" },
  { text: "Kötü komşudan Allah'a sığının.", source: "Nesâî, 5502" },
  { text: "Oruç kalkandır.", source: "Buhârî, 1904" },
  { text: "Sabır, imanın yarısıdır.", source: "Beyhakî" },
  { text: "Namaz dinin direğidir.", source: "Tirmizi, 2616" },
  { text: "Her hayırlı iş sadakadır.", source: "Buhârî, 2989" },
];

export function getDailyHadith(): Hadith {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return HADITHS[dayOfYear % HADITHS.length];
}
