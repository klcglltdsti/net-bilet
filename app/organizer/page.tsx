"use client";

import { PanelShell } from "../components/PanelShell";
import { resetDemoState, useDemoState } from "../lib/demo-store";

const baseRows = [
  ["Mesut Süre — İlişki Testi", "12 Eyl · Ankara", "1.250 / 1.600", "%78", "562.500 TL", "Satışta"],
  ["Mabel Matiz — Fatih Turnesi", "21 Eyl · Ankara", "2.840 / 3.200", "%89", "2.527.600 TL", "Satışta"],
  ["Bir Delinin Hatıra Defteri", "28 Eyl · Ankara", "680 / 900", "%76", "408.000 TL", "Satışta"],
  ["Ankara Kahkaha Gecesi", "03 Eki · Ankara", "0 / 750", "%0", "0 TL", "Taslak"],
];

export default function OrganizerPage() {
  const demo = useDemoState();
  const demoTickets = demo.sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const demoRevenue = demo.sales.reduce((sum, sale) => sum + sale.total, 0);
  const demoRows = demo.events.map(event => {
    const eventRevenue = demo.sales.filter(sale => sale.eventSlug === event.slug).reduce((sum, sale) => sum + sale.total, 0);
    const fill = event.capacity ? Math.round((event.sold / event.capacity) * 100) : 0;
    return [event.title, `${event.day} ${event.month} · ${event.city}`, `${event.sold} / ${event.capacity}`, `${fill}%`, `${eventRevenue.toLocaleString("tr-TR")} TL`, event.status];
  });
  const rows = [...demoRows, ...baseRows];
  return <PanelShell title="Günaydın, Hüseyin 👋" subtitle="Etkinliklerin bugün de güzel gidiyor. İşte son durum." action={<a className="panel-main-action" href="/organizer/events/new">+ Yeni etkinlik</a>}>
    <section className="demo-panel-strip"><div><span>🧪</span><p><strong>Çalışan demo modu</strong><small>Etkinlik ekle → Keşfet'te aç → test satışı yap → rakamları burada gör.</small></p></div><div><a href="/discover">Kullanıcı tarafını aç</a><button type="button" onClick={() => { if (window.confirm("Eklediğin demo etkinlikleri, satışları ve biletleri sıfırlamak istiyor musun?")) resetDemoState(); }}>Demo verilerini sıfırla</button></div></section>
    <section className="kpi-grid"><article><span className="kpi-icon purple">↗</span><p><small>DEMO SATIŞ</small><strong>{demoTickets} <i>bilet</i></strong><span className="trend up">CANLI</span><em>test işlemlerinden</em></p></article><article><span className="kpi-icon orange">₺</span><p><small>DEMO GELİR</small><strong>{demoRevenue.toLocaleString("tr-TR")} <i>TL</i></strong><span className="trend up">ANLIK</span><em>gerçek para değil</em></p></article><article><span className="kpi-icon pink">◔</span><p><small>EKLENEN ETKİNLİK</small><strong>{demo.events.length}</strong><span className="trend up">YEREL</span><em>bu tarayıcıda</em></p></article><article><span className="kpi-icon gold">◷</span><p><small>DEMO BİLET</small><strong>{demo.tickets.length} <i>adet</i></strong><span className="trend neutral">CÜZDAN</span><em>Biletlerim alanında</em></p></article></section>
    <section className="analytics-grid"><article className="sales-chart"><div className="panel-card-head"><div><small>SATIŞ PERFORMANSI</small><h2>Son 7 gün</h2></div><a href="/organizer/reports">Raporlar →</a></div><div className="chart-total"><strong>{8420 + demoTickets}</strong><span>toplam bilet</span><i>↗ %14,2</i></div><div className="bar-chart">{[38,55,44,68,61,82,93].map((height,index) => <div key={index}><i style={{height:`${height}%`}} /><span>{["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"][index]}</span></div>)}</div></article><article className="city-chart"><div className="panel-card-head"><div><small>ŞEHİR DAĞILIMI</small><h2>Satışlar nereden geliyor?</h2></div><a href="/organizer/reports">Detay →</a></div><div className="donut"><strong>%46<small>Ankara</small></strong></div><ul><li><i className="purple-dot" />Ankara <b>%46</b></li><li><i className="orange-dot" />İstanbul <b>%31</b></li><li><i className="pink-dot" />İzmir <b>%14</b></li><li><i className="gray-dot" />Diğer <b>%9</b></li></ul></article></section>
    <section className="panel-table-card"><div className="panel-card-head"><div><small>AKTİF ETKİNLİKLER</small><h2>Satış özeti</h2></div><a href="/organizer/events">Tümünü gör →</a></div><div className="panel-table"><div className="table-row table-head"><span>ETKİNLİK</span><span>TARİH / ŞEHİR</span><span>BİLET</span><span>DOLULUK</span><span>GELİR</span><span>DURUM</span><span /></div>{rows.map((row) => <div className="table-row" key={row[0]}><span><b className="event-mini-art">{row[0].slice(0,2).toUpperCase()}</b><strong>{row[0]}</strong></span><span>{row[1]}</span><span>{row[2]}</span><span><i className="mini-fill"><b style={{width:row[3]}} /></i>{row[3]}</span><span><strong>{row[4]}</strong></span><span><em className={row[5] === "Taslak" ? "draft" : "live"}>{row[5]}</em></span><span><a href="/organizer/events" aria-label={`${row[0]} yönet`}>Yönet →</a></span></div>)}</div></section>
  </PanelShell>;
}
