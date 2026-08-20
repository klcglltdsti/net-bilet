# BULUŞ — Etkinlik ve bilet platformu

BULUŞ; etkinlik keşfi, kişiselleştirilmiş öneriler, koltuk seçimi, dijital bilet, sosyal eşleşme, organizatör yönetimi ve yönetim merkezi akışlarını birleştiren çalışan bir tarayıcı demosudur.

Bu sürüm standart **React + Vite** ile hazırlanmıştır. Sunucu zorunluluğu yoktur; üretim derlemesi normal HTML, CSS ve JavaScript dosyaları oluşturur. GitHub Pages dâhil statik site servislerinde çalışır.

## Çalışan demo modu

Gerçek ödeme, SMS, e-posta veya kimlik doğrulaması yapılmaz. Etkinlik, kullanıcı, satış, bilet ve destek verileri kullanılan tarayıcının `localStorage` alanında saklanır ve sayfa yenilendiğinde korunur.

Önerilen test akışı:

1. `/#/auth/login` ekranından istediğiniz demo e-posta ile giriş yapın.
2. `/#/profile` ekranında bilgileri değiştirip kaydedin.
3. `/#/organizer/events/new` alanından yeni etkinlik oluşturun.
4. Etkinliği demo olarak yayınlayın ve keşfet ekranında açın.
5. Koltuk seçip başarılı veya reddedilen ödeme simülasyonu yapın.
6. Biletin `/#/tickets` alanına eklendiğini kontrol edin.
7. Satışı `/#/organizer` ve `/#/admin/finance` alanlarından izleyin.
8. `/#/support` üzerinden talep oluşturup `/#/admin/support` ekranında yönetin.

## Bilgisayarda başlatma

macOS'ta `BULUSU_BASLAT.command` dosyasına çift tıklayabilirsiniz.

Alternatif olarak:

```bash
npm install
npm run dev
```

Site `http://localhost:3000` adresinde açılır.

## Üretim derlemesi

```bash
npm run build
```

Yüklemeye hazır statik site `dist/` klasöründe oluşur. `dist/index.html` ana giriş dosyasıdır.

## GitHub Pages

`.github/workflows/deploy-pages.yml` dosyası hazırdır. Repo ayarlarında:

1. **Settings → Pages** bölümünü açın.
2. **Build and deployment → Source** alanında **GitHub Actions** seçin.
3. Dosyaları `main` dalına gönderin.

GitHub uygulamayı otomatik derleyip yayımlar. Sayfa adresleri `/#/admin`, `/#/organizer` biçimindedir; bu sayede GitHub Pages üzerinde yenileme ve doğrudan bağlantılar bozulmaz.

## Kontrol

```bash
npm test
```

Bu komut TypeScript kontrolünü, üretim derlemesini, statik giriş dosyasını, rotaları, demo veri bağlantılarını ve tarayıcı içi API simülasyonunu doğrular.

## Kapsam

- Mor ve turuncu, mobil uyumlu kullanıcı arayüzü
- Etkinlik keşfi, filtreler, sanatçı, mekân ve organizatör sayfaları
- Kişisel öneri, koltuk seçimi ve rezervasyon sayacı
- Başarılı/reddedilen ödeme, kupon ve taksit simülasyonu
- QR bilet cüzdanı, bilet devri, profil ve sosyal özellikler
- Organizatör etkinlik, satış, kampanya, finans, rapor ve ekip ekranları
- Admin kullanıcı, organizatör, etkinlik, finans, moderasyon, destek ve ayar ekranları
- Türkiye'nin 81 iliyle etkinlik oluşturma
- Birbirine bağlı yerel demo verileri ve tarayıcı içi örnek API yanıtları

## Üretim notu

Bu teslim test edilebilir statik demodur. Gerçek satış sisteminde üyelik, ödeme, veri tabanı, dosya depolama, e-posta/SMS ve QR turnike işlemleri güvenli sunucu servislerine bağlanmalıdır.
