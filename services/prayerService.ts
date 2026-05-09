import { Coordinates, CalculationMethod, PrayerTimes, Qibla } from 'adhan';

export interface PrayerTimesData {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export function calculatePrayerTimes(lat: number, lng: number, date: Date = new Date()): PrayerTimesData {
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod.Turkey();
  const pt = new PrayerTimes(coords, date, params);
  // Force proper Date instances — adhan can return Date-like objects
  // that lose their prototype after Zustand stores them
  return {
    fajr:    new Date(pt.fajr),
    sunrise: new Date(pt.sunrise),
    dhuhr:   new Date(pt.dhuhr),
    asr:     new Date(pt.asr),
    maghrib: new Date(pt.maghrib),
    isha:    new Date(pt.isha),
  };
}

export function getNextPrayer(
  times: PrayerTimesData,
  lat = 41.0082,
  lng = 28.9784,
): { name: string; time: Date } {
  const nowMs = Date.now();

  const prayers = [
    { name: 'Sabah',   time: new Date(times.fajr) },
    { name: 'Güneş',   time: new Date(times.sunrise) },
    { name: 'Öğle',    time: new Date(times.dhuhr) },
    { name: 'İkindi',  time: new Date(times.asr) },
    { name: 'Akşam',   time: new Date(times.maghrib) },
    { name: 'Yatsı',   time: new Date(times.isha) },
  ];

  // Find the next prayer today
  const next = prayers.find(p => p.time.getTime() > nowMs);
  if (next) return next;

  // All today's prayers have passed → return tomorrow's Fajr
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = calculatePrayerTimes(lat, lng, tomorrow);
  return { name: 'Sabah', time: new Date(tomorrowTimes.fajr) };
}

export function getCountdown(targetTime: Date | string | number): string {
  const diff = new Date(targetTime).getTime() - Date.now();
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatPrayerTime(date: Date | string): string {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function calculateQiblaDirection(lat: number, lng: number): number {
  return Qibla(new Coordinates(lat, lng));
}
