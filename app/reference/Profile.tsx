// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Ticket, Heart, User, Settings, CreditCard, LogOut, MessageCircle, Info, ChevronRight, QrCode, Calendar, MapPin } from 'lucide-react';
import { useReferenceTheme } from './use-reference-theme';
import { updateDemoUser, useDemoState } from '../lib/demo-store';
import { navigateTo } from '../../src/router';

function Profile({ onBack, initialTab = 'tickets' }) {
  useReferenceTheme('profile');
  const demo = useDemoState();
  const [activeTab, setActiveTab] = useState(initialTab); // 'tickets', 'favorites', 'settings', 'help'
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [notice, setNotice] = useState('');
  const [emailNotices, setEmailNotices] = useState(true);
  const [smsNotices, setSmsNotices] = useState(true);
  const ticket = demo.tickets[0];
  useEffect(() => setForm({ name: demo.currentUser.name, phone: demo.currentUser.phone, email: demo.currentUser.email }), [demo.currentUser]);

  return (
    <div className="profile-page">
      <button className="back-btn glass-panel" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      <div className="profile-container">
        {/* Sol Menü (Sidebar) */}
        <div className="profile-sidebar glass-panel">
          <div className="user-info">
            <div className="user-avatar">
              <span className="initials">AY</span>
            </div>
            <div>
              <h3 style={{color: 'var(--text-main)', marginBottom: '4px'}}>{demo.currentUser.name}</h3>
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Premium Üye</p>
            </div>
          </div>

          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'tickets' ? 'active' : ''}`} 
              onClick={() => setActiveTab('tickets')}
            >
              <Ticket size={20} /> Biletlerim
            </button>
            <button 
              className={`menu-item ${activeTab === 'favorites' ? 'active' : ''}`} 
              onClick={() => setActiveTab('favorites')}
            >
              <Heart size={20} /> Favorilerim
            </button>
            <button 
              className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} 
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} /> Ayarlar ve Fatura
            </button>
            <button 
              className={`menu-item ${activeTab === 'help' ? 'active' : ''}`} 
              onClick={() => setActiveTab('help')}
            >
              <Info size={20} /> Yardım Merkezi
            </button>
          </div>

          <button className="logout-btn" onClick={() => navigateTo('/auth/login')}>
            <LogOut size={20} /> Çıkış Yap
          </button>
        </div>

        {/* Sağ İçerik Alanı */}
        <div className="profile-content glass-panel">
          {notice && <p className="reference-notice profile-notice" role="status">{notice}</p>}
          
          {activeTab === 'tickets' && (
            <div className="tab-section">
              <h2>Yaklaşan Etkinliklerim</h2>
              <div className="tickets-list">
                
                {/* Dijital Bilet Kartı */}
                <div className="digital-ticket glass-panel">
                  <div className="ticket-visual">
                    <img src="https://picsum.photos/seed/konser/400/200" alt="event" />
                    <div className="ticket-qr">
                      <QrCode size={48} />
                      <span>Okutmak için tıkla</span>
                    </div>
                  </div>
                  <div className="ticket-details">
                    <div className="badge status-success" style={{marginBottom: '12px', display: 'inline-block'}}>Yaklaşan</div>
                    <h3>{ticket?.eventTitle || 'Yaz Akşamı Konserleri'}</h3>
                    <div className="ticket-meta">
                      <p><Calendar size={16} /> {ticket ? `${ticket.date}, ${ticket.time}` : '15 Ağustos 2026, 21:00'}</p>
                      <p><MapPin size={16} /> {ticket ? `${ticket.place}, ${ticket.city}` : 'Harbiye Açık Hava, İstanbul'}</p>
                      <p><User size={16} /> {ticket ? `${ticket.category} - ${ticket.seats.join(', ')}` : 'Kategori 1 - A Blok, 5. Sıra'}</p>
                    </div>
                    <div className="ticket-actions">
                      <button className="btn-outline btn-sm" onClick={() => setNotice('Etkinlik demo takvimine eklendi.')}>Takvime Ekle</button>
                      <button className="btn-outline btn-sm" onClick={() => navigateTo('/venue/milyon-performance-hall')}>Yol Tarifi Al</button>
                      <button className="btn-outline btn-sm text-danger" style={{borderColor: '#ef4444', color: '#ef4444'}} onClick={() => setNotice('Demo iade talebi oluşturuldu ve finans akışına kaydedildi.')}>İade Talebi</button>
                    </div>
                  </div>
                </div>

              </div>

              <h2 style={{marginTop: '48px', color: 'var(--text-muted)'}}>Geçmiş Etkinlikler</h2>
              <div className="past-tickets">
                <div className="past-ticket-item glass-panel">
                  <div className="past-info">
                    <h4>Cem Yılmaz - CMXXIV</h4>
                    <p>12 Mayıs 2024 • Zorlu PSM</p>
                  </div>
                  <button className="btn-outline btn-sm" onClick={() => setNotice('Demo değerlendirme alanı açıldı.')}>Tekrar Değerlendir</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="tab-section">
              <h2>Favorilerim</h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '24px'}}>Takip ettiğin etkinlikler ve sanatçılar burada listelenir.</p>
              
              <div className="favorites-grid">
                <div className="favorite-card glass-panel" onClick={() => navigateTo('/artist/mesut-sure')}>
                  <img src="https://picsum.photos/seed/tarkan-avatar/150/150" alt="Tarkan" />
                  <h4>Tarkan</h4>
                  <span className="badge">Sanatçı</span>
                </div>
                <div className="favorite-card glass-panel" onClick={() => navigateTo('/venue/milyon-performance-hall')}>
                  <img src="https://picsum.photos/seed/harbiye/150/150" alt="Harbiye" />
                  <h4>Harbiye Açık Hava</h4>
                  <span className="badge">Mekân</span>
                </div>
                <div className="favorite-card glass-panel" onClick={() => navigateTo('/event/mesut-sure-iliski-testi')}>
                  <img src="https://picsum.photos/seed/tiyatro/150/150" alt="Tiyatro" />
                  <h4>Amadeus</h4>
                  <span className="badge">Etkinlik</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-section">
              <h2>Ayarlar ve Fatura</h2>
              
              <div className="settings-group">
                <h3>Kişisel Bilgiler</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ad Soyad</label>
                  <input type="text" value={form.name} onChange={event => setForm({...form, name:event.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>
                  <input type="text" value={form.phone} onChange={event => setForm({...form, phone:event.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>E-posta</label>
                <input type="email" value={form.email} onChange={event => setForm({...form, email:event.target.value})} />
                </div>
                <button className="btn-primary" style={{padding: '12px 24px'}} onClick={() => { updateDemoUser(form); setNotice('Profil bilgileri kaydedildi.'); }}>Bilgileri Güncelle</button>
              </div>

              <div className="settings-group" style={{marginTop: '48px'}}>
                <h3>Kayıtlı Kartlarım</h3>
                <div className="saved-card glass-panel">
                  <CreditCard size={32} color="var(--primary)" />
                  <div className="card-info">
                    <h4>Garanti Bankası</h4>
                    <p>**** **** **** 4589</p>
                  </div>
                  <button className="btn-icon" style={{marginLeft: 'auto'}} title="Sil" onClick={() => setNotice('Demo kart kaldırıldı.')}><ArrowLeft size={16} style={{transform: 'rotate(45deg)'}} /></button>
                </div>
                <button className="btn-outline" style={{marginTop: '16px'}} onClick={() => setNotice('Demo kart ekleme alanı açıldı.')}>+ Yeni Kart Ekle</button>
              </div>

              <div className="settings-group" style={{marginTop: '48px'}}>
                <h3>Bildirim Tercihleri</h3>
                <div className="notification-toggle">
                  <div>
                    <h4>E-posta Bildirimleri</h4>
                    <p>Yeni etkinlikler ve indirimlerden haberdar olun.</p>
                  </div>
                  <button type="button" aria-label="E-posta bildirimlerini değiştir" className={`toggle-switch ${emailNotices ? 'active' : ''}`} onClick={() => setEmailNotices(value => !value)}></button>
                </div>
                <div className="notification-toggle">
                  <div>
                    <h4>SMS Bildirimleri</h4>
                    <p>Bilet hatırlatmaları ve acil durum bilgilendirmeleri.</p>
                  </div>
                  <button type="button" aria-label="SMS bildirimlerini değiştir" className={`toggle-switch ${smsNotices ? 'active' : ''}`} onClick={() => setSmsNotices(value => !value)}></button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="tab-section">
              <h2>Yardım Merkezi</h2>
              <div className="support-banner glass-panel">
                <MessageCircle size={32} color="var(--primary)" />
                <div>
                  <h3>Nasıl Yardımcı Olabiliriz?</h3>
                  <p>Müşteri temsilcilerimiz 7/24 hizmetinizde.</p>
                </div>
                <button className="btn-primary" style={{marginLeft: 'auto'}} onClick={() => navigateTo('/support')}>Canlı Destek Başlat</button>
              </div>

              <h3 style={{marginTop: '40px', marginBottom: '20px'}}>Sıkça Sorulan Sorular</h3>
              <div className="faq-list">
                <div className="faq-item glass-panel">
                  <h4>Biletimi nereden görebilirim? <ChevronRight size={20} /></h4>
                </div>
                <div className="faq-item glass-panel">
                  <h4>Biletimi nasıl iptal edebilirim? <ChevronRight size={20} /></h4>
                </div>
                <div className="faq-item glass-panel">
                  <h4>Etkinlik ertelenirse ne olur? <ChevronRight size={20} /></h4>
                </div>
                <div className="faq-item glass-panel">
                  <h4>Faturama nasıl ulaşabilirim? <ChevronRight size={20} /></h4>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
