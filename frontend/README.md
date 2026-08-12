# TourMate Frontend

Next.js 14 App Router client for the TourMate travel booking platform. Connects to the Express API in `../backend`.

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:5000` (see `../backend/README.md` or root README)

## Setup

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Environment variables**

   Copy the example env file and adjust if your API runs on a different host or port:

   ```bash
   cp .env.local.example .env.local
   ```

   Required variable:

   | Variable | Description |
   |----------|-------------|
   | `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost:5000/api`) |

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server on port 3000 |
| `npm run lint` | Run ESLint |

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query** — server state, caching, and cache invalidation after mutations
- **Axios** — API client with JWT from `localStorage`
- **Sonner** — success/error toasts
- **Lucide React** — icons

## Project structure

```
frontend/
├── app/                    # Routes (App Router)
│   ├── (auth)/             # Login, register
│   ├── (dashboard)/        # User & admin dashboards
│   ├── packages/           # Browse & detail pages
│   └── page.tsx            # Home
├── components/
│   ├── dashboard/          # Sidebar, review modal
│   ├── home/               # Home page sections
│   ├── layout/             # Navbar, footer
│   └── shared/             # Skeleton, EmptyState, Pagination, cards
├── context/                # AuthContext
├── hooks/                  # useQueryToastError
└── lib/
    ├── api/                # API helpers
    ├── axios.ts            # Axios instance
    └── utils/              # Shared utilities
```

## Key routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home, search, categories, featured tours |
| `/packages` | Public | Filterable package list with pagination |
| `/packages/[id]` | Public | Package detail, booking, reviews |
| `/login`, `/register` | Public | Authentication |
| `/dashboard/bookings` | USER | My bookings |
| `/admin/categories` | ADMIN | Manage categories |
| `/admin/packages` | ADMIN | Manage tour packages |
| `/admin/bookings` | ADMIN | Manage all bookings |

## Data fetching

All API reads use **TanStack Query** (`useQuery`). Writes use **mutations** (`useMutation`) with `queryClient.invalidateQueries()` so lists and detail views refresh after create, update, or delete.

User feedback uses **Sonner** toasts for success and error states.

## Troubleshooting

- **API errors / empty data** — Ensure the backend is running and `NEXT_PUBLIC_API_URL` in `.env.local` matches it.
- **Auth issues** — Clear `localStorage` (`accessToken`, `user`) and log in again.
- **Port in use** — Stop any process on port 3000 or change the port in `package.json` scripts.
