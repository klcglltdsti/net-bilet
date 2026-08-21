// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Info, Check, Plus, Minus, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { useReferenceTheme } from './use-reference-theme';

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="accordion-item glass-panel">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
}

function EventDetail({ onBack, onCheckout, onViewProfile, event }) {
  useReferenceTheme('event');
  const eventCategory = String(event?.category || 'Konser').toLocaleLowerCase('tr-TR');
  const heroImage = eventCategory.includes('tiyatro')
    ? 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1800&q=86'
    : eventCategory.includes('stand') || eventCategory.includes('komedi')
      ? 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1800&q=86'
      : 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=86';
  // Ticket / Selection States
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Genel Giriş');
  const [selectionStep, setSelectionStep] = useState(1); // 1: Şehir, 2: Mekan, 3: Tarih, 4: Bilet
  const [favorite, setFavorite] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 5, minutes: 30, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const basePrice = Number(String(event?.price || '250').replace(/\D/g, '')) || 250;
  const categories = [
    { name: 'Genel Giriş', price: basePrice, available: true },
    { name: 'Sahne Önü', price: basePrice + 200, available: true },
    { name: 'VIP', price: basePrice + 600, available: false }
  ];

  const handleIncrement = () => { if (ticketCount < 5) setTicketCount(prev => prev + 1); };
  const handleDecrement = () => { if (ticketCount > 1) setTicketCount(prev => prev - 1); };

  const selectedPrice = categories.find(c => c.name === selectedCategory)?.price || 0;
  const totalPrice = selectedPrice * ticketCount;

  const shareEvent = async () => {
    const shareData = { title: event?.title || 'NetBilet Etkinliği', text: 'Bu etkinliğe göz at!', url: window.location.href };
    if (navigator.share) await navigator.share(shareData);
    else { await navigator.clipboard?.writeText(window.location.href); setActionNotice('Etkinlik bağlantısı panoya kopyalandı.'); }
  };

  return (
    <div className="event-detail-page">
      <button className="back-btn glass-panel" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      {/* Hero Alanı */}
      <div className="detail-hero">
        <div className="detail-hero-bg" style={{ backgroundImage: `url('${heroImage}')` }}></div>
        <div className="detail-hero-content">
          <div className="hero-top-badges">
            <span className="badge category-badge">{event?.category || 'Konser'}</span>
            <span className="badge status-warning">Son Biletler</span>
          </div>
          
          <h1 className="detail-title">{event?.title || 'Yaz Akşamı Konserleri'}</h1>
          <p className="detail-subtitle">Canlı performans ve sürprizlerle unutulmaz bir etkinlik deneyimi.</p>
          
          <div className="detail-hero-bottom">
            <div className="detail-meta">
              <div className="meta-item glass-panel">
                <Calendar className="text-primary" size={24} />
                <div>
                  <div className="meta-label">En Yakın Tarih</div>
                  <div className="meta-value">{event ? `${event.day} ${event.month}` : '15 Ağustos 2026'}</div>
                </div>
              </div>
              <div className="meta-item glass-panel" style={{ cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => onViewProfile('venue', 'harbiye')} title="Mekânı İncele">
                <MapPin className="text-primary" size={24} />
                <div>
                  <div className="meta-label">Şehir / Mekân</div>
                  <div className="meta-value">{event ? `${event.city}, ${event.place}` : 'İstanbul, Harbiye'}</div>
                </div>
              </div>
              <div className="meta-item glass-panel countdown-panel">
                <Clock className="text-primary" size={24} />
                <div>
                  <div className="meta-label">Etkinliğe Kalan Süre</div>
                  <div className="meta-value countdown">
                    <span>{timeLeft.days}g</span> : <span>{timeLeft.hours}s</span> : <span>{timeLeft.minutes}d</span> : <span className="text-primary">{timeLeft.seconds}s</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-actions">
              <div className="price-tag">
                <span className="from">Başlangıç</span>
                <span className="amount">{basePrice} ₺</span>
              </div>
              <button className={`icon-btn glass-panel hero-btn ${favorite ? 'is-favorite' : ''}`} title="Favoriye Ekle" onClick={() => { setFavorite(value => !value); setActionNotice(favorite ? 'Favorilerden çıkarıldı.' : 'Favorilerine eklendi.'); }}><Heart size={20} fill={favorite ? 'currentColor' : 'none'} /></button>
              <button className="icon-btn glass-panel hero-btn" title="Paylaş" onClick={shareEvent}><Share2 size={20} /></button>
            </div>
          </div>
          {actionNotice && <p className="detail-action-notice">{actionNotice}</p>}
        </div>
      </div>

      <div className="detail-body">
        {/* Sol Taraf (Açıklamalar ve Seçim Akışı) */}
        <div className="detail-main-content">
          
          {/* Adım Adım Seçim Modülü */}
          <div className="selection-module glass-panel">
            <h2>Bilet Seçimi İçin Adımları Tamamla</h2>
            <div className="step-indicator">
              <div className={`step ${selectionStep >= 1 ? 'active' : ''}`} onClick={() => setSelectionStep(1)}>1. Şehir</div>
              <div className={`step-line ${selectionStep >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${selectionStep >= 2 ? 'active' : ''}`} onClick={() => selectionStep > 1 && setSelectionStep(2)}>2. Mekân</div>
              <div className={`step-line ${selectionStep >= 3 ? 'active' : ''}`}></div>
              <div className={`step ${selectionStep >= 3 ? 'active' : ''}`} onClick={() => selectionStep > 2 && setSelectionStep(3)}>3. Tarih</div>
              <div className={`step-line ${selectionStep >= 4 ? 'active' : ''}`}></div>
              <div className={`step ${selectionStep >= 4 ? 'active' : ''}`}>4. Bilet</div>
            </div>

            <div className="step-content">
              {selectionStep === 1 && (
                <div className="selection-grid">
                  <button className="selection-card glass-panel active" onClick={() => setSelectionStep(2)}>İstanbul</button>
                  <button className="selection-card glass-panel" onClick={() => setSelectionStep(2)}>Ankara</button>
                  <button className="selection-card glass-panel" onClick={() => setSelectionStep(2)}>İzmir</button>
                </div>
              )}
              {selectionStep === 2 && (
                <div className="selection-grid">
                  <button className="selection-card glass-panel active" onClick={() => setSelectionStep(3)}>Harbiye Açık Hava</button>
                  <button className="selection-card glass-panel" onClick={() => setSelectionStep(3)}>Zorlu PSM</button>
                </div>
              )}
              {selectionStep === 3 && (
                <div className="selection-grid">
                  <button className="selection-card glass-panel active" onClick={() => setSelectionStep(4)}>
                    <div className="date">15 Ağu</div>
                    <div className="time">21:00</div>
                  </button>
                  <button className="selection-card glass-panel" onClick={() => setSelectionStep(4)}>
                    <div className="date">16 Ağu</div>
                    <div className="time">21:00</div>
                  </button>
                </div>
              )}
              {selectionStep === 4 && (
                <div className="selection-success">
                  <Check size={32} color="var(--primary)" />
                  <p>Tarih ve mekan seçildi. Sağ taraftan biletinizi seçebilirsiniz.</p>
                </div>
              )}
            </div>
          </div>

          {/* Akordeon Bilgi Panelleri */}
          <div className="accordions-container">
            <div className="accordion-item glass-panel" style={{padding: '24px'}}>
              <h3 style={{marginBottom: '16px', fontSize: '1.1rem', fontWeight: '600'}}>Sanatçılar / Kadro</h3>
              <div style={{display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px'}}>
                <div className="artist-mini-card glass-panel" onClick={() => onViewProfile('artist', 'tarkan')} style={{minWidth: '150px', padding: '16px', cursor: 'pointer', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--glass-border)'}}>
                  <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=84" style={{width: '80px', height: '80px', borderRadius: '50%', marginBottom: '12px', objectFit: 'cover'}} alt="Sanatçı" />
                  <h4 style={{margin: '0', fontSize: '1rem', color: 'var(--text-main)'}}>Tarkan</h4>
                  <p style={{margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)'}}>Pop Müzik</p>
                </div>
              </div>
            </div>

            <AccordionItem title="Etkinlik Hakkında" defaultOpen={true}>
              <p>Yıllardır beklenen büyük buluşma gerçekleşiyor. Tarkan, en sevilen hitlerini ve yeni albümünden şarkıları dev bir orkestra eşliğinde seslendirecek. Sahne şovları ve özel sürprizlerle dolu bu geceyi kaçırmayın.</p>
              <ul className="info-list">
                <li><strong>Süre:</strong> Yaklaşık 120 dakika</li>
                <li><strong>Kapı Açılış:</strong> 19:00</li>
                <li><strong>Dil:</strong> Türkçe</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="Kurallar (Yaş Sınırı, İptal vb.)">
              <div className="info-alert" style={{ marginBottom: '16px', padding: '16px', borderRadius: '16px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', display: 'flex', gap: '12px' }}>
                <Info color="var(--secondary)" size={24} />
                <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  18 yaş sınırı vardır. Belirtilen saatten sonra gelen seyirciler etkinlik alanına alınmayabilir.
                </div>
              </div>
              <ul className="info-list">
                <li>Etkinlik alanına dışarıdan yiyecek ve içecek alınmayacaktır.</li>
                <li>Profesyonel fotoğraf ve video çekimi yasaktır.</li>
                <li>Satın alınan biletlerde iptal, iade ve değişiklik yapılamaz.</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="Mekân & Ulaşım Bilgileri">
              <p><strong>Adres:</strong> Harbiye Mahallesi, Taşkışla Cd. No:8, 34367 Şişli/İstanbul</p>
              <p><strong>Toplu Taşıma:</strong> M2 Yenikapı-Hacıosman metrosu ile Osmanbey veya Taksim durağında inip 10 dakika yürüyerek ulaşabilirsiniz.</p>
              <p><strong>Erişilebilirlik:</strong> Mekan tekerlekli sandalye kullanımına uygundur.</p>
            </AccordionItem>
          </div>
        </div>

        {/* Sağ Taraf (Bilet Satın Alma Kartı) */}
        <div className={`ticket-purchase glass-panel ${selectionStep < 4 ? 'blurred' : ''}`}>
          <h2>Bilet Seçimi</h2>
          
          <div className="ticket-categories">
            {categories.map((cat) => (
              <div 
                key={cat.name}
                className={`category-select ${selectedCategory === cat.name ? 'selected' : ''} ${!cat.available ? 'disabled' : ''}`}
                onClick={() => cat.available && setSelectedCategory(cat.name)}
              >
                <div className="cat-info">
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-status">{cat.available ? `${cat.price} ₺` : 'Tükendi'}</div>
                </div>
                <div className="cat-radio">
                  {selectedCategory === cat.name && <Check size={16} />}
                </div>
              </div>
            ))}
          </div>

          <div className="ticket-counter">
            <span>Adet Seç:</span>
            <div className="counter-controls">
              <button className="icon-btn glass-panel" onClick={handleDecrement} disabled={ticketCount <= 1}>
                <Minus size={16} />
              </button>
              <span className="count-display">{ticketCount}</span>
              <button className="icon-btn glass-panel" onClick={handleIncrement} disabled={ticketCount >= 5}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="purchase-summary">
            <div className="summary-row">
              <span>Bilet ({ticketCount}x)</span>
              <span>{totalPrice} ₺</span>
            </div>
            <div className="summary-row">
              <span>Hizmet Bedeli</span>
              <span>{ticketCount * 15} ₺</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Toplam</span>
              <span className="text-gradient">{totalPrice + (ticketCount * 15)} ₺</span>
            </div>
          </div>

          <button 
            className="btn-primary w-100" 
            style={{ padding: '16px', fontSize: '1.1rem', marginTop: '24px' }}
            onClick={onCheckout}
            disabled={selectionStep < 4}
          >
            Ödemeye Geç
          </button>
          
          {selectionStep < 4 && (
            <div className="overlay-msg">
              <p>Lütfen sol taraftan tarih ve mekan seçimini tamamlayın.</p>
            </div>
          )}
        </div>
      </div>

      {/* Benzer Etkinlikler */}
      <section className="events-section" style={{ padding: '0 10% 40px 10%' }}>
        <div className="section-header">
          <h2>Benzer Etkinlikler</h2>
          <a href="/discover" className="see-all">Tümünü Gör</a>
        </div>
        <div className="horizontal-scroll-container">
          {/* Card 1 */}
          <div className="event-card glass-panel">
            <div className="event-image">
              <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=82" alt="Kenan Doğulu konseri" />
              <div className="event-badges"><span className="category-badge">Konser</span></div>
            </div>
            <div className="event-info">
              <h3>Kenan Doğulu</h3>
              <p className="event-location"><MapPin size={16} /> Harbiye, İstanbul</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="event-card glass-panel">
            <div className="event-image">
              <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=82" alt="Sıla konseri" />
              <div className="event-badges"><span className="category-badge">Konser</span></div>
            </div>
            <div className="event-info">
              <h3>Sıla</h3>
              <p className="event-location"><MapPin size={16} /> Harbiye, İstanbul</p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="event-card glass-panel">
            <div className="event-image">
              <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=82" alt="Mabel Matiz konseri" />
              <div className="event-badges"><span className="category-badge">Konser</span></div>
            </div>
            <div className="event-info">
              <h3>Mabel Matiz</h3>
              <p className="event-location"><MapPin size={16} /> Harbiye, İstanbul</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventDetail;
