import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { z } from "zod";

const projectRoot = process.cwd();
const defaultDbUrl = `file:${projectRoot}/dev.db`;

const databaseUrl =
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL !== "undefined" &&
  process.env.DATABASE_URL.trim() !== ""
    ? process.env.DATABASE_URL
    : defaultDbUrl;

// Prisma client backed by SQLite via adapter (avoids the broken `datasources` constructor path).
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
});

const watchlistSchema = z.object({
  title: z.string().min(1, { message: "กรุณาใส่ชื่อหนัง" }),
  rating: z.coerce.number().int().min(1).max(10, { message: "คะแนนต้องอยู่ระหว่าง 1-10" }),
  comment: z.string().optional(),
  // TMDB fields
  tmdbId: z.number().int().optional().nullable(),
  posterPath: z.string().optional().nullable(),
  overview: z.string().optional().nullable(),
  tmdbRating: z.number().optional().nullable(),
  releaseDate: z.string().optional().nullable(),
  genres: z.string().optional().nullable(),
});

const idSchema = z.coerce.number().int().positive({ message: "ID ต้องเป็นตัวเลขบวก" });
const putSchema = watchlistSchema.extend({ id: idSchema });
const deleteSchema = z.object({ id: idSchema });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = watchlistSchema.parse(body);

    const newEntry = await prisma.watchlist.create({ 
      data: {
        title: validatedData.title,
        rating: validatedData.rating,
        comment: validatedData.comment,
        tmdbId: validatedData.tmdbId,
        posterPath: validatedData.posterPath,
        overview: validatedData.overview,
        tmdbRating: validatedData.tmdbRating,
        releaseDate: validatedData.releaseDate,
        genres: validatedData.genres,
      }
    });
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    console.error("POST /api/watchlist-v2 failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const list = await prisma.watchlist.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/watchlist-v2 failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = putSchema.parse(body);

    const updatedEntry = await prisma.watchlist.update({
      where: { id: validated.id },
      data: {
        title: validated.title,
        rating: validated.rating,
        comment: validated.comment,
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    console.error("PUT /api/watchlist-v2 failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const validated = deleteSchema.parse(body);

    await prisma.watchlist.delete({ where: { id: validated.id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/watchlist-v2 failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

