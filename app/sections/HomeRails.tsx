import HomeRailsClient from "./HomeRailsClient";
import { fetchPopularMovies, fetchTrendingMovies } from "@/app/lib/tmdb";

export default async function HomeRails({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  const [trending, popular] = await Promise.all([fetchTrendingMovies(1), fetchPopularMovies(1)]);

  return (
    <HomeRailsClient
      trendingMovies={trending.results.slice(0, 20)}
      popularMovies={popular.results.slice(0, 20)}
    />
  );
}

