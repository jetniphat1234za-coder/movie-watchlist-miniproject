import MovieRail from "@/app/components/MovieRail";
import { tmdbFetch, type TmdbMovie } from "@/app/lib/tmdb";

type ListResponse = { results: TmdbMovie[] };

function mergeUniquePages(pages: ListResponse[], limit: number) {
  const seen = new Set<number>();
  const out: TmdbMovie[] = [];
  for (const p of pages) {
    for (const m of p.results ?? []) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        out.push(m);
      }
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export default async function HomeRails({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  const [trending, topRated1, topRated2, topRated3, upcoming1, upcoming2, upcoming3] =
    await Promise.all([
      tmdbFetch<ListResponse>("/trending/movie/week"),
      tmdbFetch<ListResponse>("/movie/top_rated?page=1"),
      tmdbFetch<ListResponse>("/movie/top_rated?page=2"),
      tmdbFetch<ListResponse>("/movie/top_rated?page=3"),
      tmdbFetch<ListResponse>("/movie/upcoming?page=1"),
      tmdbFetch<ListResponse>("/movie/upcoming?page=2"),
      tmdbFetch<ListResponse>("/movie/upcoming?page=3"),
    ]);

  const topRated = mergeUniquePages([topRated1, topRated2, topRated3], 48);
  const upcoming = mergeUniquePages([upcoming1, upcoming2, upcoming3], 48);

  return (
    <div className="space-y-12">
      <MovieRail
        title="Trending"
        subtitle="What people are watching this week"
        movies={trending.results.slice(0, 24)}
      />
      <MovieRail
        title="Top Rated"
        subtitle="Critically-loved essentials"
        movies={topRated}
      />
      <MovieRail
        title="Upcoming"
        subtitle="Soon in theaters — plan ahead"
        movies={upcoming}
      />
    </div>
  );
}

