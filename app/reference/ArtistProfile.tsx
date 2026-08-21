// @ts-nocheck
import React, { useState } from 'react';
import { ArrowLeft, Camera, MessageCircle, Music, Calendar, MapPin, Share2 } from 'lucide-react';
import { useReferenceTheme } from './use-reference-theme';

function ArtistProfile({ onBack, onEventSelect }) {
  useReferenceTheme('artist');
  const [notice, setNotice] = useState('');
  return (
    <div className="profile-page">
      <button className="back-btn glass-panel" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      {/* Hero Alanı */}
      <div className="profile-hero">
        <div className="profile-hero-bg" style={{ backgroundImage: `url('https://picsum.photos/seed/tarkan/1200/600')` }}></div>
        <div className="profile-hero-content">
          <div className="profile-avatar">
            <img src="https://picsum.photos/seed/tarkan-avatar/200/200" alt="Tarkan" />
          </div>
          <div className="profile-info">
            <span className="badge category-badge" style={{marginBottom: '12px'}}>Pop Müzik</span>
            <h1 className="profile-title">Tarkan</h1>
            <p className="profile-bio">
              Türk pop müziğinin Megastar'ı Tarkan, enerjisi, eşsiz yorumu ve dev sahne şovlarıyla 
              hayranlarıyla buluşmaya devam ediyor. 90'lardan bu yana dillerden düşmeyen hitleri 
              ve son albümüyle sahnelerin tozunu atıyor.
            </p>
            <div className="profile-social">
              <button className="social-btn glass-panel" title="Instagram" onClick={() => setNotice('Demo Instagram profili açıldı.')}><Camera size={20} /></button>
              <button className="social-btn glass-panel" title="Sosyal akış" onClick={() => setNotice('Sanatçının demo sosyal akışı açıldı.')}><MessageCircle size={20} /></button>
              <button className="social-btn glass-panel" title="Takip et" onClick={() => setNotice('Tarkan takip listene eklendi.')}><Music size={20} /></button>
              <button className="social-btn glass-panel" title="Paylaş" onClick={() => { navigator.clipboard?.writeText(window.location.href); setNotice('Profil bağlantısı panoya kopyalandı.'); }}><Share2 size={20} /></button>
            </div>
            {notice && <p className="reference-notice artist-notice">{notice}</p>}
          </div>
        </div>
      </div>

      <div className="profile-body" style={{ padding: '60px 10%' }}>
        {/* Yaklaşan Etkinlikler */}
        <section className="events-section" style={{ marginBottom: '60px' }}>
          <div className="section-header">
            <h2>Tarkan'ın Yaklaşan Etkinlikleri</h2>
          </div>
          <div className="events-grid">
            {/* Kart 1 */}
            <div className="event-card glass-panel" onClick={onEventSelect}>
              <div className="event-image">
                <img src="https://picsum.photos/seed/konser1/600/400" alt="Concert" />
                <div className="event-badges"><span className="category-badge">Konser</span></div>
                <div className="event-date"><span className="day">15</span><span className="month">AĞU</span></div>
              </div>
              <div className="event-info">
                <h3>Yaz Akşamı Konserleri</h3>
                <div className="event-meta-info">
                  <p className="event-location"><MapPin size={16} /> Harbiye, İstanbul</p>
                </div>
                <div className="event-footer">
                  <span className="event-price">250 ₺'den başlayan fiyatlarla</span>
                  <button className="btn-primary btn-sm">Bilet Al</button>
                </div>
              </div>
            </div>

            {/* Kart 2 */}
            <div className="event-card glass-panel" onClick={onEventSelect}>
              <div className="event-image">
                <img src="https://picsum.photos/seed/konser2/600/400" alt="Concert" />
                <div className="event-badges"><span className="category-badge">Konser</span></div>
                <div className="event-date"><span className="day">28</span><span className="month">AĞU</span></div>
              </div>
              <div className="event-info">
                <h3>Ege Turnesi</h3>
                <div className="event-meta-info">
                  <p className="event-location"><MapPin size={16} /> Kültürpark, İzmir</p>
                </div>
                <div className="event-footer">
                  <span className="event-price">300 ₺'den başlayan fiyatlarla</span>
                  <button className="btn-primary btn-sm">Bilet Al</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benzer Sanatçılar */}
        <section className="events-section">
          <div className="section-header">
            <h2>Benzer Sanatçılar</h2>
          </div>
          <div className="horizontal-scroll-container">
            <div className="artist-mini-card glass-panel">
              <img src="https://picsum.photos/seed/gulsen/150/150" alt="Gülşen" />
              <h4>Gülşen</h4>
              <p>Pop</p>
            </div>
            <div className="artist-mini-card glass-panel">
              <img src="https://picsum.photos/seed/kenan/150/150" alt="Kenan Doğulu" />
              <h4>Kenan Doğulu</h4>
              <p>Pop</p>
            </div>
            <div className="artist-mini-card glass-panel">
              <img src="https://picsum.photos/seed/edis/150/150" alt="Edis" />
              <h4>Edis</h4>
              <p>Pop</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ArtistProfile;
