export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg p-8">
      <div className="w-full max-w-content rounded-card border border-border bg-surface p-8 shadow-card">
        <p className="text-caption font-medium uppercase tracking-wide text-primary">
          Bajaj Finserv
        </p>
        <h1 className="mt-2 text-display text-text">CF360 — Content Factory 360</h1>
        <p className="mt-2 text-body-relaxed text-text-sub">
          Project scaffolding is in place. The full pipeline UI is being wired up
          screen by screen.
        </p>
      </div>
    </main>
  );
}
