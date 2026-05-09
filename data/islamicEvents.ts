export interface IslamicEvent {
  id: string;
  name: string;
  date: string; // ISO date string
  type: 'bayram' | 'kandil' | 'ozel';
  description?: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  // 2025
  { id: '2025-regaip', name: 'Regaip Kandili', date: '2025-01-02', type: 'kandil', description: 'Recep ayının ilk Cuma gecesi' },
  { id: '2025-mirac', name: 'Miraç Kandili', date: '2025-01-27', type: 'kandil', description: 'Hz. Peygamberin miracının yıldönümü' },
  { id: '2025-berat', name: 'Berat Kandili', date: '2025-02-14', type: 'kandil', description: 'Şaban ayının 15. gecesi' },
  { id: '2025-ramazan', name: 'Ramazan Başlangıcı', date: '2025-03-01', type: 'ozel', description: 'Ramazan-ı Şerif\'in başlangıcı' },
  { id: '2025-kadir', name: 'Kadir Gecesi', date: '2025-03-27', type: 'kandil', description: 'Ramazanın 27. gecesi' },
  { id: '2025-fıtr', name: 'Ramazan Bayramı', date: '2025-03-30', type: 'bayram', description: 'Ramazan Bayramı (3 gün)' },
  { id: '2025-adha', name: 'Kurban Bayramı', date: '2025-06-06', type: 'bayram', description: 'Kurban Bayramı (4 gün)' },
  { id: '2025-hicri', name: 'Hicri Yılbaşı', date: '2025-06-26', type: 'ozel', description: 'Hicri 1447 yılının başlangıcı' },
  { id: '2025-asure', name: 'Aşure Günü', date: '2025-07-05', type: 'ozel', description: 'Muharremin 10. günü' },
  { id: '2025-mevlid', name: 'Mevlid Kandili', date: '2025-09-04', type: 'kandil', description: 'Hz. Peygamberin doğum yıldönümü' },

  // 2026
  { id: '2026-regaip', name: 'Regaip Kandili', date: '2026-01-22', type: 'kandil' },
  { id: '2026-mirac', name: 'Miraç Kandili', date: '2026-02-16', type: 'kandil' },
  { id: '2026-berat', name: 'Berat Kandili', date: '2026-03-03', type: 'kandil' },
  { id: '2026-ramazan', name: 'Ramazan Başlangıcı', date: '2026-02-18', type: 'ozel' },
  { id: '2026-kadir', name: 'Kadir Gecesi', date: '2026-03-15', type: 'kandil' },
  { id: '2026-fıtr', name: 'Ramazan Bayramı', date: '2026-03-19', type: 'bayram' },
  { id: '2026-adha', name: 'Kurban Bayramı', date: '2026-05-27', type: 'bayram' },
  { id: '2026-hicri', name: 'Hicri Yılbaşı', date: '2026-06-16', type: 'ozel' },
  { id: '2026-mevlid', name: 'Mevlid Kandili', date: '2026-08-24', type: 'kandil' },
];

export function getUpcomingEvents(count = 5): (IslamicEvent & { daysLeft: number })[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return ISLAMIC_EVENTS
    .map(e => {
      const eventDate = new Date(e.date);
      const daysLeft = Math.ceil((eventDate.getTime() - today.getTime()) / 86400000);
      return { ...e, daysLeft };
    })
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, count);
}

export function getEventsByMonth(year: number, month: number): IslamicEvent[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return ISLAMIC_EVENTS.filter(e => e.date.startsWith(prefix));
}
