import { Skeleton } from "@/app/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-[520px] rounded-[28px]" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-44 rounded-lg" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-[210px] w-[160px] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

