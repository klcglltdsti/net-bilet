import { eventRecords } from "../../../data/events";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const city = params.get("city");
  const category = params.get("category");
  const maxPrice = Number(params.get("price") ?? Number.POSITIVE_INFINITY);
  const events = eventRecords.filter((event) => (!city || event.city.toLocaleLowerCase("tr-TR") === city.toLocaleLowerCase("tr-TR")) && (!category || event.category.toLocaleLowerCase("tr-TR") === category.toLocaleLowerCase("tr-TR")) && event.price <= maxPrice);
  return Response.json({ success: true, data: { events, count: events.length }, message: "Etkinlikler listelendi" });
}

export async function POST() {
  return Response.json({ success: false, error: { code: "AUTH_REQUIRED", message: "Etkinlik oluşturmak için organizatör yetkisi gerekir." } }, { status: 401 });
}
