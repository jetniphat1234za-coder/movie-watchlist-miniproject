import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/15 bg-slate-900/45 backdrop-blur supports-backdrop-filter:bg-slate-900/35">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-xl">🎬</span>
          <span className="text-lg sm:text-xl font-semibold tracking-tight">
            MyWatchlist
          </span>
          <span className="ml-2 hidden sm:inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
            cinematic
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/10 transition"
          >
            Discover
          </Link>
          <Link
            href="/my-list"
            className="rounded-full px-3 py-2 text-sm text-white/75 hover:text-white hover:bg-white/10 transition"
          >
            Watchlist
          </Link>
          <Link
            href="/add"
            className="rounded-full px-3 py-2 text-sm font-semibold bg-white text-black hover:bg-white/90 transition shadow-sm shadow-black/30"
          >
            Add
          </Link>
        </div>
      </div>
    </nav>
  );
}

