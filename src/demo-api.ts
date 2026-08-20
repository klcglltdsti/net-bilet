import { eventRecords } from "../app/data/events";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function installDemoApi() {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const rawUrl = input instanceof Request ? input.url : String(input);
    const url = new URL(rawUrl, window.location.href);
    const apiIndex = url.pathname.indexOf("/api/v1/");
    if (apiIndex < 0) return nativeFetch(input, init);

    const path = url.pathname.slice(apiIndex);
    if (path === "/api/v1/health") {
      return json({ success: true, data: { status: "operational", mode: "browser-demo", services: ["event", "seat", "ticket", "payment"] } });
    }
    if (path === "/api/v1/events") {
      const city = url.searchParams.get("city");
      const data = city ? eventRecords.filter(event => event.city === city) : eventRecords;
      return json({ success: true, data });
    }
    if (path === "/api/v1/recommendations") {
      return json({ success: true, data: eventRecords.slice(0, 3) });
    }
    if (path === "/api/v1/seats/reserve" && (init?.method ?? "GET").toUpperCase() === "POST") {
      const body = JSON.parse(String(init?.body ?? "{}")) as { sessionId?: number; seatIds?: string[] };
      return json({ success: true, data: { reservationId: `RSV-${Date.now()}`, sessionId: body.sessionId, seatIds: body.seatIds ?? [], status: "LOCKED", expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() } });
    }
    if (path === "/api/v1/tickets/verify") {
      return json({ success: true, data: { valid: true, mode: "DEMO", checkedAt: new Date().toISOString() } });
    }
    return json({ success: false, error: "Demo API adresi bulunamadı." }, 404);
  };
}
