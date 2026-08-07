# Deploy — Consultar RUI (`rui.matubyte.com`)

Puerto interno PM2: **3847** (alto, para no chocar con otros servicios).  
Nginx hace proxy público → `127.0.0.1:3847`.

## Requisitos en el servidor

- Node.js 20+
- nginx
- PM2 (`npm i -g pm2`)
- certbot (HTTPS)
- DNS: `rui.matubyte.com` → IP del servidor (A o CNAME)

## Primera vez

```bash
# 1) Código en el servidor
mkdir -p ~/apps && cd ~/apps
# clona o sube AppRUI aquí, ej:
# git clone <tu-repo> AppRUI
cd AppRUI

# 2) Setup (deps + build + PM2)
chmod +x deploy.sh
./deploy.sh --setup

# 3) Nginx
sudo ./deploy.sh --nginx

# 4) HTTPS
sudo certbot --nginx -d rui.matubyte.com

# 5) PM2 al boot (si aún no)
pm2 startup
pm2 save
```

## Actualizar

```bash
cd ~/apps/AppRUI
./deploy.sh
```

Sin `git pull`:

```bash
./deploy.sh --no-pull
```

## Comprobar

```bash
pm2 status
pm2 logs rui-web
curl -I http://127.0.0.1:3847
curl -I https://rui.matubyte.com
```

## Archivos

| Archivo | Uso |
|---------|-----|
| `deploy.sh` | Build + PM2 + opción nginx |
| `ecosystem.config.cjs` | App PM2 `rui-web` |
| `deploy/nginx-rui.matubyte.com.conf` | Proxy nginx → :3847 |
| `.env` | `VITE_SITE_URL`, `VITE_API_BASE_URL` |

## SEO post-deploy

En Google Search Console, propiedad `https://rui.matubyte.com` y sitemap:

`https://rui.matubyte.com/sitemap-index.xml`
