# TourMate

Full-stack tour booking platform for Bangladesh.

| Folder     | Stack                          | Port (local) |
|------------|--------------------------------|--------------|
| `frontend` | Next.js 14, Tailwind, TanStack Query | 3000         |
| `backend`  | Express 5, Prisma 7, PostgreSQL      | 5000         |

## Local development

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Push to GitHub

1. Initialize git (if not already):

   ```bash
   git init
   git add .
   git commit -m "Initial TourMate monorepo"
   ```

2. Create a new repository on GitHub (e.g. `TourMate`).

3. Push:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/TourMate.git
   git branch -M main
   git push -u origin main
   ```

**Never commit** `.env`, `.env.local`, or any file with real secrets. Example files (`.env.example`) are safe to commit.

---

## Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo.

2. **Root Directory:** set to `frontend`.

3. Framework should auto-detect **Next.js**.

4. **Environment variables:**

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend.vercel.app/api` |

5. Deploy. Your site will be at `https://your-project.vercel.app`.

> **Tip:** Deploy the backend first so you have the API URL for this step.

---

## Deploy backend on Vercel

1. Create a **second** Vercel project from the same repo.

2. **Root Directory:** set to `backend`.

3. **Environment variables:**

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | PostgreSQL connection string (Supabase pooler recommended) |
   | `JWT_SECRET` | Long random secret string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` |
   | `PORT` | `5000` (optional on Vercel) |

4. Add a **Build Command** (Project Settings → Build):

   ```bash
   npm install && npx prisma generate
   ```

5. Deploy. API base URL: `https://your-backend.vercel.app/api`.

---

## Deploy backend on Render (alternative)

1. [render.com](https://render.com) → **New Web Service** → connect GitHub repo.

2. **Root Directory:** `backend`.

3. **Build command:**

   ```bash
   npm install && npx prisma generate && npm run build
   ```

4. **Start command:**

   ```bash
   npm start
   ```

5. Add the same environment variables as the Vercel backend table above.

6. Use your Render URL in the frontend `NEXT_PUBLIC_API_URL`.

---

## Troubleshooting

### `EADDRINUSE` (port already in use)

Another process is using port 3000 or 5000.

```bash
# Windows – find PID on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart
cd frontend && npm run dev
```

### `Cannot find module './682.js'` (Next.js chunk error)

Corrupted `.next` cache after UI changes. Clear and restart:

```bash
cd frontend
npm run clean
npm run dev
```

Or use the combined script:

```bash
cd frontend
npm run dev:clean
```

If it persists:

```bash
cd frontend
rimraf node_modules .next
npm install
npm run dev:clean
```

---

## Project structure

```
TourMate/
├── frontend/          # Next.js app (deploy to Vercel)
│   ├── app/
│   ├── components/
│   ├── vercel.json
│   └── .env.example
├── backend/           # Express API (Vercel or Render)
│   ├── src/
│   ├── prisma/
│   ├── vercel.json
│   └── .env.example
├── vercel.json        # Monorepo hint (prefer Root Directory in dashboard)
└── README.md
```
