"use client";

import { SubHeader } from "../../components/SubHeader";
import { useDemoState } from "../../lib/demo-store";

export function DemoEventExperience({ slug }: { slug: string }) {
  const state = useDemoState();
  const event = state.events.find(item => item.slug === slug);
  if (!event) return <main className="demo-event-page"><SubHeader /><section className="demo-missing"><span>⌕</span><h1>Demo etkinlik bulunamadı</h1><p>Test verileri sıfırlanmış veya etkinlik henüz oluşturulmamış olabilir.</p><a href="/organizer/events/new">Yeni etkinlik oluştur →</a></section></main>;
  const fill = Math.round((event.sold / event.capacity) * 100);
  return <main className="demo-event-page"><SubHeader /><section className={`demo-event-cover ${event.art}`}><span className="demo-label">CANLI DEMO ETKİNLİĞİ</span><strong>{event.mark.split("\n").map(line => <i key={line}>{line}</i>)}</strong><small>{event.category.toLocaleUpperCase("tr-TR")}</small></section><section className="demo-event-layout"><div><span className="section-kicker">ORGANİZATÖR PANELİNDEN EKLENDİ</span><h1>{event.title}</h1><p className="demo-event-lead">{event.description}</p><div className="demo-event-facts"><span><small>TARİH</small><strong>{event.day} {event.month} 2026 · {event.time}</strong></span><span><small>MEKAN</small><strong>{event.place}</strong></span><span><small>ŞEHİR</small><strong>{event.city}</strong></span><span><small>SANATÇI</small><strong>{event.artist}</strong></span></div><article className="demo-info-card"><span>✓</span><div><h2>Bu ekran demo verisine bağlı</h2><p>Buradan yapılan test satışı Biletlerim alanına ve organizatör panelindeki satış rakamlarına yansır.</p></div></article></div><aside className="demo-buy-card"><span>BAŞLANGIÇ FİYATI</span><strong>{event.price.toLocaleString("tr-TR")} TL</strong><p>{event.sold} / {event.capacity} demo bilet satıldı</p><i><b style={{ width: `${Math.max(2, fill)}%` }} /></i><a href={`/checkout?event=${event.slug}`}>Test bileti satın al <span>→</span></a><small>Gerçek para çekilmez · Yerel demo işlemi</small></aside></section></main>;
}
