"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";
import Section from "./Section";
import type { TmdbMovie } from "@/app/lib/tmdb";

export default function MovieSectionsClient({
  trendingMovies,
  popularMovies,
  topRatedMovies,
}: {
  trendingMovies: TmdbMovie[];
  popularMovies: TmdbMovie[];
  topRatedMovies: TmdbMovie[];
}) {
  const { t } = useLanguage();

  return (
    <div id="movie-sections" className="space-y-14 pt-2">
      <Section
        title={t("trending")}
        subtitle={t("trending_subtitle")}
        movies={trendingMovies}
      />
      <Section
        title={t("popular")}
        subtitle={t("popular_subtitle")}
        movies={popularMovies}
      />
      <Section
        title={t("top_rated")}
        subtitle={t("top_rated_subtitle")}
        movies={topRatedMovies}
      />
    </div>
  );
}
