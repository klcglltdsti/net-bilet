"use client";

import { useState } from "react";
import { turkishCities } from "../data/cities";
import { updateDemoUser } from "../lib/demo-store";
import { navigateTo } from "../../src/router";

const screens = [
  { title: "Nelerden hoşlanırsın?", subtitle: "Sana özel bir akış için en az 3 ilgi alanı seç.", options: ["🎭 Tiyatro", "😂 Stand-up", "🎤 Konser", "🎧 Festival", "🎬 Sinema", "⚽ Spor", "👨‍👩‍👧 Aile", "🎨 Sergi"], minimum: 3 },
  { title: "Hangi şehirde buluşalım?", subtitle: "Yakınındaki etkinlikleri gösterebilmemiz için şehrini seç.", options: turkishCities.map(city=>`● ${city}`), minimum: 1 },
  { title: "Nasıl bir deneyim seversin?", subtitle: "Birden fazla seçim yapabilirsin.", options: ["Kalabalık", "Sakin", "Eğlenceli", "Kültür", "Sosyal"], minimum: 1 },
  { title: "Genelde ne kadar harcarsın?", subtitle: "Bütçene uygun öneriler için kullanacağız.", options: ["0–500 TL", "500–1.000 TL", "1.000 TL+"], minimum: 1 },
  { title: "Kimlerle gidersin?", subtitle: "Sosyal önerilerini buna göre şekillendireceğiz.", options: ["Tek başıma", "Arkadaşlarımla", "Partnerimle", "Ailemle"], minimum: 1 },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0); const [selected, setSelected] = useState<Record<number, string[]>>({}); const screen = screens[step]; const values = selected[step] ?? [];
  function toggle(value: string) { setSelected((current) => ({ ...current, [step]: step === 1 ? [value] : values.includes(value) ? values.filter((item) => item !== value) : [...values, value] })); }
  function complete(){const city=selected[1]?.[0]?.replace("● ","");if(city)updateDemoUser({city});navigateTo("/discover")}
  return <main className="onboarding"><aside><a className="brand" href="/"><span className="brand-dot">b</span><span>BULUŞ</span></a><div><span>ŞEHRİN SENİ BEKLİYOR</span><h1>Her anın<br /><em>bir bileti var.</em></h1><p>Tercihlerini öğrenelim, sana gerçekten seveceğin planlar gösterelim.</p></div><small>Gizlilik tercihlerine her zaman sen karar verirsin.</small></aside><section><div className="onboarding-top"><span>ADIM {step + 1} / {screens.length}</span><div>{screens.map((_, index) => <i className={index <= step ? "active" : ""} key={index} />)}</div><a href="/">Şimdilik geç</a></div><div className="onboarding-card"><span className="section-kicker">SENİ TANIYALIM</span><h2>{screen.title}</h2><p>{screen.subtitle}</p><div className={`onboarding-options ${step===1?"city-options":""}`}>{screen.options.map((option) => <button className={values.includes(option) ? "selected" : ""} onClick={() => toggle(option)} type="button" key={option}>{option}<i>✓</i></button>)}</div><div className="onboarding-actions"><button disabled={step === 0} onClick={() => setStep(step - 1)} type="button">← Geri</button>{step === screens.length - 1 ? <button className="next" disabled={values.length < screen.minimum} onClick={complete} type="button">Keşfetmeye başla →</button> : <button className="next" disabled={values.length < screen.minimum} onClick={() => setStep(step + 1)} type="button">Devam →</button>}</div></div></section></main>;
}
