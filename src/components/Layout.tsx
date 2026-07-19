import { Link, Outlet, useLocation } from "react-router-dom";

function Emblem({ size }: { size: string }) {
  return (
    <span className={`block overflow-hidden rounded-full ${size}`}>
      <img
        src="/TCLogoTrans.png"
        alt=""
        className="w-[160%] max-w-none -ml-[30%] -mt-[12%]"
      />
    </span>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const inFlow = pathname !== "/";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-gold/10 bg-[#0F0A04]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Emblem size="h-9 w-9" />
            <span className="font-display text-sm font-semibold uppercase tracking-luxe sm:text-base">
              Tavas <span className="text-gold">Compass</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <a
              href="https://www.tavasworld.com"
              className="hidden text-xs font-medium uppercase tracking-luxe text-cream/70 transition hover:text-gold sm:block"
            >
              Tavas World
            </a>
            {!inFlow && (
              <Link
                to="/assessment"
                className="btn-gold !px-5 !py-2.5 !text-xs font-semibold uppercase tracking-luxe"
              >
                Start Free Assessment
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gold/10 bg-[#120B06]">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <div className="mx-auto flex justify-center">
            <Emblem size="h-12 w-12" />
          </div>
          <p className="mt-4 font-display text-base font-semibold uppercase tracking-luxe">
            Tavas <span className="text-gold">Compass</span>
          </p>
          <p className="mt-1 font-display italic text-gold/90">
            Navigate your future with confidence.
          </p>
          <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-medium uppercase tracking-luxe text-cream/60">
            <Link to="/" className="transition hover:text-gold">Home</Link>
            <Link to="/assessment" className="transition hover:text-gold">Assessment</Link>
            <a href="https://www.tavasworld.com" className="transition hover:text-gold">Tavas World</a>
            <a href="https://tavas.app" className="transition hover:text-gold">Tavas App</a>
          </nav>
          <p className="mt-7 text-xs text-cream/40">
            © {new Date().getFullYear()} Tavas World LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
