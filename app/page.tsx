import CinematicIntro from "./components/CinematicIntro";
import Hero from "./components/Hero";
import MovieSectionsClient from "./components/MovieSectionsClient";
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies } from "./lib/tmdb";

export default async function Home() {
  const apiKey = process.env.TMDB_API_KEY;
  const hasKey = Boolean(apiKey);

  if (!hasKey) {
    return (
      <div className="space-y-8">
        <CinematicIntro />
        <section className="rounded-3xl border border-amber-400/25 bg-amber-400/10 p-8">
          <h1 className="text-3xl font-semibold">TMDB key missing</h1>
          <p className="mt-3 text-amber-100/90">
            Set <span className="font-mono">TMDB_API_KEY</span> in <span className="font-mono">.env.local</span> and restart the server.
          </p>
        </section>
      </div>
    );
  }

  const [trending, popular, topRated] = await Promise.all([
    fetchTrendingMovies(1),
    fetchPopularMovies(1),
    fetchTopRatedMovies(1),
  ]);

  return (
    <div className="space-y-8">
      <CinematicIntro />
      <Hero />

      <MovieSectionsClient
        trendingMovies={trending.results.slice(0, 10)}
        popularMovies={popular.results.slice(0, 10)}
        topRatedMovies={topRated.results.slice(0, 10)}
      />
    </div>
  );
}