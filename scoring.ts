import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const { pathname } = useLocation();
  const inFlow = pathname !== "/";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-earth/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/compass.svg" alt="" className="h-8 w-8" />
            <span className="font-display text-xl font-bold tracking-tight">
              Tavas <span className="text-gold-deep">Compass</span>
            </span>
          </Link>
          {!inFlow && (
            <Link to="/assessment" className="btn-gold !px-5 !py-2 text-sm">
              Start free assessment
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-earth/10 bg-earth text-cream">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-lg font-bold">
                Tavas <span className="text-gold">Compass</span>
              </p>
              <p className="mt-1 text-sm text-cream/70">
                Career resilience and future planning.
              </p>
            </div>
            <p className="text-sm text-cream/60">
              © {new Date().getFullYear()} Tavas World LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
