"use client";

import { useDemoState } from "../lib/demo-store";

export function SubHeader({ active = "" }: { active?: string }) {
  const demo = useDemoState();
  const initials = demo.currentUser.name.split(" ").map(word => word[0]).join("").slice(0, 2).toLocaleUpperCase("tr-TR");
  return (
    <header className="sub-header">
      <a className="brand" href="/" aria-label="Buluş ana sayfa"><span className="brand-dot">b</span><span>BULUŞ</span></a>
      <nav aria-label="Ana menü">
        <a className={active === "discover" ? "active" : ""} href="/discover">Keşfet</a>
        <a className={active === "recommend" ? "active" : ""} href="/ne-yapayim">Ne Yapayım?</a>
        <a className={active === "tickets" ? "active" : ""} href="/tickets">Biletlerim</a>
      </nav>
      <div className="sub-actions"><span className="demo-running-pill">DEMO</span><a href="/rewards" className="mini-action">Ödüller</a><a href="/notifications" className="notice-link" aria-label="Bildirimler">◇<i /></a><a className="profile-button" href="/profile" title={demo.currentUser.name} aria-label={`${demo.currentUser.name} profili`}>{initials}</a></div>
    </header>
  );
}
