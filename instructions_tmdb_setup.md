# TMDB Setup (Next.js)

1. Create or update `.env.local` in the project root:

```bash
TMDB_API_KEY="your_tmdb_v3_api_key"
```

2. Restart your dev server so env vars reload:

```bash
pnpm dev
```

3. Verify:
- Open the homepage.
- If the key is valid, TMDB sections load.
- If missing, the homepage shows a warning card.

4. Security:
- Keep `.env.local` uncommitted.
- Do not expose `TMDB_API_KEY` in client-side code or public repos.

