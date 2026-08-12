export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-10 lg:min-h-[calc(100vh-5rem)]">
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
