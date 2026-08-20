import { eventRecords } from "../../../data/events";

export async function POST(request: Request) {
  const input = await request.json().catch(() => ({})) as { mood?: string; budget?: number; city?: string; company?: string };
  const budget = input.budget ?? 750;
  const ranked = eventRecords.map((event) => {
    const category = input.mood?.includes("Kültür") ? (event.category === "Tiyatro" || event.category === "Sergi" ? 30 : 10) : event.category === "Stand-up" ? 30 : 18;
    const history = event.score * .2;
    const location = !input.city || event.city === input.city ? 20 : 5;
    const price = event.price <= budget ? 15 : Math.max(0, 15 - (event.price - budget) / 50);
    const popularity = event.score * .1;
    const social = input.company === "Arkadaşlarla" ? 5 : 3;
    return { event, score: Math.round(category + history + location + price + popularity + social), reason: ["İlgi alanına uygun", "Bütçene yakın", "Şehrinde popüler"] };
  }).sort((a, b) => b.score - a.score);
  return Response.json({ success: true, data: { recommendation: ranked[0], alternatives: ranked.slice(1, 4) }, message: "Önerin hazır" });
}
