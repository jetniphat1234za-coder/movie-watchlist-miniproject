import Image from "next/image";
import { tmdbFetch, tmdbImage } from "@/app/lib/tmdb";
import TrailerModal from "@/app/movies/[id]/trailer-modal";
import AddToWatchlistButton from "@/app/movies/[id]/watchlist-button";
import CastRail from "@/app/movies/[id]/cast-rail";

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  runtime: number | null;
  release_date: string;
  genres: Array<{ id: number; name: string }>;
};

type Credits = {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
};

type Videos = {
  results: Array<{
    id: string;
    type: string;
    site: string;
    key: string;
    name: string;
  }>;
};

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [movie, credits, videos] = await Promise.all([
    tmdbFetch<MovieDetail>(`/movie/${id}`),
    tmdbFetch<Credits>(`/movie/${id}/credits`),
    tmdbFetch<Videos>(`/movie/${id}/videos`),
  ]);

  const trailer = videos.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const backdrop = tmdbImage(movie.backdrop_path, "original");
  const poster = tmdbImage(movie.poster_path, "w500");

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        {backdrop ? (
          <div className="absolute inset-0">
            <Image
              src={backdrop}
              alt={movie.title}
              fill
              priority
              className="object-cover opacity-90 scale-[1.02]"
            />
          </div>
        ) : null}

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_20%_10%,rgba(99,102,241,0.22),transparent_60%)]" />

        <div className="relative p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="relative aspect-2/3 w-[220px] sm:w-[260px] lg:w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-2xl shadow-black/40">
              {poster ? (
                <Image
                  src={poster}
                  alt={movie.title}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-sm text-white/60">
                  No poster
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                  film detail
                </p>
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
                  {movie.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  ★ {movie.vote_average.toFixed(1)}
                </span>
                {movie.runtime ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {movie.runtime}m
                  </span>
                ) : null}
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {new Date(movie.release_date).getFullYear()}
                </span>
                {movie.genres.slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/7 backdrop-blur p-5 shadow-lg shadow-black/30">
                <p className="text-sm leading-relaxed text-white/75">
                  {movie.overview || "No overview available."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <AddToWatchlistButton title={movie.title} />
                  {trailer ? <TrailerModal youtubeKey={trailer.key} /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CastRail cast={credits.cast.slice(0, 18)} />
    </div>
  );
}

