#!/bin/zsh
set -euo pipefail

PROJE_KLASORU="${0:A:h}"
CALISMA_ZAMANI="/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies"
PNPM_KOMUTU="${CALISMA_ZAMANI}/bin/fallback/pnpm"
NODE_KOMUTU="${CALISMA_ZAMANI}/node/bin/node"

if [[ ! -x "${NODE_KOMUTU}" || ! -x "${PNPM_KOMUTU}" ]]; then
  echo "BULUŞ için gereken çalışma ortamı bulunamadı."
  echo "Codex uygulamasını açıp bu konuşmadan yardım isteyebilirsin."
  read "?Kapatmak için Enter'a bas."
  exit 1
fi

export PATH="${CALISMA_ZAMANI}/node/bin:${CALISMA_ZAMANI}/bin/fallback:/usr/bin:/bin"
cd "${PROJE_KLASORU}"

if /usr/bin/curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
  /usr/bin/open "http://localhost:3000"
  echo "BULUŞ zaten çalışıyor; tarayıcıda açıldı."
  exit 0
fi

if [[ ! -d "node_modules" ]]; then
  echo "İlk hazırlık yapılıyor. Bu işlem bir kez yapılır..."
  "${PNPM_KOMUTU}" install
fi

echo "BULUŞ başlatılıyor..."
"${PNPM_KOMUTU}" run dev &
SUNUCU_PID=$!

temizle() {
  kill "${SUNUCU_PID}" >/dev/null 2>&1 || true
}
trap temizle EXIT INT TERM

for (( deneme=1; deneme<=60; deneme++ )); do
  if /usr/bin/curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
    /usr/bin/open "http://localhost:3000"
    echo ""
    echo "BULUŞ açıldı. Siteyi kapatmak için bu pencereye dönüp Control+C tuşlarına bas."
    wait "${SUNUCU_PID}"
    exit 0
  fi
  sleep 0.5
done

echo "Site başlatılamadı. Bu pencerenin ekran görüntüsünü Codex'e gönder."
read "?Kapatmak için Enter'a bas."
exit 1
