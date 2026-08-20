"use client";

import { useState } from "react";
import { EventCard } from "../../components/EventCard";
import { SubHeader } from "../../components/SubHeader";
import { eventRecords, type EventRecord } from "../../data/events";

const sessions = [
  { id: 1, day: "12", month: "Eyl", weekday: "Cmt", city: "Ankara", place: "Milyon Performance Hall", time: "20:30", price: 450 },
  { id: 2, day: "20", month: "Eyl", weekday: "Paz", city: "İstanbul", place: "Bostancı Gösteri Merkezi", time: "20:00", price: 550 },
  { id: 3, day: "30", month: "Eyl", weekday: "Çar", city: "İzmir", place: "İzmir Arena", time: "20:30", price: 500 },
];

export function EventExperience({ event }: { event: EventRecord }) {
  const [session, setSession] = useState(sessions[0]);
  const [favorite, setFavorite] = useState(false);
  const [follow, setFollow] = useState(false);
  const [shareMessage,setShareMessage]=useState("");

  async function shareEvent(){
    try { if(navigator.share) await navigator.share({title:event.title,text:`${event.title} etkinliğine birlikte gidelim!`,url:window.location.href}); else { await navigator.clipboard.writeText(window.location.href); setShareMessage("Etkinlik bağlantısı kopyalandı ✓"); } }
    catch { setShareMessage("Paylaşım iptal edildi."); }
  }

  return (
    <main className="event-page">
      <SubHeader />
      <section className="event-hero-detail">
        <div className={`detail-poster ${event.art}`}><span>{event.category.toLocaleUpperCase("tr-TR")} · TÜRKÇE</span><strong>{event.mark.split("\n").map((line) => <i key={line}>{line}</i>)}</strong><div className="poster-detail-date"><b>{session.day}</b><small>{session.month.toLocaleUpperCase("tr-TR")}</small></div><em>SON 100 BİLET</em></div>
        <div className="event-main-info"><div className="detail-actions"><span className="verified-pill">✓ DOĞRULANMIŞ ETKİNLİK</span><button className={favorite ? "liked" : ""} type="button" onClick={() => setFavorite(!favorite)}>{favorite ? "♥" : "♡"}</button><button type="button" onClick={shareEvent} aria-label="Etkinliği paylaş">↗</button></div>{shareMessage&&<div className="share-status" role="status">{shareMessage}</div>}<h1>{event.title}</h1><p className="event-location">● {session.place}, {session.city}</p><div className="detail-facts"><span><small>TARİH</small><strong>{session.day} {session.month} 2026 · {session.time}</strong></span><span><small>KAPI AÇILIŞ</small><strong>19:30</strong></span><span><small>SÜRE</small><strong>120 dakika</strong></span><span><small>YAŞ</small><strong>18+</strong></span></div><div className="artist-strip"><div className="artist-avatar">MS</div><div><small>SAHNEDE</small><a href="/artist/mesut-sure">Mesut Süre <span>✓</span></a><p>125 bin takipçi · Komedyen</p></div><button className={follow ? "following" : ""} type="button" onClick={() => setFollow(!follow)}>{follow ? "Takiptesin ✓" : "+ Takip Et"}</button></div></div>
      </section>

      <section className="event-body">
        <div className="event-content">
          <div className="content-block"><span className="section-kicker">TURNE TAKVİMİ</span><h2>Tarih ve şehir seç</h2><div className="session-row">{sessions.map((item) => <button className={session.id === item.id ? "selected" : ""} onClick={() => setSession(item)} type="button" key={item.id}><span>{item.weekday}</span><strong>{item.day}</strong><small>{item.month}</small><i>{item.city}</i></button>)}</div><div className="selected-venue"><span>◎</span><div><small>SEÇİLEN MEKAN</small><a href="/venue/milyon-performance-hall">{session.place}</a><p>{session.city} · Haritada gör ↗</p></div><b>{session.time}</b></div></div>
          <div className="content-block"><span className="section-kicker">ETKİNLİK HAKKINDA</span><h2>Kahkahaya hazır mısın?</h2><p>Mesut Süre'nin çok sevilen interaktif gösterisi İlişki Testi, çiftleri ve seyircileri kahkaha dolu bir geceye davet ediyor. Her gösteri, salondaki hikâyelerle yeniden yazılıyor.</p><ul className="event-rules"><li>Kapılar etkinlikten 60 dakika önce açılır.</li><li>Etkinlikte kamera kaydı yapılabilir.</li><li>Geç gelen misafirler uygun bir arada salona alınır.</li></ul></div>
          <div className="content-block review-block"><div className="review-head"><div><span className="section-kicker">DOĞRULANMIŞ YORUMLAR</span><h2>Katılanlar ne diyor?</h2></div><strong>4.8 <span>★★★★★</span><small>326 yorum</small></strong></div><div className="review-cards"><article><div><b>EY</b><p><strong>Ece Yılmaz <i>✓ Katıldı</i></strong><span>★★★★★ · 12 Haziran</span></p></div><q>İki saat nasıl geçti anlamadık. Çok doğal ve çok komikti!</q></article><article><div><b>BK</b><p><strong>Berk Kaya <i>✓ Katıldı</i></strong><span>★★★★★ · 03 Mayıs</span></p></div><q>Tekrar olsa tekrar giderim. Arkadaş grubuyla harika bir plan.</q></article></div></div>
        </div>
        <aside className="buy-card"><div><small>SEÇİLEN SEANS</small><strong>{session.day} {session.month} · {session.time}</strong><span>{session.place}, {session.city}</span></div><hr /><div className="price-line"><span>Başlangıç fiyatı</span><strong>{session.price} TL</strong></div><div className="availability"><span><i /> Biletler tükeniyor</span><b>%78 dolu</b></div><div className="fill-bar"><i /></div><a href={`/checkout?session=${session.id}&event=${event.slug}`}>Biletini seç <span>→</span></a><p>🧪 Demo ödeme · 15 dakika koltuk kilidi</p><a className="match-link" href="/match">👥 Birlikte gidecek birini bul</a></aside>
      </section>

      <section className="similar-events"><span className="section-kicker">BUNLARI DA SEVEBİLİRSİN</span><h2>Benzer etkinlikler</h2><div className="event-grid">{eventRecords.slice(1, 4).map((item) => <EventCard event={item} key={item.slug} />)}</div></section>
    </main>
  );
}
