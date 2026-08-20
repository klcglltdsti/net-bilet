"use client";

import { useState } from "react";
import { turkishCities } from "./data/cities";
import { navigateTo } from "../src/router";

const stories = [
  { name: "Mesut Süre", tone: "story-orange", initials: "MS", live: true, href:"/artist/mesut-sure" },
  { name: "IF Ankara", tone: "story-purple", initials: "IF", href:"/discover" },
  { name: "Zorlu PSM", tone: "story-pink", initials: "ZP", href:"/discover" },
  { name: "BKM", tone: "story-coral", initials: "BK", href:"/company/bkm" },
  { name: "Mabel Matiz", tone: "story-indigo", initials: "MM", href:"/event/mabel-matiz-fatih-turnesi" },
  { name: "CerModern", tone: "story-gold", initials: "CM", href:"/event/cermodern-gece-sergisi" },
];

const events = [
  { slug: "mesut-sure-iliski-testi", title: "Mesut Süre ile İlişki Testi", type: "STAND-UP", day: "12", month: "EYL", place: "Milyon Performance Hall", city: "Ankara", price: "450 TL", score: "%92 uyum", art: "art-standup", mark: "GÜLMEK\nSERBEST" },
  { slug: "mabel-matiz-fatih-turnesi", title: "Mabel Matiz — Fatih Turnesi", type: "KONSER", day: "21", month: "EYL", place: "ODTÜ Vişnelik", city: "Ankara", price: "890 TL", score: "Trend #1", art: "art-concert", mark: "SESİ\nTAKİP ET" },
  { slug: "bir-delinin-hatira-defteri", title: "Bir Delinin Hatıra Defteri", type: "TİYATRO", day: "28", month: "EYL", place: "CSO Ada", city: "Ankara", price: "600 TL", score: "%86 uyum", art: "art-theatre", mark: "PERDE\nAÇILIYOR" },
];

