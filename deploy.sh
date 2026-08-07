#!/usr/bin/env bash
# AppRUI (Consultar RUI) â€” deploy en producciÃ³n
# Dominio: https://rui.matubyte.com
# Puerto interno PM2: 3847
#
# Ejecutar EN EL SERVIDOR, desde la raÃ­z del proyecto:
#   chmod +x deploy.sh
#   ./deploy.sh --setup
#   sudo ./deploy.sh --nginx
#   sudo certbot --nginx -d rui.matubyte.com
#   ./deploy.sh
#
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

APP_NAME="rui-web"
APP_PORT="3847"
DOMAIN="rui.matubyte.com"
NGINX_SRC="$APP_DIR/deploy/nginx-rui.matubyte.com.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

DO_PULL=true
DO_SETUP=false
DO_NGINX=false

usage() {
  cat <<EOF
Consultar RUI â€” deploy (rui.matubyte.com â†’ PM2 :${APP_PORT})

  ./deploy.sh              git pull + deps + build + pm2 restart
  ./deploy.sh --setup      Primera vez (deps, build, pm2 start)
  ./deploy.sh --no-pull    Build + restart sin git pull
  sudo ./deploy.sh --nginx Instalar site nginx (HTTP â†’ :${APP_PORT})

Primera vez recomendada:
  1) Sube/clona el repo en el servidor (ej. ~/apps/AppRUI)
  2) ./deploy.sh --setup
  3) sudo ./deploy.sh --nginx
  4) DNS: CNAME/A rui.matubyte.com â†’ este servidor
  5) sudo certbot --nginx -d ${DOMAIN}
  6) Actualizaciones: ./deploy.sh

PM2:
  pm2 status
  pm2 logs ${APP_NAME}
  pm2 restart ${APP_NAME}
EOF
}

for arg in "$@"; do
  case "$arg" in
    --setup) DO_SETUP=true ;;
    --no-pull) DO_PULL=false ;;
    --nginx) DO_NGINX=true ;;
    -h|--help) usage; exit 0 ;;
    *) echo "OpciÃ³n desconocida: $arg"; usage; exit 1 ;;
  esac
done

require_package_json() {
  if [[ ! -f package.json ]]; then
    echo "ERROR: No hay package.json en $APP_DIR"
    exit 1
  fi
}

ensure_env() {
  if [[ ! -f .env ]]; then
    if [[ -f .env.example ]]; then
      cp .env.example .env
      echo "Creado .env desde .env.example"
    else
      cat > .env <<ENV
VITE_SITE_URL=https://${DOMAIN}
VITE_API_BASE_URL=https://iur.logsfm.com
ENV
      echo "Creado .env por defecto"
    fi
  fi

  if grep -q '^VITE_SITE_URL=' .env; then
    sed -i "s|^VITE_SITE_URL=.*|VITE_SITE_URL=https://${DOMAIN}|" .env
  else
    echo "VITE_SITE_URL=https://${DOMAIN}" >> .env
  fi

  if ! grep -q '^VITE_API_BASE_URL=' .env; then
    echo "VITE_API_BASE_URL=https://iur.logsfm.com" >> .env
  fi

  echo "==> Build env:"
  grep -E '^VITE_' .env || true
}

install_deps() {
  if [[ -f package-lock.json ]]; then
    echo "==> npm ci..."
    npm ci
  else
    echo "==> npm install..."
    npm install
  fi
}

build_app() {
  echo "==> Build producciÃ³n..."
  npm run build
  if [[ ! -f dist/index.html ]]; then
    echo "ERROR: dist/index.html no existe"
    exit 1
  fi
}

ensure_pm2() {
  if ! command -v pm2 >/dev/null 2>&1; then
    echo "==> Instalando PM2..."
    npm install -g pm2
  fi
}

start_pm2() {
  ensure_pm2
  echo "==> PM2 start ${APP_NAME} (puerto ${APP_PORT})..."
  pm2 delete "$APP_NAME" 2>/dev/null || true
  pm2 start ecosystem.config.cjs
  pm2 save
}

restart_pm2() {
  ensure_pm2
  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    echo "==> PM2 restart ${APP_NAME}..."
    pm2 restart "$APP_NAME" --update-env
  else
    echo "==> PM2 no encontrÃ³ ${APP_NAME}, iniciando..."
    pm2 start ecosystem.config.cjs
    pm2 save
  fi
}

verify_local() {
  echo "==> Verificando http://127.0.0.1:${APP_PORT}..."
  sleep 1
  if curl -sf -o /dev/null -I "http://127.0.0.1:${APP_PORT}"; then
    echo "OK â€” respondiendo en :${APP_PORT}"
  else
    echo "AVISO: sin respuesta en :${APP_PORT}. Revisa: pm2 logs ${APP_NAME}"
  fi
}

install_nginx() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "ERROR: --nginx requiere sudo"
    exit 1
  fi
  if [[ ! -f "$NGINX_SRC" ]]; then
    echo "ERROR: Falta $NGINX_SRC"
    exit 1
  fi
  echo "==> Instalando nginx site ${DOMAIN}..."
  cp "$NGINX_SRC" "$NGINX_AVAILABLE"
  ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
  nginx -t
  systemctl reload nginx
  echo "OK â€” nginx proxy ${DOMAIN} â†’ 127.0.0.1:${APP_PORT}"
  echo "Siguiente: sudo certbot --nginx -d ${DOMAIN}"
}

git_pull() {
  if [[ -d .git ]] && command -v git >/dev/null 2>&1; then
    echo "==> git pull..."
    git pull --ff-only || {
      echo "AVISO: git pull fallÃ³; continÃºa con el cÃ³digo local"
    }
  else
    echo "==> Sin repo git, omitiendo pull"
  fi
}

if $DO_NGINX; then
  install_nginx
  exit 0
fi

require_package_json
ensure_env

if $DO_SETUP; then
  echo "==> Setup inicial AppRUI en $APP_DIR"
  install_deps
  build_app
  start_pm2
  verify_local
  echo ""
  echo "Setup listo. Siguiente:"
  echo "  sudo ./deploy.sh --nginx"
  echo "  # DNS rui.matubyte.com â†’ este servidor"
  echo "  sudo certbot --nginx -d ${DOMAIN}"
  exit 0
fi

echo "==> Deploy AppRUI (${DOMAIN}) en $APP_DIR"
if $DO_PULL; then
  git_pull
fi
install_deps
build_app
restart_pm2
verify_local

echo ""
echo "Deploy OK â€” https://${DOMAIN} (interno :${APP_PORT})"
echo "Sitemap: https://${DOMAIN}/sitemap-index.xml"
