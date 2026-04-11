import { NavLink } from 'react-router-dom';
import { navLinks } from '../data/siteContent';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 py-12" data-testid="footer">
      <div className="wrap flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">We Take Your Job</p>
          <p className="mt-1 text-sm text-slate-400">AI communication tools for lean teams.</p>
        </div>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className="text-sm text-slate-400 hover:text-slate-700"
              data-testid={`link-footer-${link.label.toLowerCase()}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <p className="text-sm text-slate-300">hello@wetakeyourjob.com</p>
      </div>
    </footer>
  );
}
