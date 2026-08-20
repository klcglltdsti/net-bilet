"use client";

import type { ReactNode } from "react";
import { useDemoState } from "../lib/demo-store";

const organizerNav = [
  ["Genel Bakış", "/organizer", "▦"], ["Etkinlikler", "/organizer/events", "◇"], ["Biletler", "/organizer/tickets", "▣"], ["Satışlar", "/organizer/sales", "↗"], ["Kampanyalar", "/organizer/campaigns", "%"], ["Finans", "/organizer/finance", "₺"], ["Raporlar", "/organizer/reports", "≋"], ["Takım", "/organizer/team", "◎"],
];
const adminNav = [
  ["Genel Bakış", "/admin", "▦"], ["Kullanıcılar", "/admin/users", "◎"], ["Organizatörler", "/admin/organizers", "▣"], ["Etkinlikler", "/admin/events", "◇"], ["Finans", "/admin/finance", "₺"], ["Moderasyon", "/admin/moderation", "!"], ["Destek", "/admin/support", "?"], ["Ayarlar", "/admin/settings", "⚙"],
];

export function PanelShell({ children, area = "organizer", active = "Genel Bakış", title, subtitle, action }: { children: ReactNode; area?: "organizer" | "admin"; active?: string; title: string; subtitle: string; action?: ReactNode }) {
  const nav = area === "admin" ? adminNav : organizerNav;
  const demo = useDemoState();
  const pendingCount = demo.moderation.filter(item=>item.status==="Bekliyor").length;
  return (
    <main className="panel-shell">
      <aside className="panel-sidebar">
        <a className="brand panel-brand" href="/"><span className="brand-dot">b</span><span>BULUŞ</span><small>{area === "admin" ? "YÖNETİM" : "BUSINESS"}</small></a>
        <nav>{nav.map(([label, href, icon]) => <a className={active === label ? "active" : ""} href={href} key={label}><span>{icon}</span>{label}{label === "Moderasyon" && pendingCount > 0 && <i>{pendingCount}</i>}</a>)}</nav>
        <div className="panel-help"><span>?</span><strong>Yardıma mı ihtiyacın var?</strong><p>Destek ekibimiz yanında.</p><a href={area === "admin" ? "/admin/support" : "/support"}>Destek al</a></div>
        <a className="back-home" href="/">← Kullanıcı sitesine dön</a>
      </aside>
      <section className="panel-content">
        <header className="panel-top"><div><span>{area === "admin" ? "Platform Yönetimi" : "BKM Organizasyon"}</span><b>DEMO</b></div><div><a href={area === "admin" ? "/admin/events" : "/organizer/events"} aria-label="Ara">⌕</a><a href={area === "admin" ? "/admin/moderation" : "/notifications"} aria-label="Bildirimler">♢<i /></a><a className="profile-button" href={area === "admin" ? "/admin/settings" : "/organizer/team"}>HK</a></div></header>
        <div className="panel-page-head"><div><p>{area === "admin" ? "OPERASYON MERKEZİ" : "BUGÜN · 20 AĞUSTOS 2026"}</p><h1>{title}</h1><span>{subtitle}</span></div>{action}</div>
        {children}
      </section>
    </main>
  );
}
