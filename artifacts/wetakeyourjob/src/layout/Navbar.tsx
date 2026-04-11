import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navLinks } from '../data/siteContent';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header data-testid="navbar" className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="wrap flex h-16 items-center justify-between">
        <NavLink to="/" className="text-base font-semibold text-slate-900 tracking-tight" onClick={close} data-testid="link-home-logo">
          We Take Your Job
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            data-testid="button-nav-cta"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Get started
          </NavLink>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          data-testid="button-mobile-menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="wrap flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={close}
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-slate-50 text-slate-900' : 'text-slate-600'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              onClick={close}
              data-testid="button-mobile-cta"
              className="mt-2 rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Get started
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
