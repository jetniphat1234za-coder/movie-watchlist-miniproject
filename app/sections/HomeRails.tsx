import MovieRail from "@/app/components/MovieRail";
import { fetchPopularMovies, fetchTrendingMovies } from "@/app/lib/tmdb";

export default async function HomeRails({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  const [trending, popular] = await Promise.all([fetchTrendingMovies(1), fetchPopularMovies(1)]);

  return (
    <div className="space-y-12">
      <MovieRail
        title="Trending Now"
        subtitle="Today's biggest movies across TMDB"
        movies={trending.results.slice(0, 20)}
      />
      <MovieRail
        title="Popular Movies"
        subtitle="Audience favorites you can start tonight"
        movies={popular.results.slice(0, 20)}
      />
    </div>
  );
}

