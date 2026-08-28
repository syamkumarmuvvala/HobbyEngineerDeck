import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-5 w-full max-w-xl" />
      <div className="mt-10 space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </main>
  );
}
