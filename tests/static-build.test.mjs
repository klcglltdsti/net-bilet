import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("üretim çıktısı gerçek statik giriş dosyasını ve varlıkları içerir", async () => {
  const html = await readFile(new URL("dist/index.html", root), "utf8");
  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /BULUŞ — Şehrinle buluş/);
  assert.match(html, /assets\/[^"]+\.js/);
  assert.match(html, /assets\/[^"]+\.css/);
  await Promise.all([
    access(new URL("dist/404.html", root)),
    access(new URL("dist/.nojekyll", root)),
    access(new URL("dist/og.png", root)),
  ]);
});

test("Vinext ve özel yayın bağımlılıkları tamamen kaldırılmıştır", async () => {
  const [pkg, vite] = await Promise.all([
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("vite.config.ts", root), "utf8"),
  ]);
  assert.doesNotMatch(pkg, /vinext|openai|cloudflare|wrangler|next/i);
  assert.doesNotMatch(vite, /vinext|openai|cloudflare|wrangler|next/i);
  assert.match(pkg, /"vite"/);
  assert.match(pkg, /"react"/);
});

test("tüm kullanıcı, organizatör ve admin rotaları statik yönlendiricide vardır", async () => {
  const app = await readFile(new URL("src/App.tsx", root), "utf8");
  for (const route of ["/discover", "/checkout", "/tickets", "/profile", "/organizer", "/organizer/events/new", "/organizer/finance", "/admin", "/admin/finance", "/admin/support"]) {
    assert.match(app, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.match(app, /DemoEventExperience/);
  assert.match(app, /EventExperience/);
});

test("demo işlemleri birbirine bağlı kalır", async () => {
  const [store, wizard, checkout, support] = await Promise.all([
    readFile(new URL("app/lib/demo-store.ts", root), "utf8"),
    readFile(new URL("app/organizer/events/new/page.tsx", root), "utf8"),
    readFile(new URL("app/checkout/page.tsx", root), "utf8"),
    readFile(new URL("app/support/page.tsx", root), "utf8"),
  ]);
  assert.match(store, /addDemoEvent/);
  assert.match(store, /recordDemoSale/);
  assert.match(store, /addDemoSupportTicket/);
  assert.match(wizard, /Demo etkinliğini yayınla/);
  assert.match(checkout, /Test satışını tamamla/);
  assert.match(support, /Talebi gönder/);
});

test("81 şehir ve tarayıcı içi API simülasyonu korunur", async () => {
  const [cities, api] = await Promise.all([
    readFile(new URL("app/data/cities.ts", root), "utf8"),
    readFile(new URL("src/demo-api.ts", root), "utf8"),
  ]);
  assert.equal((cities.match(/"[^"\n]+"/g) ?? []).length, 81);
  assert.match(api, /\/api\/v1\/health/);
  assert.match(api, /\/api\/v1\/seats\/reserve/);
  assert.match(api, /\/api\/v1\/tickets\/verify/);
});

test("kullanıcının NetBilet ekranları çalışan rotalara bağlanır", async () => {
  const [home, baseTheme, homeTheme, responsiveTheme, themeHook, router, checkout] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/netbilet-base.css", root), "utf8"),
    readFile(new URL("app/netbilet-home.css", root), "utf8"),
    readFile(new URL("app/reference/responsive.css", root), "utf8"),
    readFile(new URL("app/reference/use-reference-theme.ts", root), "utf8"),
    readFile(new URL("src/App.tsx", root), "utf8"),
    readFile(new URL("app/reference/Checkout.tsx", root), "utf8"),
  ]);
  assert.match(home, /En İyi Etkinlikleri/);
  assert.match(home, /campaign-banner/);
  assert.match(baseTheme, /#120b1c/);
  assert.match(homeTheme, /floating-cards/);
  assert.match(home, /SmartExperience/);
  assert.match(home, /ExperienceHub/);
  assert.match(home, /\/match/);
  assert.match(home, /\/rewards/);
  assert.match(responsiveTheme, /max-width:720px/);
  assert.match(themeHook, /screenCss/);
  assert.match(router, /ReferenceEventDetail/);
  assert.match(router, /ReferenceArtistProfile/);
  assert.match(router, /ReferenceVenueProfile/);
  assert.match(router, /ReferenceProfile/);
  assert.match(checkout, /recordDemoSale/);
  assert.match(checkout, /Reddedilen ödeme/);
  assert.match(checkout, /NET20/);
  assert.match(checkout, /installments/);
});
