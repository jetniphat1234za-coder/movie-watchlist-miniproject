'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';

type SuggestionMovie = {
  id: number;
  title: string;
  release_date?: string;
};

export default function SearchFilter() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionMovie[]>([]);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      setOpenSuggestions(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=6`);
        const data = (await res.json()) as { results?: SuggestionMovie[] };
        setSuggestions(data.results ?? []);
        setOpenSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setOpenSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const selectSuggestion = (title: string) => {
    setSearchQuery(title);
    setOpenSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(title)}`);
  };

  return (
    <div className="space-y-4 mt-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={`🔍 ${t("search_placeholder")}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setOpenSuggestions(suggestions.length > 0)}
            onBlur={() => window.setTimeout(() => setOpenSuggestions(false), 150)}
            className="w-full rounded-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 transition"
            aria-label="Search movies"
          />

          {openSuggestions ? (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-xl shadow-black/40 backdrop-blur">
              {isLoading ? (
                <p className="px-4 py-3 text-sm text-white/60">Searching...</p>
              ) : suggestions.length === 0 ? (
                <p className="px-4 py-3 text-sm text-white/60">No quick matches</p>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {suggestions.map((movie) => (
                    <li key={movie.id}>
                      <button
                        type="button"
                        onMouseDown={() => selectSuggestion(movie.title)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                      >
                        <span className="text-sm text-white">{movie.title}</span>
                        <span className="text-xs text-white/50">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          className="rounded-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition shadow-sm shadow-indigo-500/20 sm:w-auto"
        >
          Search
        </button>
      </form>
      
      <p className="text-sm text-white/50">
        💡 Tip: Search by movie name, or go to your <Link href="/my-list" className="text-indigo-300 hover:text-indigo-200 underline">Watchlist</Link> to filter saved movies
      </p>
    </div>
  );
}
