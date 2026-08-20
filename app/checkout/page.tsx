"use client";

import { useEffect, useMemo, useState } from "react";
import { SubHeader } from "../components/SubHeader";
import { eventRecords, type EventRecord } from "../data/events";
import { loadDemoState, recordDemoSale, type DemoTicket } from "../lib/demo-store";

const rows = ["A", "B", "C", "D", "E", "F"];
const sold = new Set(["A2", "A7", "B4", "C1", "C8", "D5", "E3", "E4", "F8"]);
const vipRows = new Set(["A", "B"]);

export default function CheckoutPage() {
  const [event, setEvent] = useState<EventRecord>(eventRecords[0]);
  const [selected, setSelected] = useState<string[]>(["B5"]);
  const [seconds, setSeconds] = useState(15 * 60);
  const [ticket, setTicket] = useState<DemoTicket | null>(null);
  const [provider, setProvider] = useState("Test Visa •••• 4242");
  const [installments, setInstallments] = useState(1);
  const [scenario, setScenario] = useState<"success" | "fail">("success");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("event");
    if (slug) {
      const state = loadDemoState();
      setEvent(state.events.find(item => item.slug === slug) ?? eventRecords.find(item => item.slug === slug) ?? eventRecords[0]);
    }
    const timer = window.setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const seatPrice = (seat: string) => event.price + (vipRows.has(seat[0]) ? 300 : 0);
  const subtotal = useMemo(() => selected.reduce((sum, seat) => sum + seatPrice(seat), 0), [selected, event.price]);
  const total = Math.max(0, subtotal + selected.length * 35 - discount);

  function toggle(seat: string) {
    if (sold.has(seat)) return;
    setSelected(current => current.includes(seat) ? current.filter(item => item !== seat) : current.length < 4 ? [...current, seat] : current);
  }

  function completeDemoSale() {
    if (!selected.length) return;
    const created = recordDemoSale(event, selected, total, { method: provider, installments, fail: scenario === "fail" });
    if (!created) { setPaymentError("Test banka yanıtı: işlem reddedildi. Bu başarısız deneme admin finans ekranına kaydedildi."); return; }
    setPaymentError(""); setTicket(created);
  }

  if (ticket) return <main className="checkout-page"><SubHeader active="tickets" /><section className="payment-success"><span>✓</span><small>DEMO SATIŞ BAŞARILI</small><h1>Satış sisteme işlendi.</h1><p>{ticket.seats.length} test biletin cüzdanına eklendi ve organizatör paneli güncellendi.</p><div className="success-ticket"><div className="ticket-cut left" /><div className="ticket-cut right" /><span>{ticket.date} · {ticket.time}</span><strong>{ticket.eventTitle}</strong><p>{ticket.place} · {ticket.seats.join(", ")}</p><b>{ticket.orderNumber}</b></div><div><a href="/tickets">Biletlerimi aç →</a><a className="secondary" href="/organizer">Satışı panelde gör</a></div></section></main>;

  return <main className="checkout-page"><SubHeader /><section className="checkout-head"><a href={event.demo ? `/demo-event/${event.slug}` : `/event/${event.slug}`}>← Etkinliğe dön</a><div><span>1</span><b>Koltuk seçimi</b><i /><span>2</span><b>Bilgiler</b><i /><span>3</span><b>Demo ödeme</b></div><p><small>KOLTUKLARIN AYRILDI</small><strong>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</strong></p></section><section className="seat-layout"><div className="seat-area"><span className="section-kicker">{event.place.toLocaleUpperCase("tr-TR")}</span><h1>Koltuklarını seç</h1><p>{event.title} · Bir işlemde en fazla 4 koltuk seçebilirsin.</p><div className="seat-legend"><span><i className="available" />Boş</span><span><i className="picked" />Seçili</span><span><i className="unavailable" />Dolu</span><span><i className="vip" />VIP</span></div><div className="stage">SAHNE <i /></div><div className="seat-map">{rows.map(row => <div className="seat-row" key={row}><b>{row}</b>{Array.from({ length: 8 }, (_, index) => { const seat = `${row}${index + 1}`; const state = sold.has(seat) ? "unavailable" : selected.includes(seat) ? "picked" : vipRows.has(row) ? "vip" : "available"; return <button className={state} disabled={sold.has(seat)} onClick={() => toggle(seat)} type="button" key={seat} aria-label={`Koltuk ${seat}`}>{index + 1}</button>; })}<b>{row}</b></div>)}</div><div className="map-note"><span>◎</span> Bu işlem test satışıdır; gerçek karttan para çekilmez.</div></div><aside className="order-summary"><span className="section-kicker">SİPARİŞ ÖZETİ</span><h2>{event.title}</h2><p>{event.day} {event.month} 2026 · {event.time || "20:30"}<br />{event.place} · {event.city}</p><hr />{selected.length ? <div className="selected-seats">{selected.map(seat => <div key={seat}><span><b>{seat}</b><small>{vipRows.has(seat[0]) ? "VIP" : "A Kategori"}</small></span><strong>{seatPrice(seat).toLocaleString("tr-TR")} TL</strong><button type="button" onClick={() => toggle(seat)}>×</button></div>)}</div> : <div className="no-seat">Haritadan koltuk seçmelisin.</div>}<hr /><label>Demo kuponu<div><input value={coupon} onChange={e=>setCoupon(e.target.value.toLocaleUpperCase("tr-TR"))} placeholder="BULUS20 veya ERKEN20" /><button type="button" onClick={()=>{if(["BULUS20","ERKEN20"].includes(coupon))setDiscount(Math.round(subtotal*.2));else if(coupon==="BULUS100")setDiscount(100);else {setDiscount(0);setPaymentError("Kupon bulunamadı. Test için BULUS20 kodunu kullanabilirsin.")}}}>Uygula</button></div></label>{discount>0&&<div className="coupon-success">✓ Kupon uygulandı: −{discount.toLocaleString("tr-TR")} TL</div>}<div className="payment-simulator"><label>Ödeme yöntemi<select value={provider} onChange={e=>setProvider(e.target.value)}><option>Test Visa •••• 4242</option><option>Test Mastercard •••• 5555</option><option>Demo Dijital Cüzdan</option></select></label><label>Taksit<select value={installments} onChange={e=>setInstallments(Number(e.target.value))}><option value="1">Tek çekim</option><option value="2">2 taksit</option><option value="3">3 taksit</option><option value="6">6 taksit</option></select></label><label>Test senaryosu<select value={scenario} onChange={e=>setScenario(e.target.value as "success"|"fail")}><option value="success">Başarılı ödeme</option><option value="fail">Reddedilen ödeme</option></select></label></div><div className="demo-card-fields"><label>Kart sahibi<input defaultValue="Ahmet Yılmaz" /></label><label>Test kartı<input value={scenario==="success"?"4242 4242 4242 4242":"4000 0000 0000 0002"} readOnly /></label><div><label>Son kullanma<input defaultValue="12/30" /></label><label>CVV<input defaultValue="123" /></label></div></div>{paymentError&&<div className="payment-error" role="alert">! {paymentError}</div>}<div className="totals"><span>Ara toplam <b>{subtotal.toLocaleString("tr-TR")} TL</b></span><span>Hizmet bedeli <b>{selected.length * 35} TL</b></span>{discount>0&&<span>İndirim <b>−{discount.toLocaleString("tr-TR")} TL</b></span>}<strong>Toplam <b>{total.toLocaleString("tr-TR")} TL</b></strong>{installments>1&&<small>{installments} × {Math.ceil(total/installments).toLocaleString("tr-TR")} TL demo taksit</small>}</div><button className="pay-button" disabled={!selected.length} type="button" onClick={completeDemoSale}>{scenario==="success"?"Test satışını tamamla":"Reddedilmeyi simüle et"} <span>→</span></button><small className="secure-note">🧪 Demo modu: hiçbir gerçek ödeme işlemi yapılmaz.</small></aside></section></main>;
}
