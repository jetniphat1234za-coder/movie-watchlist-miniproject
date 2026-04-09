export default async function Home() {
  const apiKey = process.env.TMDB_API_KEY;
  const hasKey = Boolean(apiKey);

  return (
    <div className="space-y-12">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_20%_0%,rgba(99,102,241,0.28),transparent_55%),radial-gradient(900px_500px_at_90%_20%,rgba(236,72,153,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        <div className="relative p-6 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">
              curated • cinematic
            </p>
            <h1 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.02]">
              Discover films you'll actually remember.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70">
              Curated cinematic collections. Save titles to your watchlist in a single tap.
            </p>

            {/* Search Filter Component */}
            {hasKey && <SearchFilter />}
          </div>

          {!hasKey ? (
            <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-100 max-w-2xl">
              <p className="font-semibold">TMDB key missing</p>
              <p className="mt-1 text-sm text-amber-100/80">
                Set <span className="font-mono">TMDB_API_KEY</span> in <span className="font-mono">.env.local</span> to load rails.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Rails (server-rendered with loading.tsx skeletons) */}
      <HomeRails enabled={hasKey} />
    </div>
  );
}

import SearchFilter from './components/SearchFilter';
import HomeRails from "./sections/HomeRails";