"use client";

import { useState } from "react";
import { SubHeader } from "../components/SubHeader";

const rewards = ["%10 İndirim", "50 Puan", "Sürpriz", "2× Puan", "%20 İndirim", "Tekrar Dene"];

export default function RewardsPage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");

  function spin() {
    if (spinning) return;
    setResult("");
    setSpinning(true);
    window.setTimeout(() => {
      setSpinning(false);
      setResult("%20 İndirim");
    }, 1200);
  }

  return <main className="utility-page"><SubHeader /><section className="utility-hero"><div><span className="section-kicker">BULUŞ KULÜBÜ</span><h1>Her buluşmada<br /><em>yeni bir ödül.</em></h1><p>Bilet al, yorum yap ve arkadaşlarını davet et. Puanlarını avantajlara dönüştür.</p><div className="points-card"><span>TOPLAM PUAN</span><strong>2.480 <small>BP</small></strong><p>Gold seviyeye 520 puan kaldı</p><i><b /></i></div></div><div className="wheel-wrap"><span className="wheel-pointer">▼</span><div className={`reward-wheel ${spinning ? "spinning" : ""}`}>{rewards.map((reward, index) => <span style={{ transform: `rotate(${index * 60}deg)` }} key={reward}>{reward}</span>)}<b>B</b></div><button onClick={spin} disabled={spinning} type="button">{spinning ? "Dönüyor…" : "Çarkı çevir"}</button><small>Haftada 1 ücretsiz çevirme</small></div></section>{result && <section className="reward-result"><span>✦</span><div><small>TEBRİKLER</small><h2>{result} kazandın!</h2><p>Ödül, hesabındaki kuponlara eklendi. 30 gün içinde kullanabilirsin.</p></div><a href="/discover">Etkinlik seç →</a></section>}<section className="reward-grid"><article><span>01</span><h3>Bilet al</h3><p>Her 10 TL için 1 BULUŞ puanı kazan.</p><strong>+60 BP</strong></article><article><span>02</span><h3>Yorum yap</h3><p>Katıldığın etkinliği doğrulanmış olarak değerlendir.</p><strong>+25 BP</strong></article><article><span>03</span><h3>Arkadaşını getir</h3><p>Davetin ilk biletini aldığında ikiniz de kazanın.</p><strong>+100 BP</strong></article></section></main>;
}
