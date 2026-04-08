"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { tmdbImage } from "@/app/lib/tmdb";

export default function CastRail({
  cast,
}: {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Cast</h2>
          <p className="mt-1 text-sm text-white/60">People behind the scenes</p>
        </div>
      </div>

      <div className="relative -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {cast.map((c, idx) => {
            const img = tmdbImage(c.profile_path, "w500");
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(0.16, idx * 0.02) }}
                className="shrink-0 w-[160px]"
              >
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <div className="relative aspect-3/4">
                    {img ? (
                      <Image
                        src={img}
                        alt={c.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-xs text-white/60">
                        No photo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold leading-snug line-clamp-1">
                      {c.name}
                    </div>
                    <div className="mt-1 text-xs text-white/60 line-clamp-2">
                      {c.character}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

