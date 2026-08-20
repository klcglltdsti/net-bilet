# BULUŞ — Etkinlik ve bilet platformu

BULUŞ; etkinlik keşfi, kişiselleştirilmiş öneriler, koltuk seçimi, dijital bilet, sosyal eşleşme, organizatör yönetimi ve yönetim merkezi akışlarını tek üründe birleştiren modern bir bilet platformudur.

Tasarım dili mor ve turuncu üzerine kuruludur. Arayüz masaüstü ve mobil ekranlara uyumludur.

## Çalışan demo modu

Uygulama, gerçek ödeme veya canlı müşteri verisi kullanmadan baştan sona test edilebilir. Demo verileri yalnızca kullanılan tarayıcıda saklanır ve sayfa yenilendiğinde korunur.

Önerilen test akışı:

1. `/auth/login` sayfasından istediğiniz demo e-posta ile giriş yapın.
2. Profil ekranında “Profili düzenle” ile bilgileri değiştirip kaydedin.
3. Organizatör panelinden “Yeni etkinlik” seçeneğine girin.
4. Etkinliği düzenleyip son adımda “Demo etkinliğini yayınla” düğmesine basın.
5. Etkinliği açıp koltuk seçerek test satışını tamamlayın.
6. Biletin `/tickets` alanına eklendiğini kontrol edin.
7. `/organizer` panelinde satış adedi ve demo gelirin değiştiğini görün.
8. `/admin/finance` ekranından başarılı/başarısız ödeme denemelerini ve iadeyi izleyin.
9. `/support` üzerinden talep oluşturup `/admin/support` ekranına düştüğünü görün.

Organizatör panelindeki “Demo verilerini sıfırla” düğmesi; oluşturulan etkinlik, satış ve biletleri temizleyerek ilk duruma döner.

## Başlatma

### En kolay yöntem

Finder'da proje klasöründeki `BULUSU_BASLAT.command` dosyasına çift tıklayın. Site hazır olduğunda tarayıcı otomatik açılır. Siteyi kapatmak için açılan Terminal penceresinde `Control + C` tuşlarına basın.

### Terminal ile

Gereksinim: Node.js 22.13 veya daha yeni bir sürüm.

```bash
npm install
npm run dev
```

Tarayıcıdan `http://localhost:3000` adresini açın.

## Kontrol

```bash
npm test
```

Bu komut üretim derlemesini oluşturur; ana sayfayı, etkinlik detayını, API yanıtlarını, veri tabanı migration dosyasını ve sosyal paylaşım görselini doğrular.

## Kapsam

- Etkinlik keşfi, filtreler, sanatçı/mekân/organizatör sayfaları
- “Ne Yapayım?” kişisel öneri akışı
- Çok tarihli etkinlik, koltuk seçimi ve 15 dakikalık rezervasyon sayacı
- Başarılı/reddedilen ödeme, taksit ve kupon simülasyonu; QR bilet cüzdanı ve bilet devri
- Kullanıcı profili, takip, eşleşme ve sosyal özellikler
- Ödül çarkı, puan sistemi, bildirim merkezi ve destek talebi
- Birbirine bağlı yerel demo hesabı, etkinlik oluşturma, satış ve bilet verileri
- Organizatör panelinde etkinlik, bilet, satış, kampanya, finans, rapor ve ekip yönetimi
- Yönetim merkezinde kullanıcı, organizatör, etkinlik, finans, moderasyon, destek ve ayarlar
- Türkiye'nin 81 iliyle şehir seçimi ve etkinlik oluşturma
- 35 tabloluk Drizzle/D1 veri modeli ve örnek API uçları

## Önemli not

Bu teslim, ürünün baştan sona test edilebilir yerel demo sürümüdür. Gerçek para tahsilatı, SMS/e-posta gönderimi, canlı kimlik doğrulama, canlı QR turnike kontrolü ve dosya depolama için seçilecek hizmet sağlayıcıların üretim anahtarları ayrıca tanımlanmalıdır. Hassas anahtarları kaynak koduna yazmayın; ortam değişkenleri kullanın.
