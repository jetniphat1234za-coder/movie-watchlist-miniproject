"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { TmdbMovie } from "@/app/lib/tmdb";
import MovieCard from "@/app/components/MovieCard";
import SearchFilter from "@/app/components/SearchFilter";

type CategorySection = {
  key: string;
  label: string;
  accent: string;
  description: string;
  movies: TmdbMovie[];
};

export default function CinematicJourneyHome({
  featured,
  categories,
  showSearch = true,
}: {
  featured?: TmdbMovie;
  categories: CategorySection[];
  showSearch?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 95, damping: 24 });

  const reelY = useTransform(smoothProgress, [0, 1], ["8vh", "84vh"]);
  const reelRotate = useTransform(smoothProgress, [0, 1], [0, 405]);

  const heroScale = useTransform(smoothProgress, [0, 0.2], [1.02, 1]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0.88]);
  const heroBackdropY = useTransform(smoothProgress, [0, 0.45], [0, -70]);

  return (
    <div ref={rootRef} className="relative space-y-20 pb-24">
      <motion.div
        className="pointer-events-none fixed right-6 top-0 z-20 hidden sm:block"
        style={{ y: reelY, rotate: reelRotate }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/45 text-white/85 shadow-xl shadow-black/40 backdrop-blur">
          <span className="text-sm">🎞️</span>
        </div>
      </motion.div>

      <section className="relative min-h-[78vh] overflow-hidden rounded-[32px] border border-white/10">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            y: heroBackdropY,
            backgroundImage: featured?.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`
              : "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.36), transparent 55%), radial-gradient(circle at 85% 20%, rgba(244,114,182,0.26), transparent 60%)",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-20"
          style={{
            backgroundImage: featured?.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`
              : undefined,
          }}
          animate={{
            scale: [1.04, 1.12, 1.06],
            x: [0, -24, 16, 0],
            y: [0, -14, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 opacity-45"
          style={{
            background:
              "radial-gradient(circle at 20% 15%, rgba(99,102,241,0.45), transparent 45%), radial-gradient(circle at 78% 22%, rgba(244,114,182,0.35), transparent 50%), radial-gradient(circle at 52% 88%, rgba(56,189,248,0.3), transparent 55%)",
          }}
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.35, 0.55, 0.38],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 animate-film-grain opacity-[0.14]" />
        <div className="absolute inset-0 animate-light-sweep opacity-[0.2]" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        <div className="relative flex min-h-[78vh] items-end p-6 sm:p-10">
          <div className="max-w-3xl space-y-5">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-xs uppercase tracking-[0.34em] text-white/70"
            >
              Cinematic Journey
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl"
            >
              Travel through worlds of Action, Romance, Horror, and Sci-Fi.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="max-w-2xl text-base text-white/75 sm:text-lg"
            >
              Scroll down and the experience morphs scene by scene with reactive backgrounds, immersive transitions, and curated TMDB selections.
            </motion.p>
            {showSearch ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="max-w-2xl"
              >
                <SearchFilter />
              </motion.div>
            ) : null}
            <motion.a
              href="#journey-sections"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/15"
            >
              <span>✨</span>
              Start the journey
            </motion.a>
          </div>
        </div>
      </section>

      <div id="journey-sections" className="space-y-16">
        {categories.map((section) => (
          <CategoryScene key={section.key} section={section} />
        ))}
      </div>
    </div>
  );
}

function CategoryScene({ section }: { section: CategorySection }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.25, once: false });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 85%", "end 20%"] });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.62, 0.2]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [32, -32]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] p-5 sm:p-8">
      <motion.div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${section.accent}`}
        style={{ opacity: bgOpacity, y: parallaxY }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.65, y: 16 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative mb-7 flex flex-col gap-3"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/65">Scene</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{section.label}</h2>
        <p className="max-w-2xl text-sm text-white/75 sm:text-base">{section.description}</p>
      </motion.div>

      <div className="relative grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {section.movies.slice(0, 10).map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.72, y: 18, scale: 0.99 }}
            transition={{ duration: 0.4, delay: index * 0.045, ease: "easeOut" }}
          >
            <MovieCard
              id={movie.id}
              title={movie.title ?? movie.name ?? "Untitled"}
              overview={movie.overview ?? ""}
              poster_path={movie.poster_path ?? null}
              release_date={movie.release_date}
              vote_average={movie.vote_average}
              accentClassName={section.accent}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
