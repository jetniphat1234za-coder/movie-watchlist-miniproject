"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Props = Omit<HTMLMotionProps<"button">, "ref"> & {
  tone?: "primary" | "ghost" | "danger";
};

export default function AnimatedButton({ tone = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

  const tones: Record<NonNullable<Props["tone"]>, string> = {
    primary:
      "bg-white text-black hover:bg-white/90 shadow-sm shadow-black/30",
    ghost:
      "bg-white/5 hover:bg-white/10 border border-white/10 text-white",
    danger:
      "bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-100",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className={[base, tones[tone], className].join(" ")}
      {...props}
    />
  );
}

