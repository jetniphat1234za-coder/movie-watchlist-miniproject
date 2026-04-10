"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SEEN_KEY = "mw2:prehome-seen";
const INTRO_SESSION_KEY = "mw2:intro-seen";

gsap.registerPlugin(ScrollTrigger);

export default function PreHomepageCinematic({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(true);
  const [homeReveal, setHomeReveal] = useState(1);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.localStorage.getItem(SEEN_KEY);
    const timer = window.setTimeout(() => {
      if (seen) {
        setReady(true);
        setCompleted(true);
        setHomeReveal(1);
        return;
      }

      setReady(true);
      if (reduceMotion) {
        setCompleted(true);
        setHomeReveal(1);
        window.localStorage.setItem(SEEN_KEY, "true");
        window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
        return;
      }

      setCompleted(false);
      setHomeReveal(0);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || completed) return;
    if (!rootRef.current || !trackRef.current || !stageRef.current) return;

    const q = gsap.utils.selector(stageRef.current);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: trackRef.current,
        start: "top top",
        end: "+=4500",
        scrub: 1,
        pin: stageRef.current,
        anticipatePin: 1,
        onUpdate(self) {
          const progress = self.progress;
          const reveal = gsap.utils.clamp(0, 1, (progress - 0.78) / 0.22);
          setHomeReveal(reveal);
          if (progress > 0.995) {
            window.localStorage.setItem(SEEN_KEY, "true");
            window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
            setCompleted(true);
          }
        },
      },
    });

    tl.to(q(".entry-title"), { opacity: 0, y: -120, scale: 0.9 }, 0.08)
      .to(q(".entry-sub"), { opacity: 0, y: 40 }, 0.12)
      .fromTo(
        q(".cinematic-core"),
        { scale: 0.85, opacity: 0.2, filter: "blur(12px)" },
        { scale: 1.1, opacity: 1, filter: "blur(0px)" },
        0.12
      )
      .to(q(".poster-a"), { xPercent: -140, yPercent: -18, rotation: -15, scale: 1.18 }, 0.2)
      .to(q(".poster-b"), { xPercent: 145, yPercent: -5, rotation: 13, scale: 1.2 }, 0.22)
      .to(q(".poster-c"), { xPercent: -105, yPercent: 22, rotation: -8, scale: 1.14 }, 0.26)
      .to(q(".poster-d"), { xPercent: 120, yPercent: 32, rotation: 9, scale: 1.18 }, 0.28)
      .to(q(".genre-action"), { opacity: 0.95, scale: 1.25 }, 0.34)
      .to(q(".genre-action"), { opacity: 0.28, scale: 1 }, 0.46)
      .to(q(".genre-horror"), { opacity: 0.95, scale: 1.25 }, 0.5)
      .to(q(".genre-horror"), { opacity: 0.22, scale: 1 }, 0.6)
      .to(q(".genre-scifi"), { opacity: 0.95, scale: 1.25 }, 0.64)
      .to(q(".genre-scifi"), { opacity: 0.24, scale: 1 }, 0.74)
      .to(q(".genre-romance"), { opacity: 0.98, scale: 1.22 }, 0.78)
      .to(q(".genre-romance"), { opacity: 0.2, scale: 1 }, 0.88)
      .to(q(".final-screen"), { opacity: 1, scale: 1.05 }, 0.86)
      .to(q(".final-screen"), { scale: 1.8, opacity: 1 }, 0.94);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.refresh();
    };
  }, [ready, completed]);

  const showCinematic = ready && !completed;

  return (
    <div ref={rootRef} className="relative">
      {showCinematic ? (
        <div ref={trackRef} className="relative z-40 h-[520vh]">
          <div ref={stageRef} className="relative h-screen overflow-hidden bg-black">
            <div className="entry-title absolute inset-x-0 top-[36%] text-center">
              <h1 className="text-4xl font-semibold tracking-[0.2em] text-white sm:text-6xl">MOVIE WATCHLIST</h1>
            </div>
            <p className="entry-sub absolute inset-x-0 top-[53%] text-center text-sm uppercase tracking-[0.25em] text-white/70">
              Scroll to begin
            </p>

            <div className="cinematic-core absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(125,211,252,0.15),transparent_42%),radial-gradient(circle_at_15%_12%,rgba(244,63,94,0.24),transparent_42%),radial-gradient(circle_at_82%_16%,rgba(124,58,237,0.24),transparent_42%)]" />
              <div className="absolute inset-0 animate-film-grain opacity-[0.22]" />

              <div className="poster-a absolute left-[16%] top-[33%] h-44 w-28 rounded-lg border border-white/20 bg-white/12 shadow-2xl shadow-black/60 sm:h-56 sm:w-36" />
              <div className="poster-b absolute right-[18%] top-[30%] h-44 w-28 rounded-lg border border-white/20 bg-white/10 shadow-2xl shadow-black/60 sm:h-56 sm:w-36" />
              <div className="poster-c absolute left-[30%] bottom-[16%] h-36 w-24 rounded-lg border border-white/15 bg-white/10 shadow-xl shadow-black/60 sm:h-44 sm:w-28" />
              <div className="poster-d absolute right-[28%] bottom-[14%] h-36 w-24 rounded-lg border border-white/15 bg-white/10 shadow-xl shadow-black/60 sm:h-44 sm:w-28" />

              <div className="genre-action absolute inset-0 opacity-0 bg-[radial-gradient(700px_380px_at_20%_45%,rgba(239,68,68,0.42),transparent_55%),radial-gradient(700px_380px_at_80%_25%,rgba(249,115,22,0.4),transparent_55%)]" />
              <div className="genre-horror absolute inset-0 opacity-0 bg-[radial-gradient(800px_420px_at_30%_55%,rgba(127,29,29,0.55),transparent_58%),radial-gradient(900px_420px_at_75%_25%,rgba(88,28,135,0.42),transparent_58%)]" />
              <div className="genre-scifi absolute inset-0 opacity-0 bg-[radial-gradient(850px_420px_at_20%_45%,rgba(14,165,233,0.4),transparent_55%),radial-gradient(800px_420px_at_80%_30%,rgba(59,130,246,0.42),transparent_58%)]" />
              <div className="genre-romance absolute inset-0 opacity-0 bg-[radial-gradient(820px_420px_at_24%_50%,rgba(236,72,153,0.38),transparent_57%),radial-gradient(880px_420px_at_78%_32%,rgba(251,113,133,0.34),transparent_57%)]" />
            </div>

            <div className="final-screen pointer-events-none absolute inset-0 opacity-0 bg-black" />
          </div>
        </div>
      ) : null}

      <div
        style={{
          opacity: homeReveal,
          transform: `scale(${0.985 + homeReveal * 0.015})`,
          filter: `blur(${(1 - homeReveal) * 6}px)`,
          transition: "opacity 260ms ease, transform 260ms ease, filter 260ms ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
