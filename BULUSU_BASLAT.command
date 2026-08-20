#!/bin/zsh
set -euo pipefail

PROJE_KLASORU="${0:A:h}"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"
cd "${PROJE_KLASORU}"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "BULUŞ'u açmak için Node.js gerekiyor."
  echo "https://nodejs.org adresinden güncel LTS sürümünü kurup tekrar deneyin."
  read "?Kapatmak için Enter'a basın."
  exit 1
fi

if /usr/bin/curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
  /usr/bin/open "http://localhost:3000"
  echo "BULUŞ zaten çalışıyor; tarayıcıda açıldı."
  exit 0
fi

if [[ ! -d "node_modules" ]]; then
  echo "İlk kurulum hazırlanıyor..."
  npm install
fi

echo "BULUŞ başlatılıyor..."
npm run dev -- --host 127.0.0.1 --port 3000 &
SUNUCU_PID=$!

temizle() {
  kill "${SUNUCU_PID}" >/dev/null 2>&1 || true
}
trap temizle EXIT INT TERM

for (( deneme=1; deneme<=60; deneme++ )); do
  if /usr/bin/curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
    /usr/bin/open "http://localhost:3000"
    echo ""
    echo "BULUŞ açıldı. Kapatmak için bu pencereye dönüp Control+C tuşlarına basın."
    wait "${SUNUCU_PID}"
    exit 0
  fi
  sleep 0.5
done

echo "Site başlatılamadı. Yukarıdaki hata mesajını kontrol edin."
read "?Kapatmak için Enter'a basın."
exit 1
