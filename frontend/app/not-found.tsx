import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <h1 className="text-4xl font-bold text-white md:text-5xl">404</h1>
      <p className="mt-3 text-lg text-slate-400">Page not found</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-emerald-500 px-6 text-sm font-semibold text-white transition hover:bg-emerald-400"
      >
        Back to Home
      </Link>
    </div>
  );
}
