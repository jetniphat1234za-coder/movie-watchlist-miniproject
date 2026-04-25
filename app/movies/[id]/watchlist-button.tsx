"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type MovieWatchlistPayload = {
  title: string;
  tmdbId: number;
  posterPath?: string | null;
  overview?: string | null;
  tmdbRating?: number | null;
  releaseDate?: string | null;
  genres?: string | null;
};

export default function AddToWatchlistButton({ movie }: { movie: MovieWatchlistPayload }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const onAdd = async () => {
    if (state === "saving" || state === "saved") return;
    setState("saving");
    try {
      const res = await fetch("/api/watchlist-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: movie.title,
          rating,
          comment,
          tmdbId: movie.tmdbId,
          posterPath: movie.posterPath ?? null,
          overview: movie.overview ?? null,
          tmdbRating: movie.tmdbRating ?? null,
          releaseDate: movie.releaseDate ?? null,
          genres: movie.genres ?? null,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setState("saved");
      setIsFormOpen(false);
      setTimeout(() => setState("idle"), 1200);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 1400);
    }
  };

  const label =
    state === "saving"
      ? "Saving..."
      : state === "saved"
      ? "Added"
      : state === "error"
      ? "Try again"
      : "Add to Watchlist";

  return (
    <>
      <motion.button
        onClick={() => setIsFormOpen((prev) => !prev)}
        whileTap={{ scale: 0.98 }}
        className={[
          "relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          state === "saved"
            ? "bg-emerald-400/15 border border-emerald-400/25 text-emerald-100"
            : "bg-white text-black hover:bg-white/90 shadow-sm shadow-black/30",
        ].join(" ")}
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {label}
        </span>
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 bg-[radial-gradient(420px_160px_at_20%_0%,rgba(99,102,241,0.25),transparent_60%)]" />
      </motion.button>

      {isFormOpen ? (
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4 space-y-3">
          <div>
            <label className="block mb-1 text-sm text-white/80">Rating (1-10)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="grow accent-indigo-400"
              />
              <span className="w-8 text-right font-semibold">{rating}</span>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm text-white/80">Comment (optional)</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Add your note..."
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onAdd}
              disabled={state === "saving"}
              className="rounded-full px-4 py-2 text-sm font-semibold bg-indigo-500/90 hover:bg-indigo-500 disabled:opacity-60 text-white"
            >
              {state === "saving" ? "Saving..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-full px-4 py-2 text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

