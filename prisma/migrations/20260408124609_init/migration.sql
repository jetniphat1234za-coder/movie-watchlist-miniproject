-- CreateTable
CREATE TABLE "Watchlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "tmdbId" INTEGER,
    "imdbId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "posterPath" TEXT,
    "overview" TEXT,
    "tmdbRating" REAL,
    "genres" TEXT,
    "releaseDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
