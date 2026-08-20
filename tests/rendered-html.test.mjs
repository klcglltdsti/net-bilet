import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
let workerPromise;

async function worker() {
  workerPromise ??= import(new URL("../dist/server/index.js", import.meta.url).href).then(
    ({ default: builtWorker }) => builtWorker,
  );
  return workerPromise;
}

async function request(path = "/", init) {
  const builtWorker = await worker();
  return builtWorker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", ...init?.headers },
      ...init,
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("ana sayfa BULUŞ deneyimini ve mutlak sosyal paylaşım görselini sunar", async () => {
  const response = await request();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>BULUŞ — Şehrinle buluş<\/title>/i);
  assert.match(html, /Şehrinle buluş/i);
  assert.match(html, /Ne Yapayım\?/i);
  assert.match(html, /http:\/\/localhost:3000\/og\.png/i);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/i);
});

test("etkinlik sayfası kendi başlık ve açıklamasını üretir", async () => {
  const response = await request("/event/mesut-sure-iliski-testi");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Mesut Süre ile İlişki Testi \| BULUŞ/i);
  assert.match(html, /Milyon Performance Hall/i);
  assert.doesNotMatch(html, /property="og:image"[^>]*og\.png/i);
});

test("sağlık ve koltuk rezervasyon API'leri beklenen sözleşmeyi döndürür", async () => {
  const health = await request("/api/v1/health", {
    headers: { accept: "application/json" },
  });
  assert.equal(health.status, 200);
  const healthPayload = await health.json();
  assert.equal(healthPayload.success, true);
  assert.equal(healthPayload.data.status, "operational");
  assert.ok(healthPayload.data.services.includes("ticket"));

  const reservation = await request("/api/v1/seats/reserve", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ sessionId: 42, seatIds: ["A1", "A2"] }),
  });
  assert.equal(reservation.status, 200);
  const payload = await reservation.json();
  assert.equal(payload.success, true);
  assert.equal(payload.data.status, "LOCKED");
  assert.deepEqual(payload.data.seatIds, ["A1", "A2"]);
  assert.match(payload.data.reservationId, /^RSV-/);
  const holdMilliseconds = Date.parse(payload.data.expiresAt) - Date.now();
  assert.ok(holdMilliseconds > 14 * 60 * 1000);
  assert.ok(holdMilliseconds <= 15 * 60 * 1000);
});

test("teslim paketi veri şeması, migration ve sosyal görseli içerir", async () => {
  const [schema, migration] = await Promise.all([
    readFile(new URL("db/schema.ts", projectRoot), "utf8"),
    readFile(new URL("drizzle/0000_jittery_fixer.sql", projectRoot), "utf8"),
    access(new URL("public/og.png", projectRoot)),
  ]);

  assert.match(schema, /export const users/);
  assert.match(schema, /export const events/);
  assert.match(schema, /export const tickets/);
  assert.match(schema, /export const auditLogs/);
  assert.match(migration, /CREATE TABLE `users`/);
  assert.match(migration, /CREATE TABLE `seat_locks`/);
  assert.match(migration, /PRAGMA optimize;/);
});

test("yerel demo akışları etkinlik, satış, bilet ve profil verilerini birbirine bağlar", async () => {
  const [store, wizard, checkout, profile] = await Promise.all([
    readFile(new URL("app/lib/demo-store.ts", projectRoot), "utf8"),
    readFile(new URL("app/organizer/events/new/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/checkout/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/profile/page.tsx", projectRoot), "utf8"),
  ]);

  assert.match(store, /addDemoEvent/);
  assert.match(store, /recordDemoSale/);
  assert.match(store, /updateDemoUser/);
  assert.match(wizard, /Demo etkinliğini yayınla/);
  assert.match(checkout, /Test satışını tamamla/);
  assert.match(profile, /Profili kaydet/);

  const organizer = await request("/organizer");
  assert.equal(organizer.status, 200);
  assert.match(await organizer.text(), /Çalışan demo modu/);
});

test("organizatör panelindeki tüm çalışma alanları erişilebilir", async () => {
  const routes = [
    ["/organizer/events", /Etkinliklerini yayınla/], ["/organizer/tickets", /Bilet yönetimi/],
    ["/organizer/sales", /Siparişleri incele/], ["/organizer/campaigns", /İndirim kodlarını/],
    ["/organizer/finance", /Tahsilat, komisyon/], ["/organizer/reports", /performansını analiz/],
    ["/organizer/team", /Ekip arkadaşlarını/],
  ];
  for (const [path, expected] of routes) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected, path);
  }
});

test("admin panelindeki tüm çalışma alanları erişilebilir", async () => {
  const routes = [
    ["/admin/users", /Demo hesaplarını/], ["/admin/organizers", /Başvuru, komisyon/],
    ["/admin/events", /Platformdaki içerikleri/], ["/admin/finance", /Demo ödemeleri/],
    ["/admin/moderation", /karara bağla/], ["/admin/support", /Kullanıcı taleplerini/],
    ["/admin/settings", /demo çalışma tercihlerini/],
  ];
  for (const [path, expected] of routes) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected, path);
  }
});

test("demo mağazası operasyon verilerini ve 81 ili içerir", async () => {
  const [store, cities, checkout, panel] = await Promise.all([
    readFile(new URL("app/lib/demo-store.ts", projectRoot), "utf8"),
    readFile(new URL("app/data/cities.ts", projectRoot), "utf8"),
    readFile(new URL("app/checkout/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/components/PanelShell.tsx", projectRoot), "utf8"),
  ]);
  assert.match(store, /organizers: DemoOrganizer\[\]/);
  assert.match(store, /supportTickets: DemoSupportTicket\[\]/);
  assert.match(store, /updateDemoModeration/);
  assert.equal((cities.match(/"[^"\n]+"/g) ?? []).length, 81);
  assert.match(checkout, /Reddedilen ödeme/);
  assert.match(panel, /\/admin\/organizers/);
  assert.match(panel, /\/organizer\/reports/);
});
