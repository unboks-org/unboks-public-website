import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const PREFIX = '/demo/bluemarlin';

const links = [
  { href: '/', label: 'Home' },
  { href: '/trips', label: 'Trips' },
  { href: '/booking', label: 'Booking' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = location.pathname.replace(PREFIX, '') || '/';

  return (
    <header className="sticky top-0 z-[999] border-b border-border bg-background/95 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <Link to={`${PREFIX}/`} className="flex items-center gap-2.5" data-testid="link-home-logo">
            <Logo className="h-10 w-auto" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-foreground">BlueMarlin Tours</p>
              <p className="text-xs text-muted-foreground">Curaçao Charters</p>
            </div>
          </Link>
          <span className="-rotate-6 rounded border-2 border-red-500/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-red-500/90 select-none" data-testid="badge-demo-stamp">Demo</span>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={`${PREFIX}${link.href}`}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
              className={`rounded-md px-3.5 py-2 text-sm font-medium transition ${
                currentPath === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://bmdashboard.wetakeyourjob.com"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-nav-login"
            className="hidden items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground md:inline-flex"
          >
            Log In
          </a>
          <Link
            to={`${PREFIX}/book`}
            data-testid="link-nav-book-now"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Book Now
          </Link>

          <button
            className="md:hidden rounded-md p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={`${PREFIX}${link.href}`}
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-4 py-2.5 text-sm font-medium transition ${
                  currentPath === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://bmdashboard.wetakeyourjob.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-mobile-login"
              className="rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition"
            >
              Log In
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
