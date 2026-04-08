"use client";

import Image from "next/image";
import { useState } from "react";
import AddMovieModal from "./AddMovieModal";

interface MovieCardProps {
  title: string;
  overview: string;
  poster_path: string | null;
}

export default function MovieCard({
  title,
  overview,
  poster_path,
}: MovieCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="group rounded-2xl overflow-hidden flex flex-col border border-white/10 bg-white/5 shadow-lg shadow-black/20 hover:bg-white/8 transition duration-300 hover:-translate-y-1 hover:shadow-black/30 animate-fade-up">
        {/* ดึงรูปโปสเตอร์จาก TMDB */}
        <div className="relative w-full h-[420px]">
          {poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/60">
              ไม่มีรูปภาพ
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-90" />
        </div>

        <div className="p-4 grow flex flex-col">
          <h2 className="text-lg font-semibold mb-1 line-clamp-2 tracking-tight">
            {title}
          </h2>
          {/* TMDB มี overview หรือเรื่องย่อให้ด้วย */}
          <p className="text-sm mb-4 line-clamp-3 text-white/70">
            {overview || "ไม่มีคำอธิบาย"}
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-auto inline-flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-xl transition w-full bg-indigo-500/90 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
          >
            + เพิ่มลง My Watchlist
          </button>
        </div>
      </div>

      {/* Modal สำหรับเพิ่มรีวิว */}
      <AddMovieModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialTitle={title}
      />
    </>
  );
}
