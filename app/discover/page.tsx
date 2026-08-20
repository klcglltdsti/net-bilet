"use client";

import { useMemo, useState } from "react";
import { EventCard } from "../components/EventCard";
import { SubHeader } from "../components/SubHeader";
import { eventRecords } from "../data/events";
import { turkishCities } from "../data/cities";
import { useDemoState } from "../lib/demo-store";

const categories = ["Tümü", "Konser", "Stand-up", "Tiyatro", "Sergi", "Aile"];

export default function DiscoverPage() {
  const demo = useDemoState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [date, setDate] = useState("Bu hafta");
  const [city, setCity] = useState("Tüm şehirler");
  const [sort, setSort] = useState("Sana en uygun");

  const results = useMemo(() => [...demo.events.filter(event => event.status === "Yayında"), ...eventRecords].filter((event) => {
    const haystack = `${event.title} ${event.artist} ${event.place} ${event.city}`.toLocaleLowerCase("tr-TR");
    return haystack.includes(query.toLocaleLowerCase("tr-TR")) && (category === "Tümü" || event.category === category) && (city === "Tüm şehirler" || event.city === city) && event.price <= maxPrice;
  }).sort((a,b)=>sort==="Fiyat: düşükten yükseğe"?a.price-b.price:sort==="En yakın tarih"?a.isoDate.localeCompare(b.isoDate):b.score-a.score), [query, category, city, maxPrice, sort, demo.events]);

  return (
    <main className="subpage">
      <SubHeader active="discover" />
      <section className="discover-hero">
        <span className="section-kicker">ŞEHRİ KEŞFET</span><h1>Bugün neye<br /><em>yakınsın?</em></h1>
        <div className="discover-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={event=>event.key==="Enter"&&document.getElementById("discover-results")?.scrollIntoView({behavior:"smooth"})} placeholder="Etkinlik, sanatçı, mekan veya organizatör ara" aria-label="Arama" /><button type="button" onClick={()=>document.getElementById("discover-results")?.scrollIntoView({behavior:"smooth"})}>Ara</button></div>
      </section>

      <section className="discover-layout">
        <aside className="filter-panel">
          <div className="filter-title"><strong>Filtreler</strong><button type="button" onClick={() => { setQuery(""); setCategory("Tümü"); setCity("Tüm şehirler"); setMaxPrice(1500); setDate("Bu hafta"); setSort("Sana en uygun"); }}>Temizle</button></div>
          <label>ŞEHİR<select value={city} onChange={event=>setCity(event.target.value)}><option>Tüm şehirler</option>{turkishCities.map(item=><option key={item}>{item}</option>)}</select></label>
          <fieldset><legend>TARİH</legend>{["Bugün", "Bu hafta", "Bu ay"].map((item) => <button className={date === item ? "active" : ""} type="button" onClick={() => setDate(item)} key={item}>{item}</button>)}</fieldset>
          <label>FİYAT ARALIĞI <output>{maxPrice.toLocaleString("tr-TR")} TL'ye kadar</output><input type="range" min="200" max="1500" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label>
          <fieldset><legend>MESAFE</legend><label className="radio-line"><input type="radio" name="distance" defaultChecked /> 10 km içinde</label><label className="radio-line"><input type="radio" name="distance" /> 50 km içinde</label><label className="radio-line"><input type="radio" name="distance" /> Tüm şehir</label></fieldset>
        </aside>
        <div className="discover-results" id="discover-results">
          {demo.events.length > 0 && <div className="demo-data-banner"><span>✓</span><p><strong>{demo.events.length} demo etkinliğin yayında</strong><small>Organizatör panelinden eklediğin etkinlikler listenin başında gösteriliyor.</small></p><a href="/organizer">Paneli aç →</a></div>}
          <div className="result-head"><div><span>{city.toLocaleUpperCase("tr-TR")} · {date.toLocaleUpperCase("tr-TR")}</span><h2>{results.length} etkinlik bulduk</h2></div><select value={sort} onChange={event=>setSort(event.target.value)} aria-label="Sıralama"><option>Sana en uygun</option><option>En yakın tarih</option><option>Fiyat: düşükten yükseğe</option></select></div>
          <div className="category-chips">{categories.map((item) => <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} type="button" key={item}>{item}</button>)}</div>
          {results.length ? <div className="event-grid discover-grid">{results.map((event) => <EventCard event={event} key={event.slug} />)}</div> : <div className="empty-state"><span>⌕</span><h3>Bu filtrelerle etkinlik bulamadık</h3><p>{city === "Tüm şehirler" ? "Fiyat aralığını genişletmeyi veya başka bir kategori seçmeyi dene." : `${city} için henüz etkinlik yok. Organizatör panelinden bu şehre test etkinliği ekleyebilirsin.`}</p><button type="button" onClick={() => { setQuery(""); setCategory("Tümü"); setCity("Tüm şehirler"); setMaxPrice(1500); }}>Filtreleri temizle</button><a href="/organizer/events/new">Etkinlik ekle →</a></div>}
        </div>
      </section>
    </main>
  );
}
