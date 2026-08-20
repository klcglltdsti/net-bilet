"use client";

import { useEffect, useState } from "react";
import { EventCard } from "../components/EventCard";
import { SubHeader } from "../components/SubHeader";
import { eventRecords } from "../data/events";
import { updateDemoUser, useDemoState } from "../lib/demo-store";

export default function ProfilePage() {
  const demo = useDemoState();
  const [tab, setTab] = useState("Favoriler");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(demo.currentUser);
  useEffect(() => setForm(demo.currentUser), [demo.currentUser]);
  const initials = demo.currentUser.name.split(" ").map(word => word[0]).join("").slice(0, 2).toLocaleUpperCase("tr-TR");

  function saveProfile() {
    updateDemoUser(form);
    setEditing(false);
  }

  return <main className="profile-page"><SubHeader /><section className="profile-cover"><div className="profile-shape one" /><div className="profile-shape two" /></section><section className="profile-main"><div className="profile-summary"><div className="big-avatar">{initials}<span>✓</span></div><div><h1>{demo.currentUser.name}</h1><p>● {demo.currentUser.city} · Demo hesabı · {demo.currentUser.email}</p></div><button type="button" onClick={() => setEditing(!editing)}>{editing ? "Düzenlemeyi kapat" : "Profili düzenle"}</button><a className="profile-login-link" href="/auth/login">Hesap değiştir</a></div>{editing && <section className="profile-editor"><div><span className="section-kicker">DEMO PROFİL</span><h2>Bilgilerini düzenle</h2><p>Kaydettiğin bilgiler menüde ve test satışlarında hemen kullanılır.</p></div><div className="profile-editor-form"><label>Ad soyad<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label><label>Şehir<input value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} /></label><label>E-posta<input value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label><label>Telefon<input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} /></label><label className="wide">Kısa açıklama<textarea value={form.bio} onChange={event => setForm({ ...form, bio: event.target.value })} /></label><button type="button" onClick={saveProfile}>Profili kaydet ✓</button></div></section>}<p className="profile-bio">{demo.currentUser.bio}</p><div className="profile-stats"><span><strong>{28 + demo.tickets.length}</strong><small>Etkinlik</small></span><span><strong>184</strong><small>Takipçi</small></span><span><strong>96</strong><small>Takip edilen</small></span><span><strong>12</strong><small>Rozet</small></span></div><div className="profile-badges"><div><span>😂</span><p><strong>Stand-up fanı</strong><small>8 etkinlik</small></p></div><div><span>🎭</span><p><strong>Kültür avcısı</strong><small>12 etkinlik</small></p></div><div><span>🔥</span><p><strong>4 haftalık seri</strong><small>Bu hafta aktif</small></p></div><div><span>👥</span><p><strong>Sosyal gezgin</strong><small>7 arkadaş daveti</small></p></div></div><nav className="profile-tabs">{["Etkinliklerim", "Biletlerim", "Favoriler", "Rozetler"].map(item => <button className={tab === item ? "active" : ""} type="button" onClick={() => setTab(item)} key={item}>{item}</button>)}</nav>{tab === "Favoriler" ? <div className="event-grid profile-events">{eventRecords.slice(0, 3).map(event => <EventCard event={event} key={event.slug} />)}</div> : <div className="profile-tab-card"><span>{tab === "Biletlerim" ? "▣" : tab === "Rozetler" ? "✦" : "✓"}</span><h2>{tab}</h2><p>{tab === "Biletlerim" && demo.tickets.length ? `${demo.tickets.length} demo biletin hazır.` : "Bu alan tercihine göre görünür. Gizlilik ayarlarını dilediğin zaman değiştirebilirsin."}</p><a href={tab === "Biletlerim" ? "/tickets" : "/discover"}>Alanı aç →</a></div>}</section></main>;
}
