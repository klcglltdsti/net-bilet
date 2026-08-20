"use client";

import { useState } from "react";
import { SubHeader } from "../components/SubHeader";

const notices = [
  ["Bilet", "Biletin hazır", "Mesut Süre ile İlişki Testi biletin cüzdanına eklendi.", "2 dk", "ticket", "Biletler"],
  ["Takip", "Mabel Matiz Ankara'da", "Takip ettiğin sanatçının yeni etkinliği satışa çıktı.", "1 sa", "artist", "Sosyal"],
  ["Sosyal", "Yeni eşleşme", "Elif ile %92 uyumlu görünüyorsunuz.", "3 sa", "social", "Sosyal"],
  ["Kampanya", "Favori etkinliğinde %20 avantaj", "BULUS20 demo kuponu ödeme ekranında kullanılabilir.", "Dün", "alert", "Kampanyalar"],
];

export default function NotificationsPage() {
  const [unread, setUnread] = useState(true);
  const [tab, setTab] = useState("Tümü");
  const [showSettings,setShowSettings]=useState(false); const [email,setEmail]=useState(true); const [push,setPush]=useState(true); const filtered=tab==="Tümü"?notices:notices.filter(item=>item[5]===tab);
  return <main className="utility-page"><SubHeader /><section className="utility-container"><header className="utility-title"><div><span className="section-kicker">AKIŞ</span><h1>Bildirimler</h1><p>Biletlerinden, takip ettiklerinden ve yeni planlardan haberdar ol.</p></div><button onClick={() => setUnread(false)} type="button">{unread?"Tümünü okundu işaretle ✓":"Tümü okundu"}</button></header><nav className="notification-tabs">{["Tümü", "Biletler", "Sosyal", "Kampanyalar"].map(item => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</nav><section className="notification-list">{filtered.map((item, index) => <article className={unread && index < 3 ? "unread" : ""} key={item[1]}><span className={`notice-icon ${item[4]}`}>{item[4] === "ticket" ? "▣" : item[4] === "artist" ? "♪" : item[4] === "social" ? "●" : "!"}</span><div><small>{item[0]}</small><h2>{item[1]}</h2><p>{item[2]}</p></div><time>{item[3]}</time><i /></article>)}</section><button className="notification-settings" type="button" onClick={()=>setShowSettings(value=>!value)}>⚙ Bildirim tercihlerini düzenle</button>{showSettings&&<section className="notification-preferences" id="settings"><h2>Bildirim tercihleri</h2><label><input type="checkbox" checked={push} onChange={e=>setPush(e.target.checked)}/><span><strong>Uygulama bildirimleri</strong><small>Bilet, sosyal ve kampanya gelişmeleri</small></span></label><label><input type="checkbox" checked={email} onChange={e=>setEmail(e.target.checked)}/><span><strong>E-posta özetleri</strong><small>Demo ortamında gerçek e-posta gönderilmez</small></span></label><button type="button" onClick={()=>setShowSettings(false)}>Tercihleri kaydet ✓</button></section>}</section></main>;
}
