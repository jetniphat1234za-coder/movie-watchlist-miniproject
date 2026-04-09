"use client";

import { useState, Suspense, useCallback, useEffect } from "react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import AlertDialog from "@/app/components/AlertDialog";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[];
}

// Schema ของ Zod (ต้องเหมือนกับ Backend)
const formSchema = z.object({
  title: z.string().min(1, { message: "กรุณากรอกชื่อหนัง" }),
  rating: z.coerce
    .number()
    .int()
    .min(1)
    .max(10, { message: "คะแนนต้องอยู่ระหว่าง 1 ถึง 10" }),
  comment: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ดึงชื่อหนังจาก URL (ถ้ามี) มาใส่เป็นค่าเริ่มต้น
  const initialTitle = searchParams.get("title") || "";

  const [formData, setFormData] = useState<FormData>({ title: initialTitle, rating: 5, comment: "" });
  const [errors, setErrors] = useState<z.ZodFormattedError<FormData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  
  // TMDB Search states
  const [tmdbSearchQuery, setTmdbSearchQuery] = useState(initialTitle);
  const [tmdbResults, setTmdbResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTmdb, setSelectedTmdb] = useState<TMDBMovie | null>(null);

  // Search TMDB
  const searchTMDB = useCallback(async (query: string) => {
    if (!query.trim()) {
      setTmdbResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setTmdbResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setTmdbResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchTMDB(tmdbSearchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [tmdbSearchQuery, searchTMDB]);

  // Select TMDB movie
  const handleSelectMovie = (movie: TMDBMovie) => {
    setSelectedTmdb(movie);
    setFormData({ ...formData, title: movie.title });
    setTmdbResults([]);
    setTmdbSearchQuery(""); // Clear search field after selection
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    // 1. ตรวจสอบข้อมูลด้วย Zod (Frontend)
    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.format());
      setIsSubmitting(false);
      return;
    }

    // 2. ส่งข้อมูลไปที่ Backend API (include TMDB data)
    const res = await fetch("/api/watchlist-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validation.data,
        tmdbId: selectedTmdb?.id,
        posterPath: selectedTmdb?.poster_path,
        overview: selectedTmdb?.overview,
        tmdbRating: selectedTmdb?.vote_average,
        releaseDate: selectedTmdb?.release_date,
      }),
    });

    if (res.ok) {
      setAlertDialog({
        isOpen: true,
        type: "success",
        title: "บันทึกสำเร็จ!",
        message: "เพิ่มหนังลง My Watchlist เรียบร้อยแล้ว",
      });
      // Redirect after a brief delay
      setTimeout(() => {
        router.push("/my-list");
      }, 1500);
    } else {
      setAlertDialog({
        isOpen: true,
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: "ไม่สามารถบันทึกหนังได้ กรุณาลองใหม่",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-lg mx-auto rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-lg shadow-black/20 text-white">
      <h1 className="text-2xl font-semibold mb-6 text-center tracking-tight">เพิ่มหนังที่อยากดู</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TMDB Search */}
        <div className="space-y-2">
          <label className="block text-sm text-white/80 mb-1">ค้นหาหนัง (จาก TMDB)</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="พิมพ์ชื่อหนัง..."
              value={tmdbSearchQuery}
              onChange={(e) => setTmdbSearchQuery(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 text-white placeholdertext-white/50"
            />
            {isSearching && <div className="absolute right-3 top-3 text-white/50">🔍</div>}
          </div>

          {/* TMDB Results Dropdown */}
          {tmdbResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/10 rounded-xl shadow-lg overflow-hidden">
              {tmdbResults.map((movie) => (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => handleSelectMovie(movie)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-b-0 transition"
                >
                  <div className="flex gap-3">
                    {movie.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-8 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold line-clamp-1">{movie.title}</p>
                      <p className="text-xs text-white/50 flex items-center gap-2">
                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                        {movie.release_date && <span>{new Date(movie.release_date).getFullYear()}</span>}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Movie Info */}
          {selectedTmdb && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <div className="flex gap-3">
                {selectedTmdb.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${selectedTmdb.poster_path}`}
                    alt={selectedTmdb.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-indigo-200">{selectedTmdb.title}</p>
                  <p className="text-xs text-indigo-200/70">⭐ TMDB: {selectedTmdb.vote_average.toFixed(1)}/10</p>
                  <p className="text-xs text-indigo-200/70 line-clamp-2">{selectedTmdb.overview}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTmdb(null)}
                className="text-xs text-indigo-300 hover:text-indigo-200 underline"
              >
                × Clear selection
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">ชื่อหนัง *</label>
          <input 
            type="text" 
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 text-white"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors?.title?._errors?.[0] ? (
            <p className="text-red-300 text-sm mt-1">{errors.title._errors[0]}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">คะแนนความอยากดู (1-10) *</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              className="grow accent-indigo-400"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            />
            <span className="text-2xl font-bold w-12 text-right">{formData.rating}</span>
          </div>
          {errors?.rating?._errors?.[0] ? (
            <p className="text-red-300 text-sm mt-1">{errors.rating._errors[0]}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">ความรู้สึก / คอมเมนต์</label>
          <textarea 
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 text-white"
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="เช่น ต้องไปดูในโรงให้ได้!"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-indigo-500/90 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isSubmitting ? "กำลังบันทึก..." : "เก็บบันทึกข้อมูล"}
        </button>
      </form>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        type={alertDialog.type}
        title={alertDialog.title}
        message={alertDialog.message}
        onClose={() =>
          setAlertDialog({ ...alertDialog, isOpen: false })
        }
      />
    </div>
  );
}

export default function AddMovie() {
  return (
    <Suspense fallback={<div className="text-center text-white mt-10">กำลังโหลด...</div>}>
      <FormContent />
    </Suspense>
  );
}