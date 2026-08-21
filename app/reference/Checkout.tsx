// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, Ticket, Clock, Info } from 'lucide-react';
import { useReferenceTheme } from './use-reference-theme';
import { findEvent } from '../data/events';
import { recordDemoSale } from '../lib/demo-store';
import { currentSearchParams } from '../../src/router';

function Checkout({ onBack, onComplete }) {
  useReferenceTheme('checkout');
  const event = findEvent(currentSearchParams().get('event') || 'mabel-matiz-fatih-turnesi');
  const saleRecorded = useRef(false);
  const [step, setStep] = useState('seats'); // 'seats' | 'payment' | 'success'
  
  // Seat Selection States
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Payment Form States
  const [formData, setFormData] = useState({
    name: 'Ahmet Yılmaz', email: 'demo@netbilet.com', phone: '0555 555 55 55',
    cardNumber: '4242 4242 4242 4242', expiry: '12/30', cvv: '123'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [scenario, setScenario] = useState('success');
  const [installments, setInstallments] = useState(1);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentError, setPaymentError] = useState('');

  // Timer State for Payment
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (step === 'payment') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  // Generate mockup seats: 5 rows, 10 columns
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const columns = [1,2,3,4,5,6,7,8,9,10];
  const occupiedSeats = ['A-3', 'A-4', 'B-7', 'C-1', 'C-2', 'E-9', 'E-10'];
  const seatPrice = 250;
  const subtotal = (selectedSeats.length * seatPrice) + (selectedSeats.length * 15);
  const total = Math.max(0, subtotal - discount);

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < 5) { // Max 5 seats
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert("En fazla 5 koltuk seçebilirsiniz.");
      }
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedSeats.length) return;
    setIsProcessing(true);
    setTimeout(() => {
      if (!saleRecorded.current) {
        const created = recordDemoSale(event, selectedSeats, total, { method: 'Demo kart •••• 4242', installments, fail: scenario === 'fail' });
        if (!created) {
          setPaymentError('Test banka yanıtı: işlem reddedildi. Deneme, admin finans ekranına kaydedildi.');
          setIsProcessing(false);
          return;
        }
        saleRecorded.current = true;
      }
      setPaymentError('');
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  const applyCoupon = () => {
    const code = coupon.trim().toLocaleUpperCase('tr-TR');
    if (code === 'NET20' || code === 'BULUS20') {
      setDiscount(Math.round(subtotal * 0.2));
      setPaymentError('');
    } else if (code === 'NET100') {
      setDiscount(100);
      setPaymentError('');
    } else {
      setDiscount(0);
      setPaymentError('Kupon bulunamadı. Test için NET20 kodunu kullanabilirsin.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (step === 'success') {
    return (
      <div className="checkout-page success-state">
        <div className="success-card glass-panel">
          <div className="success-icon">
            <CheckCircle2 size={80} color="var(--primary)" />
          </div>
          <h2>Biletiniz Hazır!</h2>
          <p>Ödemeniz başarıyla gerçekleşti. Bilet detaylarınız <strong>{formData.email}</strong> adresine gönderildi.</p>
          <div className="ticket-preview">
            <div className="tp-header">{event.title}</div>
            <div className="tp-body">
              <div><strong>Tarih:</strong> {event.day} {event.month} - {event.time || '21:00'}</div>
              <div><strong>Mekan:</strong> {event.place}, {event.city}</div>
              <div><strong>Koltuklar:</strong> {selectedSeats.join(', ')}</div>
            </div>
          </div>
          <button className="btn-primary w-100" onClick={onComplete} style={{ marginTop: '32px', padding: '16px' }}>
            Biletlerimi Aç
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button className="back-btn glass-panel" onClick={step === 'payment' ? () => setStep('seats') : onBack}>
        <ArrowLeft size={20} />
      </button>

      <div className="checkout-container">
        {/* Sol Taraf (Harita veya Form) */}
        <div className="checkout-main-section">
          
          {step === 'seats' && (
            <div className="seat-selection-area glass-panel">
              <h2 style={{ marginBottom: '24px' }}>Koltuk Seçimi</h2>
              
              <div className="stage-area">
                <div className="stage">SAHNE</div>
              </div>

              <div className="seating-map">
                {rows.map(row => (
                  <div key={row} className="seat-row">
                    <span className="row-label">{row}</span>
                    <div className="seats">
                      {columns.map(col => {
                        const seatId = `${row}-${col}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                          <div 
                            key={seatId} 
                            className={`seat ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSeat(seatId)}
                            title={isOccupied ? 'Dolu' : `${seatId} - ${seatPrice} ₺`}
                          >
                            {col}
                          </div>
                        );
                      })}
                    </div>
                    <span className="row-label">{row}</span>
                  </div>
                ))}
              </div>

              <div className="seat-legend">
                <div className="legend-item"><div className="seat-box available"></div> Boş</div>
                <div className="legend-item"><div className="seat-box selected"></div> Seçili</div>
                <div className="legend-item"><div className="seat-box occupied"></div> Dolu</div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="payment-form-area">
              <div className="timer-alert glass-panel" style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', background: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.3)'}}>
                <Clock color="#fb923c" size={24} />
                <div>
                  <h4 style={{color: '#fb923c', margin: '0 0 4px 0'}}>Sepetinizdeki Biletler Ayrıldı</h4>
                  <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-main)'}}>İşlemi tamamlamak için kalan süreniz: <strong style={{fontSize: '1.1rem'}}>{formatTime(timeLeft)}</strong></p>
                </div>
              </div>

              <h2 style={{ marginBottom: '32px', fontSize: '2rem' }}>Güvenli Ödeme</h2>
              
              <form onSubmit={handlePaymentSubmit} className="checkout-form glass-panel">
                <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Kişisel Bilgiler</h3>
                <div className="form-group">
                  <label>Ad Soyad</label>
                  <input type="text" name="name" required placeholder="Örn: Ahmet Yılmaz" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>E-posta Adresi</label>
                    <input type="email" name="email" required placeholder="ornek@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>
                    <input type="tel" name="phone" required placeholder="05XX XXX XX XX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <div className="divider" style={{ margin: '32px 0', width: '100%', height: '1px', background: 'var(--glass-border)' }}></div>

                <h3 style={{ marginBottom: '16px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={20} /> Kart Bilgileri
                </h3>
                <div className="demo-payment-tools">
                  <div className="demo-mode-note">🧪 Bu alan ödeme simülasyonudur; gerçek karttan para çekilmez.</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Test Senaryosu</label>
                      <select value={scenario} onChange={(e) => { const value = e.target.value; setScenario(value); setPaymentError(''); setFormData({...formData, cardNumber: value === 'success' ? '4242 4242 4242 4242' : '4000 0000 0000 0002'}); }}>
                        <option value="success">Başarılı ödeme</option>
                        <option value="fail">Reddedilen ödeme</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Taksit</label>
                      <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))}>
                        <option value="1">Tek çekim</option>
                        <option value="2">2 taksit</option>
                        <option value="3">3 taksit</option>
                        <option value="6">6 taksit</option>
                      </select>
                    </div>
                  </div>
                  <div className="coupon-row">
                    <label htmlFor="demo-coupon">Demo kuponu</label>
                    <div><input id="demo-coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="NET20"/><button type="button" onClick={applyCoupon}>Uygula</button></div>
                    {discount > 0 && <small>✓ Kupon uygulandı: −{discount} ₺</small>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Kart Üzerindeki İsim</label>
                  <input type="text" required placeholder="AHMET YILMAZ" />
                </div>
                <div className="form-group">
                  <label>Kart Numarası</label>
                  <input type="text" name="cardNumber" required placeholder="XXXX XXXX XXXX XXXX" maxLength="19" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Son Kullanma (AA/YY)</label>
                    <input type="text" name="expiry" required placeholder="MM/YY" maxLength="5" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" name="cvv" required placeholder="XXX" maxLength="3" value={formData.cvv} onChange={(e) => setFormData({...formData, cvv: e.target.value})} />
                  </div>
                </div>

                <div className="secure-badge">
                  <ShieldCheck size={16} /> 256-bit SSL ile güvenli ödeme yapıyorsunuz
                </div>
                {paymentError && <div className="demo-payment-error" role="alert">! {paymentError}</div>}
              </form>
            </div>
          )}

        </div>

        {/* Sağ Taraf (Sipariş Özeti) */}
        <div className="checkout-summary-section">
          <div className="purchase-summary glass-panel sticky-summary">
            <h3 style={{ marginBottom: '24px' }}>Sipariş Özeti</h3>
            
            <div className="event-mini-info">
              <img src="https://picsum.photos/seed/konser/200/150" alt="event" />
              <div>
                <h4>{event.title}</h4>
                <p>{event.day} {event.month}, {event.place}</p>
              </div>
            </div>
            
            <div className="summary-divider"></div>

            {selectedSeats.length > 0 ? (
              <>
                <div style={{marginBottom: '16px'}}>
                  <h5 style={{color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem'}}>Seçilen Koltuklar</h5>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {selectedSeats.map(seat => (
                      <span key={seat} className="seat-badge glass-panel"><Ticket size={14} style={{marginRight: '4px'}}/> {seat}</span>
                    ))}
                  </div>
                </div>
                <div className="summary-row">
                  <span>Bilet Bedeli ({selectedSeats.length}x)</span>
                  <span>{selectedSeats.length * seatPrice} ₺</span>
                </div>
                <div className="summary-row">
                  <span>Hizmet Bedeli</span>
                  <span>{selectedSeats.length * 15} ₺</span>
                </div>
                {discount > 0 && <div className="summary-row discount-row"><span>Kupon İndirimi</span><span>−{discount} ₺</span></div>}
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Ödenecek Tutar</span>
                  <span className="text-gradient">{total} ₺</span>
                </div>
                {step === 'payment' && installments > 1 && <small className="installment-note">{installments} × {Math.ceil(total / installments)} ₺ demo taksit</small>}
              </>
            ) : (
              <div style={{padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)'}}>
                <Info size={32} style={{marginBottom: '12px', opacity: 0.5}} />
                <p>Henüz koltuk seçmediniz.</p>
              </div>
            )}

            {step === 'seats' && (
              <button 
                className="btn-primary w-100" 
                style={{ padding: '16px', fontSize: '1.1rem', marginTop: '32px' }}
                disabled={selectedSeats.length === 0}
                onClick={() => setStep('payment')}
              >
                Ödemeye Devam Et
              </button>
            )}

            {step === 'payment' && (
              <>
                <button 
                  type="submit" 
                  className="btn-primary w-100" 
                  style={{ padding: '16px', fontSize: '1.1rem', marginTop: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing || timeLeft === 0}
                >
                  {isProcessing ? 'İşleniyor...' : scenario === 'success' ? 'Test Satışını Tamamla' : 'Reddedilmeyi Simüle Et'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                  Ödemeyi tamamlayarak Mesafeli Satış Sözleşmesi'ni kabul etmiş sayılırsınız.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
