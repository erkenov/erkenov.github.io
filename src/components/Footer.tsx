export function Footer() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm font-medium">
            shamil<span className="text-accent">.</span>work
          </div>
          <span className="text-xs text-text-dim">·</span>
          <div className="text-xs text-text-dim">
            AI receptionist for auto repair shops
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs text-text-dim">
          <a
            href="mailto:shamil.erkenovv@gmail.com"
            className="transition-colors hover:text-text"
          >
            shamil.erkenovv@gmail.com
          </a>
          <span>© {new Date().getFullYear()} Shamil Erkenov</span>
        </div>
      </div>
    </footer>
  );
}
