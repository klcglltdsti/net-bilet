export type EventRecord = {
  slug: string;
  title: string;
  artist: string;
  category: string;
  day: string;
  month: string;
  isoDate: string;
  place: string;
  city: string;
  price: number;
  score: number;
  scoreLabel: string;
  art: string;
  mark: string;
  demo?: boolean;
  description?: string;
  capacity?: number;
  sold?: number;
  time?: string;
};

export const eventRecords: EventRecord[] = [
  { slug: "mesut-sure-iliski-testi", title: "Mesut Süre ile İlişki Testi", artist: "Mesut Süre", category: "Stand-up", day: "12", month: "EYL", isoDate: "2026-09-12", place: "Milyon Performance Hall", city: "Ankara", price: 450, score: 92, scoreLabel: "%92 uyum", art: "art-standup", mark: "GÜLMEK\nSERBEST" },
  { slug: "mabel-matiz-fatih-turnesi", title: "Mabel Matiz — Fatih Turnesi", artist: "Mabel Matiz", category: "Konser", day: "21", month: "EYL", isoDate: "2026-09-21", place: "ODTÜ Vişnelik", city: "Ankara", price: 890, score: 88, scoreLabel: "Trend #1", art: "art-concert", mark: "SESİ\nTAKİP ET" },
  { slug: "bir-delinin-hatira-defteri", title: "Bir Delinin Hatıra Defteri", artist: "Erdal Beşikçioğlu", category: "Tiyatro", day: "28", month: "EYL", isoDate: "2026-09-28", place: "CSO Ada", city: "Ankara", price: 600, score: 86, scoreLabel: "%86 uyum", art: "art-theatre", mark: "PERDE\nAÇILIYOR" },
  { slug: "ankara-kahkaha-gecesi", title: "Ankara Kahkaha Gecesi", artist: "Çoklu Sanatçı", category: "Stand-up", day: "03", month: "EKİ", isoDate: "2026-10-03", place: "Jolly Joker Ankara", city: "Ankara", price: 350, score: 81, scoreLabel: "Son 80 bilet", art: "art-coral", mark: "GECE\nSENİN" },
  { slug: "cermodern-gece-sergisi", title: "Gece Müzesi: Işık ve Ses", artist: "CerModern", category: "Sergi", day: "07", month: "EKİ", isoDate: "2026-10-07", place: "CerModern", city: "Ankara", price: 250, score: 79, scoreLabel: "%79 uyum", art: "art-indigo", mark: "IŞIĞI\nKEŞFET" },
  { slug: "aile-festivali", title: "Ankara Aile Festivali", artist: "Buluş Çocuk", category: "Aile", day: "11", month: "EKİ", isoDate: "2026-10-11", place: "Atatürk Orman Çiftliği", city: "Ankara", price: 180, score: 74, scoreLabel: "Aile seçimi", art: "art-gold", mark: "BİRLİKTE\nEĞLEN" },
];

export function findEvent(slug: string) {
  return eventRecords.find((event) => event.slug === slug) ?? eventRecords[0];
}
