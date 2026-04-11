import { NavLink } from 'react-router-dom';
import { navLinks } from '../data/siteContent';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-shell flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-md">
          <p className="text-lg font-semibold text-white">wetakeyourjob.com</p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            AI communication tools for lean teams that need more speed, consistency, visibility, and control.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Navigation</p>
            <div className="mt-3 flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink key={link.href} to={link.href} className="text-sm text-slate-300 hover:text-white">
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</p>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <p>hello@wetakeyourjob.com</p>
              <p>Strategy calls available by appointment</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
