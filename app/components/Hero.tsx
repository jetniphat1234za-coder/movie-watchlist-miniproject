"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import SearchFilter from "@/app/components/SearchFilter";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const { t } = useLanguage();

  const y = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden rounded-[32px] border border-white/10">
      <motion.video
        className="absolute inset-0 h-full w-full object-cover contrast-110 saturate-105"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ y }}
      >
        <source src="/videos/hero-cinematic.mp4" type="video/mp4" />
      </motion.video>

      <div className="absolute inset-0 bg-linear-to-t from-black/82 via-black/48 to-black/22" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_0%,rgba(255,196,120,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_100%,rgba(99,102,241,0.14),transparent_60%)]" />
      <div className="absolute inset-0 animate-film-grain opacity-[0.06]" />

      <motion.div
        style={{ y: titleY, opacity }}
        className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 text-center"
      >
        <div className="w-full rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-9">
          <p className="text-xs uppercase tracking-[0.32em] text-white/70">{t("featured_tonight")}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {t("hero_title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
            {t("hero_subtitle")}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#movie-sections"
              className="rounded-full border border-white/20 bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              {t("explore")}
            </Link>
            <Link
              href="/my-list"
              className="rounded-full border border-indigo-300/40 bg-indigo-400/20 px-6 py-3 text-sm font-semibold text-indigo-100 backdrop-blur transition hover:bg-indigo-400/30"
            >
              {t("watchlist")}
            </Link>
          </div>

          <div className="mt-6 text-left">
            <SearchFilter />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
