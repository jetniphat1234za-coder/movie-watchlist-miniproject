"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl bg-white/5 border border-white/10",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.35s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}

