# 🍽️ Reseñas Chanchas

App de reseñas personales de restaurantes para Mimi y Liqui.

## Stack
- **Next.js 14** (App Router) · **Prisma** · **PostgreSQL** · **NextAuth.js** · **Tailwind CSS**

---

## Deploy en Vercel

### 1. Base de datos PostgreSQL
Opciones gratis:
- **Neon**: https://neon.tech
- **Supabase**: https://supabase.com
- **Vercel Postgres**: desde el dashboard → Storage → Create Database

La connection string tiene este formato:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### 2. Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/resenas-chanchas.git
git push -u origin main
```

### 3. Deploy en Vercel
1. https://vercel.com → New Project → importar repo
2. Agregar estas **Environment Variables**:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Tu connection string de PostgreSQL |
| `NEXTAUTH_SECRET` | String aleatorio (https://generate-secret.vercel.app/32) |
| `NEXTAUTH_URL` | URL de tu app (ej: `https://resenas-chanchas.vercel.app`) |

3. Deploy!

### 4. Crear tablas y usuarios (una sola vez)
```bash
npm install
npx prisma db push
npm run db:seed
```

Esto crea los usuarios:
- **mimi** / `mimi123`
- **liqui** / `liqui123`

---

## Desarrollo local
```bash
npm install
# Crear .env.local con DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
npx prisma db push
npm run db:seed
npm run dev
```
