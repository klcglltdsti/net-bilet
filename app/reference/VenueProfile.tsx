// @ts-nocheck
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Car, Bus, Users, ShieldAlert, Calendar } from 'lucide-react';
import { useReferenceTheme } from './use-reference-theme';

function VenueProfile({ onBack, onEventSelect }) {
  useReferenceTheme('venue');
  const [notice, setNotice] = useState('');
  return (
    <div className="profile-page">
      <button className="back-btn glass-panel" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      {/* Hero Alanı */}
      <div className="profile-hero venue-hero">
        <div className="profile-hero-bg" style={{ backgroundImage: `url('https://picsum.photos/seed/harbiye/1200/600')` }}></div>
        <div className="profile-hero-content">
          <div className="profile-info">
            <span className="badge category-badge" style={{marginBottom: '12px'}}>Açık Hava Sahnesi</span>
            <h1 className="profile-title">Harbiye Cemil Topuzlu Açık Hava Tiyatrosu</h1>
            <p className="profile-bio">
              İstanbul'un kalbinde, yıldızların altında eşsiz bir etkinlik deneyimi. 
              Türkiye'nin en prestijli açık hava sahnesi olan Harbiye, yıllardır en büyük 
              konserlere, tiyatro oyunlarına ve gösterilere ev sahipliği yapmaktadır.
            </p>
            <div className="venue-meta">
              <span className="glass-panel"><MapPin size={16} /> Şişli, İstanbul</span>
              <span className="glass-panel"><Users size={16} /> Kapasite: 4,500</span>
            </div>
            {notice && <p className="reference-notice artist-notice">{notice}</p>}
          </div>
        </div>
      </div>

      <div className="profile-body" style={{ padding: '60px 10%' }}>
        <div className="venue-details-grid">
          {/* Sol Taraf: Özellikler */}
          <div className="venue-features">
            <h2>Mekân Özellikleri ve Ulaşım</h2>
            
            <div className="feature-card glass-panel">
              <Navigation className="text-primary" size={28} />
              <div>
                <h3>Açık Adres</h3>
                <p>Harbiye Mahallesi, Taşkışla Caddesi No:8, 34367 Şişli/İstanbul</p>
                <button className="btn-outline btn-sm" style={{marginTop: '12px'}} onClick={() => setNotice('Demo yol tarifi hazırlandı: Osmanbey Metro → Harbiye, 10 dk yürüyüş.')}>Yol Tarifi Al</button>
              </div>
            </div>

            <div className="feature-card glass-panel">
              <Bus className="text-primary" size={28} />
              <div>
                <h3>Toplu Taşıma</h3>
                <p>M2 Yenikapı-Hacıosman metrosu ile Osmanbey veya Taksim durağında inip 10 dakika yürüyüş mesafesindedir.</p>
              </div>
            </div>

            <div className="feature-card glass-panel">
              <Car className="text-primary" size={28} />
              <div>
                <h3>Otopark</h3>
                <p>Mekanın kendine ait otoparkı bulunmamaktadır ancak çevredeki İSPARK alanları ve özel otoparklar kullanılabilir.</p>
              </div>
            </div>

            <div className="feature-card glass-panel">
              <ShieldAlert className="text-primary" size={28} />
              <div>
                <h3>Mekân Kuralları</h3>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>
                  <li>Dışarıdan yiyecek/içecek alınmaz.</li>
                  <li>Profesyonel kayıt cihazları yasaktır.</li>
                  <li>Evcil hayvan kabul edilmemektedir.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Yaklaşan Etkinlikler */}
          <div className="venue-events">
            <h2>Bu Mekândaki Etkinlikler</h2>
            <div className="events-column">
              {/* Kart 1 */}
              <div className="event-card glass-panel" onClick={onEventSelect}>
                <div className="event-image">
                  <img src="https://picsum.photos/seed/konser1/600/400" alt="Concert" />
                  <div className="event-badges"><span className="category-badge">Konser</span></div>
                  <div className="event-date"><span className="day">15</span><span className="month">AĞU</span></div>
                </div>
                <div className="event-info">
                  <h3>Yaz Akşamı Konserleri: Tarkan</h3>
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
                  <div className="event-date"><span className="day">16</span><span className="month">AĞU</span></div>
                </div>
                <div className="event-info">
                  <h3>Kenan Doğulu</h3>
                  <div className="event-footer">
                    <span className="event-price">250 ₺'den başlayan fiyatlarla</span>
                    <button className="btn-primary btn-sm">Bilet Al</button>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueProfile;
