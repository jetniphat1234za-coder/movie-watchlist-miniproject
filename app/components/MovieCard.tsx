"use client";

import Image from "next/image";
import { useState } from "react";
import AddMovieModal from "./AddMovieModal.tsx";

interface MovieCardProps {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
}

export default function MovieCard({
  id,
  title,
  overview,
  poster_path,
}: MovieCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="rounded-lg overflow-hidden flex flex-col shadow-md">
        {/* ดึงรูปโปสเตอร์จาก TMDB */}
        <div className="relative w-full h-100">
          {poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              ไม่มีรูปภาพ
            </div>
          )}
        </div>

        <div className="p-4 grow flex flex-col">
          <h2 className="text-lg font-bold mb-1 line-clamp-2">{title}</h2>
          {/* TMDB มี overview หรือเรื่องย่อให้ด้วย */}
          <p className="text-sm mb-4 line-clamp-3">
            {overview || "ไม่มีคำอธิบาย"}
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-auto font-semibold px-4 py-2 rounded transition w-full shadow-sm"
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
