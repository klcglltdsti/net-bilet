"use client";

import { useState } from "react";
import { signInDemoUser } from "../../lib/demo-store";

export default function RegisterPage() {
  const [accepted, setAccepted] = useState(false);
  const [firstName, setFirstName] = useState("Ayşe");
  const [lastName, setLastName] = useState("Demir");
  const [phone, setPhone] = useState("0555 444 33 22");
  const [email, setEmail] = useState("ayse@bulus.demo");

  function register() {
    if (!accepted) return;
    signInDemoUser({ name: `${firstName} ${lastName}`.trim(), email, phone });
    window.location.href = "/onboarding";
  }

  return <main className="auth-page register-page"><section className="auth-visual"><a className="brand" href="/"><span className="brand-dot">b</span><span>BULUŞ</span></a><div><span>ŞEHRİNLE BULUŞ</span><h1>Bir sonraki anın<br /><em>seni bekliyor.</em></h1><p>Bu demo hesapla tercihlerini seçebilir, bilet alabilir ve profilini düzenleyebilirsin.</p></div><small>Yerel demo · Bilgiler yalnızca bu tarayıcıda kalır</small></section><section className="auth-form"><div><span className="section-kicker">ÇALIŞAN DEMO KAYDI</span><h2>BULUŞ'a katıl</h2><p>Zaten hesabın var mı? <a href="/auth/login">Giriş yap</a></p><div className="two-inputs"><label>Ad<input value={firstName} onChange={event => setFirstName(event.target.value)} /></label><label>Soyad<input value={lastName} onChange={event => setLastName(event.target.value)} /></label></div><label>Telefon<input value={phone} onChange={event => setPhone(event.target.value)} /></label><label>E-posta<input type="email" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Demo şifre<input type="password" defaultValue="bulus123" /></label><label className="check-line"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} /><span>Demo üyelik koşullarını ve KVKK aydınlatma metnini kabul ediyorum.</span></label><button className={`auth-submit ${accepted ? "" : "disabled"}`} disabled={!accepted} onClick={register} type="button">Kayıt ol ve tercihleri seç →</button><div className="demo-mode-note">Kayıt tamamlanınca isim ve e-posta profil ekranında görünecek.</div></div></section></main>;
}
