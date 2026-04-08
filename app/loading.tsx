import { Skeleton } from "@/app/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-12">
      <Skeleton className="h-[320px] sm:h-[380px] rounded-[28px]" />
      <div className="space-y-10">
        <RailSkeleton />
        <RailSkeleton />
        <RailSkeleton />
      </div>
    </div>
  );
}

function RailSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-20 rounded-lg hidden sm:block" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[360px] w-[240px] sm:w-[260px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

