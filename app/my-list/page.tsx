"use client";

import { useEffect, useState } from "react";
import type { Watchlist } from "@prisma/client";
import EditMovieModal from "@/app/components/EditMovieModal";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function MyList() {
  const [movies, setMovies] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState<Watchlist | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ดึงข้อมูลหนังจาก API
  const fetchMovies = async () => {
    try {
      setLoadError(null);
      const res = await fetch("/api/watchlist-v2");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setMovies(data);
    } catch (_error) {
      console.error("Failed to fetch movies:", _error);
      setLoadError("โหลดรายการหนังไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // เปิด Modal สำหรับแก้ไข
  const handleEditClick = (movie: Watchlist) => {
    setEditingMovie(movie);
    setIsEditModalOpen(true);
  };

  // ลบหนัง
  const handleDelete = async (id: number) => {
    if (confirm("คุณแน่ใจหรือว่าต้องการลบหนังเรื่องนี้?")) {
      try {
        const res = await fetch("/api/watchlist-v2", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          setMovies(movies.filter((m) => m.id !== id));
        } else {
          alert("เกิดข้อผิดพลาดในการลบ");
        }
      } catch {
        alert("เกิดข้อผิดพลาด");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-10 shadow-lg shadow-black/20">
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">
              saved collection
            </p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight">
              Watchlist
            </h1>
            <p className="mt-3 text-white/70 max-w-xl">
              Keep a short list. Make it intentional. Edit notes, refine taste.
            </p>
          </div>
          <Link
            href="/"
            className="relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold bg-white text-black hover:bg-white/90 transition shadow-sm shadow-black/30"
          >
            + เพิ่มจากหน้าแรก
          </Link>
        </div>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-100">
          <p className="font-semibold">มีปัญหาในการโหลด</p>
          <p className="mt-1 text-sm text-red-100/80">{loadError}</p>
          <button
            className="mt-4 rounded-full px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 border border-white/10 transition"
            onClick={() => {
              setLoading(true);
              fetchMovies();
            }}
          >
            ลองใหม่
          </button>
        </div>
      ) : null}

      {movies.length === 0 ? (
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-8 sm:p-12 shadow-lg shadow-black/20">
          <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_50%_-10%,rgba(236,72,153,0.12),transparent_60%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                empty state
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
                Nothing saved yet.
              </h2>
              <p className="mt-3 text-white/70 max-w-xl">
                Start with one film you genuinely want to watch. Keep the list short and meaningful.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="rounded-full px-4 py-2 text-sm font-semibold bg-white text-black hover:bg-white/90 transition shadow-sm shadow-black/30"
                  href="/"
                >
                  Browse films
                </Link>
                <Link
                  className="rounded-full px-4 py-2 text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
                  href="/add"
                >
                  Add manually
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-2/3 rounded-2xl border border-white/10 bg-white/5"
                    style={{ opacity: 0.7 - i * 0.08 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/60">
              {movies.length} saved
            </p>
            <p className="text-xs text-white/50">Tip: edit notes to remember why.</p>
          </div>

          <motion.div layout className="space-y-3">
            <AnimatePresence initial={false}>
              {movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 hover:bg-white/8 transition"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(900px_240px_at_20%_0%,rgba(99,102,241,0.12),transparent_60%)]" />
                  <div className="relative p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-semibold tracking-tight line-clamp-1">
                          {movie.title}
                        </h3>
                        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-100">
                          ★ {movie.rating}/10
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/70 line-clamp-2">
                        {movie.comment ? `"${movie.comment}"` : "No note yet — add one to remember the vibe."}
                      </p>
                      <p className="mt-2 text-xs text-white/45">
                        Saved {new Date(movie.createdAt).toLocaleDateString("en-US")}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleEditClick(movie)}
                        className="rounded-full px-4 py-2 text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="rounded-full px-4 py-2 text-sm font-semibold bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-100 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingMovie ? (
        <EditMovieModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingMovie(null);
          }}
          onSuccess={fetchMovies}
          movie={editingMovie}
        />
      ) : null}
    </div>
  );
}