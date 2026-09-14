import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg p-8">
      <div className="w-full max-w-content rounded-card border border-border bg-surface p-8 text-center shadow-card">
        <p className="text-caption font-medium uppercase tracking-wide text-primary">
          CF360
        </p>
        <h1 className="mt-2 text-display text-text">Page not found</h1>
        <p className="mt-2 text-body-relaxed text-text-sub">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/pipeline"
          className="mt-4 inline-flex h-control items-center rounded-control bg-primary px-4 text-label font-medium text-white hover:bg-primary/90"
        >
          Back to Pipeline
        </Link>
      </div>
    </main>
  );
}
