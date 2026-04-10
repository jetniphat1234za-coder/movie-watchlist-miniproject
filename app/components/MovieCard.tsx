"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import AddMovieModal from "./AddMovieModal";
import { tmdbImage } from "@/app/lib/tmdb";

interface MovieCardProps {
  id?: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  href?: string;
  showAddButton?: boolean;
  accentClassName?: string;
}

export default function MovieCard({
  id,
  title,
  overview,
  poster_path,
  release_date,
  vote_average,
  href,
  showAddButton = false,
  accentClassName = "from-indigo-500/40 to-fuchsia-500/30",
}: MovieCardProps) {
  const [showModal, setShowModal] = useState(false);
  const movieHref = href ?? (id ? `/movies/${id}` : "#");

  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="animate-fade-up"
      >
        <Link
          href={movieHref}
          className="group block overflow-hidden rounded-2xl border border-white/12 bg-white/[0.045] shadow-lg shadow-black/25 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-indigo-300/35 hover:shadow-indigo-500/20"
        >
          <div className={`pointer-events-none absolute inset-0 bg-linear-to-br opacity-0 blur-2xl transition group-hover:opacity-100 ${accentClassName}`} />
          <div className="relative w-full h-[340px] sm:h-[380px] lg:h-[420px]">
            {poster_path ? (
              <Image
                src={tmdbImage(poster_path, "w500") ?? ""}
                alt={title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
                className="object-cover transition duration-500 group-hover:scale-[1.06]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/60">
                No poster
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-90" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs text-white/80">
                Open details
              </div>
            </div>
          </div>

          <div className="relative p-4">
            <h2 className="text-base font-semibold tracking-tight line-clamp-2 sm:text-lg">{title}</h2>
            <p className="mt-2 text-sm text-white/70 line-clamp-3">{overview || "No description."}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-white/60">
              <span>{release_date ? new Date(release_date).getFullYear() : "N/A"}</span>
              <span>{typeof vote_average === "number" ? `★ ${vote_average.toFixed(1)}` : "★ -"}</span>
            </div>

            {showAddButton ? (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setShowModal(true);
                }}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-indigo-500/90 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
              >
                + Add to My Watchlist
              </button>
            ) : null}
          </div>
        </Link>
      </motion.div>

      {showAddButton ? (
        <AddMovieModal isOpen={showModal} onClose={() => setShowModal(false)} initialTitle={title} />
      ) : null}
    </>
  );
}
