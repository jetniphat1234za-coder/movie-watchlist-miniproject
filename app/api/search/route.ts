import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/app/lib/tmdb";

type SearchMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  tmdb_id: number;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const limitParam = searchParams.get("limit");

  if (!query || query.trim() === "") {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const limit = Number(limitParam ?? "20");
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 20)) : 20;

  try {
    const data = await searchMovies(query.trim(), 1);

    const movies: SearchMovie[] = data.results
      .filter((movie) => movie.title && movie.id)
      .map((movie) => ({
        id: movie.id,
        title: movie.title ?? "",
        poster_path: movie.poster_path ?? null,
        overview: movie.overview ?? "",
        release_date: movie.release_date ?? "",
        vote_average: movie.vote_average ?? 0,
        tmdb_id: movie.id,
      }))
      .slice(0, safeLimit);

    return NextResponse.json({ results: movies });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}
