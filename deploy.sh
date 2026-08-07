#!/usr/bin/env bash
# AppRUI (Consultar RUI) - deploy
# Domain: https://rui.matubyte.com
# Internal PM2 port: 3847
#
# On the server, from project root:
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
Consultar RUI - deploy (${DOMAIN} -> PM2 :${APP_PORT})

  ./deploy.sh              git pull + deps + build + pm2 restart
  ./deploy.sh --setup      First install (deps, build, pm2 start)
  ./deploy.sh --no-pull    Build + restart without git pull
  sudo ./deploy.sh --nginx Install nginx site (HTTP -> :${APP_PORT})

First time:
  1) Put code at ~/apps/AppRUI
  2) ./deploy.sh --setup
  3) sudo ./deploy.sh --nginx
  4) DNS rui.matubyte.com -> this server
  5) sudo certbot --nginx -d ${DOMAIN}
  6) Later updates: ./deploy.sh
EOF
}

for arg in "$@"; do
  case "$arg" in
    --setup) DO_SETUP=true ;;
    --no-pull) DO_PULL=false ;;
    --nginx) DO_NGINX=true ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $arg"; usage; exit 1 ;;
  esac
done

require_package_json() {
  if [[ ! -f package.json ]]; then
    echo "ERROR: No package.json in $APP_DIR"
    exit 1
  fi
}

ensure_env() {
  if [[ ! -f .env ]]; then
    if [[ -f .env.example ]]; then
      cp .env.example .env
      echo "Created .env from .env.example"
    else
      cat > .env <<ENV
VITE_SITE_URL=https://${DOMAIN}
VITE_API_BASE_URL=https://iur.logsfm.com
ENV
      echo "Created default .env"
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
  echo "==> Production build..."
  npm run build
  if [[ ! -f dist/index.html ]]; then
    echo "ERROR: dist/index.html missing"
    exit 1
  fi
}

ensure_pm2() {
  if ! command -v pm2 >/dev/null 2>&1; then
    echo "==> Installing PM2..."
    npm install -g pm2
  fi
}

start_pm2() {
  ensure_pm2
  echo "==> PM2 start ${APP_NAME} (port ${APP_PORT})..."
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
    echo "==> Starting ${APP_NAME}..."
    pm2 start ecosystem.config.cjs
    pm2 save
  fi
}

verify_local() {
  echo "==> Checking http://127.0.0.1:${APP_PORT}..."
  sleep 1
  if curl -sf -o /dev/null -I "http://127.0.0.1:${APP_PORT}"; then
    echo "OK - responding on :${APP_PORT}"
  else
    echo "WARN: no response on :${APP_PORT}. Check: pm2 logs ${APP_NAME}"
  fi
}

install_nginx() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "ERROR: --nginx requires sudo/root"
    exit 1
  fi
  if [[ ! -f "$NGINX_SRC" ]]; then
    echo "ERROR: Missing $NGINX_SRC"
    exit 1
  fi
  echo "==> Installing nginx site ${DOMAIN}..."
  # strip BOM if present
  sed '1s/^\xEF\xBB\xBF//' "$NGINX_SRC" > "$NGINX_AVAILABLE"
  ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
  nginx -t
  systemctl reload nginx
  echo "OK - nginx proxy ${DOMAIN} -> 127.0.0.1:${APP_PORT}"
  echo "Next: sudo certbot --nginx -d ${DOMAIN}"
}

git_pull() {
  if [[ -d .git ]] && command -v git >/dev/null 2>&1; then
    echo "==> git pull..."
    git pull --ff-only || echo "WARN: git pull failed; continuing"
  else
    echo "==> No git repo, skip pull"
  fi
}

if $DO_NGINX; then
  install_nginx
  exit 0
fi

require_package_json
ensure_env

if $DO_SETUP; then
  echo "==> Initial setup AppRUI in $APP_DIR"
  install_deps
  build_app
  start_pm2
  verify_local
  echo ""
  echo "Setup done. Next:"
  echo "  sudo bash ./deploy.sh --nginx"
  echo "  sudo certbot --nginx -d ${DOMAIN}"
  exit 0
fi

echo "==> Deploy AppRUI (${DOMAIN}) in $APP_DIR"
if $DO_PULL; then
  git_pull
fi
install_deps
build_app
restart_pm2
verify_local

echo ""
echo "Deploy OK - https://${DOMAIN} (internal :${APP_PORT})"
echo "Sitemap: https://${DOMAIN}/sitemap-index.xml"
