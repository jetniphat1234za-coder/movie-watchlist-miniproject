"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";
import MovieRail from "@/app/components/MovieRail";
import type { TmdbMovie } from "@/app/lib/tmdb";

export default function HomeRailsClient({
  trendingMovies,
  popularMovies,
}: {
  trendingMovies: TmdbMovie[];
  popularMovies: TmdbMovie[];
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-12">
      <MovieRail
        title={t("trending_now")}
        subtitle={t("trending_now_subtitle")}
        movies={trendingMovies}
      />
      <MovieRail
        title={t("popular_movies")}
        subtitle={t("popular_movies_subtitle")}
        movies={popularMovies}
      />
    </div>
  );
}
