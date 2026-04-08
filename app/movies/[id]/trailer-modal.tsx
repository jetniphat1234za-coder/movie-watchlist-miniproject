"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AnimatedButton from "@/app/components/ui/AnimatedButton";

export default function TrailerModal({ youtubeKey }: { youtubeKey: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatedButton tone="ghost" onClick={() => setOpen(true)}>
        Watch trailer
      </AnimatedButton>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <div className="absolute inset-0 grid place-items-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.2, 0.9, 0.2, 1] }}
                className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-2xl shadow-black/60"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div className="text-sm font-semibold text-white/85">Trailer</div>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-white/80 transition"
                  >
                    Close
                  </button>
                </div>
                <div className="relative aspect-video">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

