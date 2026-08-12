import Skeleton from "@/components/shared/Skeleton";

export default function HomeLoading() {
  return (
    <div className="bg-slate-950">
      <section className="relative min-h-[88vh] bg-slate-900">
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 py-24">
          <Skeleton className="mb-4 h-4 w-48 bg-slate-800" />
          <Skeleton className="h-16 max-w-4xl bg-slate-800" />
          <Skeleton className="mt-4 h-6 max-w-2xl bg-slate-800" />
          <Skeleton className="mt-10 h-16 max-w-2xl rounded-full bg-slate-800" />
        </div>
      </section>
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="h-10 w-64 bg-slate-800" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-2xl bg-slate-800" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
