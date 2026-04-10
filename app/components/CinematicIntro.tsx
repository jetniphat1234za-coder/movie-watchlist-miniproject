"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_SESSION_KEY = "mw2:intro-seen";
const INTRO_DURATION_MS = 2400;

export default function CinematicIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_SESSION_KEY);
    if (seen) return;

    sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    const showTimer = window.setTimeout(() => setIsVisible(true), 0);
    const hideTimer = window.setTimeout(() => setIsVisible(false), INTRO_DURATION_MS);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
          aria-label="Cinematic intro"
        >
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              className="relative h-24 w-[280px] overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-2xl shadow-indigo-900/30 sm:w-[360px]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-white/15 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "500%" }}
                transition={{ duration: 1.4, ease: "easeInOut", delay: 0.25 }}
              />
              <div className="absolute inset-0 grid grid-cols-8 gap-1 p-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-sm bg-white/10"
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: [0.25, 0.8, 0.25] }}
                    transition={{ duration: 0.9, delay: i * 0.03, repeat: 1 }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.p
              className="text-xs uppercase tracking-[0.34em] text-white/75 sm:text-sm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              Entering Cinematic Journey
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
