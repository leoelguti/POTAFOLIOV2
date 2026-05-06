# Portafolio · Leonardo Gutierrez

Portafolio personal full-stack — frontend React + Vite, backend Express + Supabase.

## Stack

- **Client**: React 19, Vite 8, vanilla CSS (custom design system, WebGL aurora shader, custom cursor)
- **Server**: Express 4, Helmet, CORS, rate-limit, Supabase JS, Resend (correo de contacto)

## Estructura

```
client/   — frontend Vite (deploy en Vercel)
server/   — API Express (deploy en Render/Fly/Railway)
```

## Desarrollo

### Cliente

```bash
cd client
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
```

### Servidor

```bash
cd server
npm install
cp .env.example .env   # configurar SUPABASE_URL, SUPABASE_KEY, RESEND_API_KEY, CLIENT_URL
npm run dev
```

## Variables de entorno

### Cliente (`client/.env`)

```
VITE_API_URL=http://localhost:3001/api
```

### Servidor (`server/.env`)

```
PORT=3001
CLIENT_URL=http://localhost:5173
SUPABASE_URL=...
SUPABASE_KEY=...
RESEND_API_KEY=...
CONTACT_EMAIL=...
```

## Deploy

- **Cliente**: Vercel — `vercel.json` ya configurado para SPA routing.
- **Servidor**: cualquier host Node 20+. El cliente cae a datos estáticos (`constants.js`) si la API no está disponible.

## Pendientes / TODO

- [ ] Reemplazar URLs sociales placeholder en `client/src/utils/constants.js`
- [ ] Subir proyectos reales (con repos + screenshots) a `PROJECTS`
- [ ] Subir CV a `client/public/cv.pdf`
- [ ] Generar `og-image.png` 1200×630 en `client/public/`
- [ ] Reemplazar `leonardogutierrez.dev` con dominio real en `index.html` y `sitemap.xml`

## Licencia

MIT
