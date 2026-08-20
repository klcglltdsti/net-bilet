"use client";

import { useState } from "react";
import { SubHeader } from "../components/SubHeader";

const questions = [
  { title: "Bugün nasıl hissetmek istiyorsun?", key: "mood", options: [["😄", "Eğlenmek"], ["❤️", "Romantik"], ["⚡", "Enerji"], ["🎭", "Kültür sanat"], ["🫶", "Sosyalleşmek"], ["🌿", "Sakinleşmek"]] },
  { title: "Kimlerle gideceksin?", key: "company", options: [["◎", "Tek başıma"], ["👥", "Arkadaşlarla"], ["♥", "Partnerimle"], ["⌂", "Ailemle"]] },
  { title: "Bütçen ne kadar?", key: "budget", options: [["₺", "0–300 TL"], ["₺₺", "300–750 TL"], ["₺₺₺", "750–1.500 TL"], ["✦", "1.500 TL+"]] },
  { title: "Ne zaman uygunsun?", key: "date", options: [["◷", "Bugün"], ["☀", "Hafta sonu"], ["▦", "Bu hafta"], ["+", "Özel tarih"]] },
] as const;

export default function RecommendationPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const question = questions[step];

  function choose(value: string) { setAnswers((current) => ({ ...current, [question.key]: value })); }
  function next() { if (step < questions.length - 1) setStep(step + 1); else { setSpinning(true); window.setTimeout(() => { setSpinning(false); setDone(true); }, 1400); } }

  return (
    <main className="recommend-page">
      <SubHeader active="recommend" />
      <section className="quiz-wrap">
        <div className="quiz-intro"><span className="ai-badge">✦ BULUŞ AKILLI ÖNERİ</span><h1>Kararı bize bırak.<br /><em>Anı sen yaşa.</em></h1><p>Dört kısa seçim yap. Moduna, bütçene ve şehrine en uygun planı bulalım.</p><div className="quiz-progress">{questions.map((_, index) => <span className={index <= step ? "active" : ""} key={index} />)}</div></div>
        <div className="quiz-card">
          {!done ? <>{spinning ? <div className="spin-state"><div className="spin-icons"><span>🎭</span><span>😂</span><span>🎤</span></div><h2>Şehrin senin için dönüyor…</h2><p>Binlerce etkinlik arasından en iyi eşleşmeyi buluyoruz.</p></div> : <><div className="quiz-step"><span>0{step + 1}</span> / 0{questions.length}</div><h2>{question.title}</h2><div className="quiz-options">{question.options.map(([icon, label]) => <button className={answers[question.key] === label ? "selected" : ""} type="button" onClick={() => choose(label)} key={label}><span>{icon}</span><strong>{label}</strong><i>✓</i></button>)}</div><div className="quiz-actions"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>← Geri</button><button className="quiz-next" type="button" disabled={!answers[question.key]} onClick={next}>{step === questions.length - 1 ? "Öneriyi bul ✦" : "Devam →"}</button></div></>}</> : <div className="quiz-result"><span className="match-score">%92 UYUM</span><div className="mini-poster"><small>STAND-UP · ANKARA</small><strong>İLİŞKİ<br /><i>TESTİ</i></strong></div><p>Sana bunu öneriyoruz</p><h2>Mesut Süre ile İlişki Testi</h2><ul><li>✓ {answers.mood} moduna uygun</li><li>✓ {answers.budget} bütçende</li><li>✓ Sana yalnızca 4,8 km uzakta</li></ul><div className="result-buttons"><a href="/event/mesut-sure-iliski-testi">Etkinliği gör <span>→</span></a><button type="button" onClick={() => { setDone(false); setStep(0); setAnswers({}); }}>Tekrar çevir</button></div></div>}
        </div>
      </section>
    </main>
  );
}
