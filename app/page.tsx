"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight, Bell, Building2, CalendarDays, ChevronRight, Gift, Headphones,
  Heart, MapPin, Search, Sparkles, Ticket, User, UsersRound,
} from "lucide-react";
import { turkishCities } from "./data/cities";
import { useReferenceTheme } from "./reference/use-reference-theme";
import { navigateTo } from "../src/router";

type HomeEvent = {
  slug: string; title: string; image: string; category: string; day: string;
  month: string; location: string; time: string; price: string;
  status: "Satışta" | "Son Biletler" | "Yeni";
};

const events: HomeEvent[] = [
  { slug:"mabel-matiz-fatih-turnesi", title:"Mabel Matiz — Fatih Turnesi", image:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=84&w=1000", category:"Konser", day:"21", month:"EYL", location:"ODTÜ Vişnelik, Ankara", time:"21.00", price:"890 ₺", status:"Son Biletler" },
  { slug:"bir-delinin-hatira-defteri", title:"Bir Delinin Hatıra Defteri", image:"https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=84&w=1000", category:"Tiyatro", day:"28", month:"EYL", location:"CSO Ada, Ankara", time:"20.30", price:"600 ₺", status:"Satışta" },
  { slug:"mesut-sure-iliski-testi", title:"Mesut Süre ile İlişki Testi", image:"https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=84&w=1000", category:"Stand-up", day:"12", month:"EYL", location:"Milyon Performance Hall, Ankara", time:"20.30", price:"450 ₺", status:"Son Biletler" },
  { slug:"elektronik-muzik-festivali", title:"Elektronik Müzik Festivali", image:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=84&w=1000", category:"Festival", day:"24", month:"AĞU", location:"Life Park, İstanbul", time:"14.00–00.00", price:"750 ₺", status:"Satışta" },
  { slug:"alice-harikalar-diyarinda", title:"Alice Harikalar Diyarında", image:"https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=84&w=1000", category:"Çocuk ve Aile", day:"25", month:"AĞU", location:"Maximum Uniq, İstanbul", time:"13.00", price:"320 ₺", status:"Yeni" },
  { slug:"akustik-performanslar", title:"Akustik Performanslar", image:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=84&w=1000", category:"Konser", day:"05", month:"EKİ", location:"IF Performance, Ankara", time:"21.30", price:"390 ₺", status:"Yeni" },
];

const campaigns = [
  { eyebrow:"YAZ FIRSATI", title:"%20 avantaj seni bekliyor", description:"Seçili açık hava konserlerinde NET20 koduyla demo indirimi hemen dene.", cta:"Kampanyayı keşfet", href:"/discover", tone:"violet" },
  { eyebrow:"ARKADAŞINLA GEL", title:"İki kişilik planlar hazır", description:"Tiyatro ve stand-up etkinliklerinde birlikte yerini ayır.", cta:"Etkinlikleri gör", href:"/discover", tone:"orange" },
  { eyebrow:"BU HAFTA SONU", title:"Şehir sahneye çıkıyor", description:"Festivalden tiyatroya, hafta sonunun en iyi planlarını keşfet.", cta:"Hafta sonunu planla", href:"/ne-yapayim", tone:"pink" },
];

const categories = ["Tümü", "Konser", "Tiyatro", "Stand-up", "Festival", "Çocuk ve Aile"];

export default function Home() {
  useReferenceTheme("home");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("İstanbul");
  const [category, setCategory] = useState("Tümü");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [campaignIndex, setCampaignIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setCampaignIndex(index => (index + 1) % campaigns.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleEvents = useMemo(() => events.filter(event => {
    const categoryMatch = category === "Tümü" || event.category === category;
    const searchText = `${event.title} ${event.category} ${event.location}`.toLocaleLowerCase("tr-TR");
    const queryMatch = !query.trim() || searchText.includes(query.toLocaleLowerCase("tr-TR"));
    return categoryMatch && queryMatch;
  }), [category, query]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateTo(`/discover?query=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
  }

  function toggleFavorite(slug: string) {
    setFavorites(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
  }

  const campaign = campaigns[campaignIndex];

  return (
    <main className="netbilet-home">
      <HomeHeader />
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <span className="home-eyebrow"><Sparkles size={15}/> 2026 ETKİNLİK SEZONU</span>
          <h1 id="home-title">Şehrin ritmini<br/><em>yakala.</em></h1>
          <p>En iyi etkinlikleri keşfet, koltuğunu seç ve unutamayacağın anlarda yerini ayır.</p>
          <form className="home-search" onSubmit={search}>
            <label className="home-search-query"><Search size={20}/><input value={query} onChange={event => setQuery(event.target.value)} onFocus={() => setShowSuggestions(true)} onBlur={() => window.setTimeout(() => setShowSuggestions(false), 160)} placeholder="Etkinlik, sanatçı veya mekân ara" aria-label="Etkinlik ara"/></label>
            <label className="home-city-select"><MapPin size={18}/><select value={city} onChange={event => setCity(event.target.value)} aria-label="Şehir seç">{turkishCities.map(item => <option key={item}>{item}</option>)}</select></label>
            <button type="submit">Bilet Bul <ArrowRight size={18}/></button>
            {showSuggestions && <div className="home-suggestions"><small>POPÜLER ARAMALAR</small><Suggestion href="/event/mabel-matiz-fatih-turnesi" icon="🎤" title="Mabel Matiz" detail="Fatih Turnesi"/><Suggestion href="/event/mesut-sure-iliski-testi" icon="😂" title="Mesut Süre" detail="İlişki Testi"/><Suggestion href="/venue/milyon-performance-hall" icon="◉" title="Milyon Performance Hall" detail="Ankara"/></div>}
          </form>
          <div className="home-trending"><span>Popüler:</span>{["Konser", "Stand-up", "Bu hafta sonu"].map(item => <button type="button" onClick={() => setCategory(item === "Bu hafta sonu" ? "Tümü" : item)} key={item}>{item}</button>)}</div>
          <div className="home-hero-actions"><a href="/ne-yapayim"><Sparkles size={18}/> Bana etkinlik öner</a><a href="/discover">Tüm etkinlikler <ArrowRight size={18}/></a></div>
        </div>
        <HeroCategoryCloud />
      </section>

      <section className={`home-campaign ${campaign.tone}`} aria-label="Güncel kampanya">
        <div><span>{campaign.eyebrow}</span><h2>{campaign.title}</h2><p>{campaign.description}</p><a href={campaign.href}>{campaign.cta} <ArrowRight size={18}/></a></div>
        <div className="campaign-code" aria-label="Kampanya kodu"><small>DEMO KOD</small><strong>NET20</strong><span>Ödeme ekranında dene</span></div>
        <nav className="campaign-dots" aria-label="Kampanya seçimi">{campaigns.map((item, index) => <button type="button" className={index === campaignIndex ? "active" : ""} onClick={() => setCampaignIndex(index)} aria-label={`${index + 1}. kampanya: ${item.title}`} key={item.title}/>)}</nav>
      </section>

      <SmartExperience />
      <section className="home-events" id="etkinlikler">
        <header className="home-section-header"><div><span>ŞİMDİ KEŞFET</span><h2>Öne çıkan etkinlikler</h2><p>Şehrin en çok ilgi gören planları tek ekranda.</p></div><a href="/discover">Tümünü gör <ArrowRight size={18}/></a></header>
        <div className="home-event-filters" aria-label="Etkinlik kategorileri">{categories.map(item => <button type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
        {visibleEvents.length ? <div className="home-event-grid">{visibleEvents.map(event => <HomeEventCard event={event} favorite={favorites.includes(event.slug)} onFavorite={() => toggleFavorite(event.slug)} key={event.slug}/>)}</div> : <div className="home-empty"><Search size={30}/><h3>Aramana uygun etkinlik yok</h3><p>Aramayı temizleyip farklı bir kategori deneyebilirsin.</p><button type="button" onClick={() => { setQuery(""); setCategory("Tümü"); }}>Filtreleri temizle</button></div>}
      </section>
      <ExperienceHub />
      <HomeFooter />
      <MobileNavigation />
    </main>
  );
}

function Suggestion({ href, icon, title, detail }: { href: string; icon: string; title: string; detail: string }) {
  return <a href={href}><span>{icon}</span><div><strong>{title}</strong><small>{detail}</small></div><ChevronRight size={17}/></a>;
}

function HomeHeader() {
  return <header className="home-header"><a className="home-brand" href="/" aria-label="NetBilet ana sayfa"><span>NB</span><strong>Net<em>Bilet</em></strong></a><nav className="home-main-nav" aria-label="Ana menü"><a className="active" href="/">Ana Sayfa</a><a href="/discover">Etkinlikler</a><a href="/ne-yapayim">Ne Yapayım?</a><a href="/match">Yalnız Gitme</a><a href="#etkinlikler">Kategoriler</a></nav><div className="home-header-actions"><a className="header-icon" href="/notifications" aria-label="Bildirimler"><Bell size={20}/><i/></a><a className="header-tickets" href="/tickets"><Ticket size={18}/> Biletlerim</a><a className="header-login" href="/auth/login"><User size={18}/> Giriş Yap</a></div></header>;
}

function HeroCategoryCloud() {
  const categoryCards = [
    { title:"Konser", image:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=82&w=700" },
    { title:"Tiyatro", image:"https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=82&w=700" },
    { title:"Festival", image:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=82&w=700" },
    { title:"Stand-up", image:"https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=82&w=700" },
    { title:"Çocuk", image:"https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=82&w=700" },
    { title:"Müzikal", image:"https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&q=82&w=700" },
  ];
  return <aside className="hero-category-cloud" aria-label="Etkinlik kategorileri">
    {categoryCards.map((item, index) => <a className={`hero-category-card category-float-${index + 1}`} href={`/discover?category=${encodeURIComponent(item.title)}`} key={item.title}><img src={item.image} alt={`${item.title} etkinlikleri`} loading={index > 1 ? "lazy" : "eager"}/><span>{item.title}</span></a>)}
  </aside>;
}

function HomeEventCard({ event, favorite, onFavorite }: { event: HomeEvent; favorite: boolean; onFavorite: () => void }) {
  return <article className="home-event-card"><div className="home-event-image"><a href={`/event/${event.slug}`} aria-label={`${event.title} detaylarını aç`}><img src={event.image} alt="" loading="lazy"/></a><span className="home-event-category">{event.category}</span><span className={`home-event-status ${event.status === "Son Biletler" ? "urgent" : ""}`}>{event.status}</span><button className={favorite ? "liked" : ""} type="button" onClick={onFavorite} aria-label={favorite ? "Favorilerden çıkar" : "Favoriye ekle"}><Heart size={19} fill={favorite ? "currentColor" : "none"}/></button><div className="home-event-date"><strong>{event.day}</strong><span>{event.month}</span></div></div><div className="home-event-body"><a href={`/event/${event.slug}`}><h3>{event.title}</h3></a><p><MapPin size={16}/>{event.location}</p><p><CalendarDays size={16}/>{event.day} {event.month} · {event.time}</p><footer><span><small>Başlangıç</small><strong>{event.price}</strong></span><a href={`/event/${event.slug}`}>Bilet Al <ArrowRight size={17}/></a></footer></div></article>;
}

function SmartExperience() {
  return <section className="home-smart"><div className="home-smart-copy"><span><Sparkles size={15}/> AKILLI ÖNERİ</span><h2>Kararı bize bırak.<br/><em>Anı sen yaşa.</em></h2><p>Modunu, bütçeni ve zamanını seç. Sana en uygun etkinliği birkaç saniyede bulalım.</p><a href="/ne-yapayim">Bana bir şey öner <ArrowRight size={18}/></a></div><div className="home-match-card"><header><span>BUGÜNÜN MODU</span><small>3 seçim</small></header><div className="home-match-options"><MatchOption icon="😄" label="MOD" value="Eğlenceli"/><MatchOption icon="👥" label="KİMLE" value="Arkadaşlarla"/><MatchOption icon="₺" label="BÜTÇE" value="300–750"/></div><a href="/ne-yapayim"><Sparkles size={20}/><span><small>SENİN İÇİN</small><strong>%92 eşleşme bulduk</strong></span><ArrowRight size={19}/></a></div></section>;
}

function MatchOption({ icon, label, value }: { icon: string; label: string; value: string }) { return <div><b>{icon}</b><small>{label}</small><strong>{value}</strong></div>; }

function ExperienceHub() {
  const items: { icon: ReactNode; title: string; text: string; href: string; tone: string }[] = [
    { icon:<UsersRound/>, title:"Yalnız Gitme", text:"Aynı etkinliğe ilgi duyan demo profillerle eşleş.", href:"/match", tone:"purple" },
    { icon:<Gift/>, title:"Ödül Çarkı", text:"Puan kazan, çarkı çevir ve kuponunu kullan.", href:"/rewards", tone:"orange" },
    { icon:<Bell/>, title:"Bildirim Merkezi", text:"Bilet ve kampanya gelişmelerini tek yerde gör.", href:"/notifications", tone:"pink" },
    { icon:<Ticket/>, title:"Dijital Bilet", text:"QR bilet, devir ve iade akışlarını dene.", href:"/tickets", tone:"blue" },
    { icon:<Building2/>, title:"Organizatör Ol", text:"Etkinlik oluştur, satış ve kampanya yönet.", href:"/organizer", tone:"green" },
    { icon:<Headphones/>, title:"Destek Merkezi", text:"Demo talebi oluştur ve durumunu takip et.", href:"/support", tone:"violet" },
  ];
  return <section className="home-experience"><header className="home-section-header"><div><span>NETBİLET DENEYİMİ</span><h2>Bilet almaktan daha fazlası</h2><p>Keşiften etkinlik sonrasına kadar bütün deneyim tek yerde.</p></div><a href="/profile">Profilini aç <ArrowRight size={18}/></a></header><div className="home-experience-grid">{items.map(item => <a className={item.tone} href={item.href} key={item.title}><i>{item.icon}</i><span><strong>{item.title}</strong><small>{item.text}</small></span><ChevronRight size={20}/></a>)}</div></section>;
}

function HomeFooter() {
  return <footer className="home-footer"><div className="home-footer-main"><div><a className="home-brand" href="/"><span>NB</span><strong>Net<em>Bilet</em></strong></a><p>Şehrindeki hayatı keşfet.</p></div><FooterColumn title="Keşfet" links={[["Etkinlikler","/discover"],["Ne Yapayım?","/ne-yapayim"],["Yalnız Gitme","/match"],["Ödüller","/rewards"]]}/><FooterColumn title="Hesap" links={[["Biletlerim","/tickets"],["Profilim","/profile"],["Bildirimler","/notifications"],["Yardım","/support"]]}/><FooterColumn title="İş Ortakları" links={[["Organizatör Paneli","/organizer"],["Yeni Etkinlik","/organizer/events/new"],["Yönetim Merkezi","/admin"],["Finans","/admin/finance"]]}/></div><div className="home-footer-bottom"><span>© 2026 NetBilet. Tüm hakları saklıdır.</span><span>Demo ödeme altyapısı · Gerçek tahsilat yapılmaz</span></div></footer>;
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) { return <nav><strong>{title}</strong>{links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</nav>; }

function MobileNavigation() { return <nav className="home-mobile-nav" aria-label="Mobil menü"><a className="active" href="/"><span>⌂</span>Ana Sayfa</a><a href="/discover"><Search size={21}/>Keşfet</a><a className="mobile-feature" href="/ne-yapayim"><Sparkles size={22}/>Ne Yapayım?</a><a href="/tickets"><Ticket size={21}/>Biletlerim</a><a href="/profile"><User size={21}/>Profil</a></nav>; }
