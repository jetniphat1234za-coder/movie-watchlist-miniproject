"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function AddToWatchlistButton({ title }: { title: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const onAdd = async () => {
    if (state === "saving" || state === "saved") return;
    setState("saving");
    try {
      const res = await fetch("/api/watchlist-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, rating: 5, comment: "" }),
      });
      if (!res.ok) throw new Error("failed");
      setState("saved");
      setTimeout(() => setState("idle"), 1200);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 1400);
    }
  };

  const label =
    state === "saving"
      ? "Saving…"
      : state === "saved"
      ? "Added"
      : state === "error"
      ? "Try again"
      : "Add to Watchlist";

  return (
    <motion.button
      onClick={onAdd}
      whileTap={{ scale: 0.98 }}
      className={[
        "relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        state === "saved"
          ? "bg-emerald-400/15 border border-emerald-400/25 text-emerald-100"
          : "bg-white text-black hover:bg-white/90 shadow-sm shadow-black/30",
      ].join(" ")}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        {label}
      </span>
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 bg-[radial-gradient(420px_160px_at_20%_0%,rgba(99,102,241,0.25),transparent_60%)]" />
    </motion.button>
  );
}

