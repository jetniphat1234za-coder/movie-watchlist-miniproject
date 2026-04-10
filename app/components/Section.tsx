"use client";

import { motion } from "framer-motion";
import type { TmdbMovie } from "@/app/lib/tmdb";
import MovieCard from "@/app/components/MovieCard";

export default function Section({
  title,
  subtitle,
  movies,
}: {
  title: string;
  subtitle: string;
  movies: TmdbMovie[];
}) {
  return (
    <section className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/60">{title}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{subtitle}</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
          >
            <MovieCard
              id={movie.id}
              title={movie.title ?? movie.name ?? "Untitled"}
              overview={movie.overview ?? ""}
              poster_path={movie.poster_path ?? null}
              release_date={movie.release_date}
              vote_average={movie.vote_average}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
