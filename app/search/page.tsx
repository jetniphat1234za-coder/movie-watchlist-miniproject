'use client';

// Internationalization for search page
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function SearchPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'rating-high' | 'rating-low'>('rating-high');

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.results) {
          setResults(data.results);
        }
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'rating-high':
        return b.vote_average - a.vote_average;
      case 'rating-low':
        return a.vote_average - b.vote_average;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-semibold">
          {t("search_results")}
        </h1>
        <p className="text-white/70">
          {loading ? t("searching") : `${t("found_movies")} ${sortedResults.length} ${sortedResults.length === 1 ? t("movie_singular") : t("movie_plural")} "${query}"`}
        </p>
      </div>

      {/* Sort Controls */}
      {!loading && sortedResults.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-full px-4 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 transition cursor-pointer text-sm"
          >
            <option value="rating-high">{t("sort_rating_high")}</option>
            <option value="rating-low">{t("sort_rating_low")}</option>
            <option value="name">{t("sort_name")}</option>
          </select>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-white/50">
          <p>🔍 {t("searching")}</p>
        </div>
      ) : sortedResults.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-white/70">{t("no_movies_found")} "{query}"</p>
          <Link
            href="/"
            className="inline-block rounded-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
          >
            {t("try_another_search")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedResults.map((movie) => (
            <Link
              key={movie.id}
              href={`/add?title=${encodeURIComponent(movie.title)}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 hover:bg-white/8 transition h-full"
            >
              {/* Poster */}
              <div className="relative overflow-hidden rounded-t-xl bg-white/5 h-48">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    {t("no_image")}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold tracking-tight line-clamp-2 group-hover:text-indigo-300 transition">
                  {movie.title}
                </h3>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-100">⭐ {movie.vote_average.toFixed(1)}</span>
                  <span className="text-white/50 text-xs">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </span>
                </div>

                <p className="text-xs text-white/60 line-clamp-2">
                  {movie.overview || t("no_description")}
                </p>

                <div className="pt-2">
                  <span className="text-xs bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded-full">
                    {t("add_to_watchlist")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Back Link */}
      <div className="pt-4 border-t border-white/10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold transition group"
        >
          <span className="group-hover:-translate-x-1 transition">←</span>
          Back to Discover
        </Link>
      </div>
    </div>
  );
}