export default function Home() {
  const [category,setCategory]=useState("Tümü"); const [query,setQuery]=useState(""); const [city,setCity]=useState("Ankara"); const [favorites,setFavorites]=useState<string[]>([]);
  const visibleEvents=events.filter(event=>(category==="Tümü"||event.type.toLocaleLowerCase("tr-TR")===category.toLocaleLowerCase("tr-TR"))&&`${event.title} ${event.place}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")));
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Buluş ana sayfa"><span className="brand-dot">b</span><span>BULUŞ</span></a>
        <nav className="desktop-nav" aria-label="Ana menü"><a className="active" href="/discover">Keşfet</a><a href="/ne-yapayim">Ne Yapayım?</a><a href="#etkinlikler">Etkinlikler</a><a href="/organizer">Organizatör</a></nav>
        <div className="top-actions"><label className="city-picker"><span>●</span><select value={city} onChange={event=>{setCity(event.target.value);if(event.target.value!=="Ankara")navigateTo("/discover")}} aria-label="Şehir seç">{turkishCities.map(item=><option key={item}>{item}</option>)}</select></label><a className="icon-button" href="/notifications" aria-label="Bildirimler">♢<i /></a><a className="profile-button" href="/profile" aria-label="Profil">AY</a></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">ANKARA'DA BU HAFTA</span>
          <h1>Plan arama.<br /><em>Anını bul.</em></h1>
          <p>Şehrindeki en iyi etkinlikleri keşfet, arkadaşlarınla paylaş ve yerini ayırt.</p>
          <form className="search-box" onSubmit={event=>{event.preventDefault();document.getElementById("etkinlikler")?.scrollIntoView({behavior:"smooth"})}}><span aria-hidden="true">⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} aria-label="Etkinlik ara" placeholder="Etkinlik, sanatçı veya mekan ara" /><button type="submit">Ara</button></form>
          <div className="quick-tags" aria-label="Popüler aramalar"><span>Popüler:</span><a href="#etkinlikler">Stand-up</a><a href="#etkinlikler">Konser</a><a href="#etkinlikler">Bu hafta sonu</a></div>
        </div>

        <div className="hero-poster" aria-label="Öne çıkan etkinlik Mesut Süre">
          <div className="poster-orbit orbit-one" /><div className="poster-orbit orbit-two" />
          <div className="poster-date"><strong>12</strong><span>EYL</span></div><div className="poster-type">STAND-UP · ANKARA</div>
          <div className="poster-title">İLİŞKİ<br /><span>TESTİ</span></div><div className="poster-person">MESUT SÜRE</div>
          <a className="poster-cta" href="/event/mesut-sure-iliski-testi">Biletleri gör <span>↗</span></a><div className="poster-stamp">SON<br />100<br />BİLET</div>
        </div>
      </section>

      <section className="stories-section" id="kesfet">
        <div className="section-heading compact-heading"><div><span className="section-kicker">CANLI AKIŞ</span><h2>Şu an neler oluyor?</h2></div><a href="#etkinlikler">Tümünü gör <span>→</span></a></div>
        <div className="stories-row">{stories.map((story) => <a className="story" href={story.href} key={story.name}><span className={`story-ring ${story.tone}`}><b>{story.initials}</b></span><span className="story-name">{story.name}</span>{story.live && <small>YENİ</small>}</a>)}</div>
      </section>

      <section className="recommendation" id="neyapayim">
        <div className="recommendation-copy"><span className="ai-badge">✦ AKILLI ÖNERİ</span><h2>Ne yapacağına<br />karar veremedin mi?</h2><p>Modunu, bütçeni ve zamanını seç. Sana en uygun etkinliği saniyeler içinde bulalım.</p><a className="primary-button" href="/ne-yapayim"><span>🎲</span> Bana bir şey öner <b>→</b></a></div>
        <div className="slot-card" aria-label="Ne Yapayım öneri örneği"><div className="slot-top"><span>BUGÜNÜN MODU</span><b>•••</b></div><div className="slot-reels"><div><small>MOD</small><strong>😄</strong><span>Eğlenceli</span></div><div><small>KİMLE</small><strong>👥</strong><span>Arkadaşlarla</span></div><div><small>BÜTÇE</small><strong>₺</strong><span>300–750</span></div></div><div className="slot-result"><span>✦</span><p><small>SENİN İÇİN</small><strong>%92 eşleşme bulduk</strong></p><b>↗</b></div></div>
      </section>

      <section className="events-section" id="etkinlikler">
        <div className="section-heading"><div><span className="section-kicker">SANA ÖZEL</span><h2>Bu hafta şehirde</h2></div><div className="filters" aria-label="Etkinlik filtreleri">{["Tümü","Konser","Stand-up","Tiyatro"].map(item=><button className={category===item?"selected":""} onClick={()=>setCategory(item)} type="button" key={item}>{item}</button>)}</div></div>
        {visibleEvents.length?<div className="event-grid">{visibleEvents.map((event) => <article className="event-card" key={event.title}><div className={`event-art ${event.art}`}><span className="event-type">{event.type}</span><button className={`heart ${favorites.includes(event.slug)?"liked":""}`} onClick={()=>setFavorites(current=>current.includes(event.slug)?current.filter(item=>item!==event.slug):[...current,event.slug])} type="button" aria-label={`${event.title} favorilere ekle`}>{favorites.includes(event.slug)?"♥":"♡"}</button><strong>{event.mark.split("\n").map((line) => <span key={line}>{line}</span>)}</strong><i>{event.score}</i></div><div className="event-info"><div className="date-box"><strong>{event.day}</strong><span>{event.month}</span></div><div className="event-details"><h3>{event.title}</h3><p>{event.place} · {event.city}</p><span>{event.price}'den başlayan</span></div><a href={`/event/${event.slug}`} aria-label={`${event.title} detayları`}>↗</a></div></article>)}</div>:<div className="guided-empty"><span>⌕</span><h3>Aramana uygun etkinlik yok</h3><p>Arama metnini temizleyebilir veya farklı bir kategori seçebilirsin.</p><button type="button" onClick={()=>{setQuery("");setCategory("Tümü")}}>Aramayı temizle</button></div>}
        <a className="all-events" href="/discover">Tüm etkinlikleri keşfet <span>→</span></a>
      </section>

      <footer className="site-footer"><div><a className="brand" href="/"><span className="brand-dot">b</span><span>BULUŞ</span></a><p>Şehrindeki hayatı keşfet.</p></div><nav><strong>KEŞFET</strong><a href="/discover">Etkinlikler</a><a href="/ne-yapayim">Ne Yapayım?</a><a href="/match">Yalnız Gitme</a><a href="/rewards">Ödüller</a></nav><nav><strong>HESAP</strong><a href="/tickets">Biletlerim</a><a href="/profile">Profil</a><a href="/auth/login">Giriş yap</a><a href="/support">Yardım</a></nav><nav><strong>İŞ ORTAKLARI</strong><a href="/organizer">Organizatör paneli</a><a href="/company/bkm">Organizatör profili</a><a href="/admin">Yönetim paneli</a></nav><div className="footer-note">© 2026 BULUŞ · KVKK · Gizlilik · Koşullar</div></footer>

      <nav className="mobile-nav" aria-label="Mobil menü"><a className="active" href="/"><span>⌂</span>Ana Sayfa</a><a href="/discover"><span>⌕</span>Keşfet</a><a className="mobile-game" href="/ne-yapayim"><span>✦</span>Ne Yapayım?</a><a href="/tickets"><span>▣</span>Biletlerim</a><a href="/profile"><span>○</span>Profil</a></nav>
    </main>
  );
}
