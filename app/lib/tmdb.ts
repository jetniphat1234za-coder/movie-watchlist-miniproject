export type TmdbMovie = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
};

export type TmdbListResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export const CINEMATIC_GENRES = [
  { key: "action", label: "Action", genreId: 28, accent: "from-rose-500/70 to-orange-400/60" },
  { key: "romance", label: "Romance", genreId: 10749, accent: "from-fuchsia-500/70 to-pink-400/60" },
  { key: "horror", label: "Horror", genreId: 27, accent: "from-red-700/75 to-violet-700/65" },
  { key: "sci-fi", label: "Sci-Fi", genreId: 878, accent: "from-cyan-400/70 to-indigo-500/65" },
] as const;

export function tmdbImage(path: string | null | undefined, size: "w500" | "w780" | "original" = "w780") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function tmdbFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is missing");
  }
  const url = `https://api.themoviedb.org/3${path}${path.includes("?") ? "&" : "?"}api_key=${apiKey}&language=en-US`;
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`TMDB HTTP ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchPopularMovies(page = 1) {
  return tmdbFetch<TmdbListResponse>(`/movie/popular?page=${page}`);
}

export async function fetchTrendingMovies(page = 1) {
  return tmdbFetch<TmdbListResponse>(`/trending/movie/day?page=${page}`);
}

export async function fetchTopRatedMovies(page = 1) {
  return tmdbFetch<TmdbListResponse>(`/movie/top_rated?page=${page}`);
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<TmdbListResponse>(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
}

export async function fetchMoviesByGenre(genreId: number, page = 1) {
  return tmdbFetch<TmdbListResponse>(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}&include_adult=false`
  );
}

