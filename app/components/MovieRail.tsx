import Link from "next/link";
import Image from "next/image";
import { tmdbImage, type TmdbMovie } from "@/app/lib/tmdb";

export default function MovieRail({
  title,
  subtitle,
  movies,
}: {
  title: string;
  subtitle?: string;
  movies: TmdbMovie[];
}) {
  const shown = movies;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
          <span>Scroll</span>
          <span className="h-px w-10 bg-white/15" />
        </div>
      </div>

      <div className="relative -mx-4 px-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-black/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-black/40 to-transparent z-10" />

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {shown.map((m) => (
            <div
              key={m.id}
              className="shrink-0 w-[210px] sm:w-[230px] lg:w-[250px] snap-start"
            >
              <MovieTile movie={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MovieTile({ movie: m }: { movie: TmdbMovie }) {
  return (
    <Link
      href={`/movies/${m.id}`}
      className="group block rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/8 transition duration-300"
    >
      <div className="relative aspect-2/3">
        {m.poster_path ? (
          <Image
            src={tmdbImage(m.poster_path, "w500")!}
            alt={m.title || m.name || "Movie"}
            fill
            sizes="260px"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-white/60">
            No poster
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold leading-snug line-clamp-2 tracking-tight">
            {m.title || m.name || "-"}
          </h3>
          {typeof m.vote_average === "number" ? (
            <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
              {m.vote_average.toFixed(1)}
            </div>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-white/60 line-clamp-2">
          {m.overview || "No overview available."}
        </p>

        <div className="mt-3 text-xs text-white/50">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/80" />
            Open details
          </span>
        </div>
      </div>
    </Link>
  );
}

