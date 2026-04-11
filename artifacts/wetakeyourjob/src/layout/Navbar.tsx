import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navLinks } from '../data/siteContent';
import Button from '../components/Button';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-night/80 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <NavLink to="/" className="text-lg font-semibold tracking-tight text-white" onClick={closeMenu}>
          We Take Your Job
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-white/[0.07] text-white' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button to="/contact">Book a strategy call</Button>
        </div>

        <button
          type="button"
          className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-3 text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/5 bg-night/95 md:hidden">
          <div className="container-shell flex flex-col gap-2 py-4">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    active ? 'bg-white/[0.07] text-white' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
            <Button to="/contact" className="mt-2 w-full" onClick={closeMenu}>
              Book a strategy call
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
