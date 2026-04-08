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

