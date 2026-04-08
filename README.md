## Movie Watchlist (Next.js + TMDB + Prisma + SQLite)

Mini project: fetch trending movies from **TMDB** (external API) and let users save/manage their own watchlist via **Prisma ORM + SQLite**.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment variables

- **TMDB_API_KEY**: required to fetch trending movies on the home page.

Create `.env.local`:

```bash
TMDB_API_KEY="YOUR_TMDB_KEY"
```

### Database (Prisma + SQLite)

This project uses **SQLite** (`dev.db`) and **Prisma**.

- Prisma Client is generated automatically on install (`postinstall`).
- Generate manually if needed:

```bash
pnpm prisma generate
```

### Pages (3+)

- **`/`**: trending movies from TMDB (external API fetch)
- **`/add`**: add a movie manually (form + zod validation)
- **`/my-list`**: manage your watchlist (CRUD UI)

### API (CRUD)

The API route is in `app/api/watchlist/route.ts`:

- **GET**: list watchlist
- **POST**: create
- **PUT**: update
- **DELETE**: delete

### Validation (Frontend + Backend)

- **Frontend**: zod validation on all input forms
- **Backend**: zod validation in API route (`app/api/watchlist/route.ts`)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
