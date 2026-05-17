import { useState, useEffect } from 'react';
import { t, type Lang } from './i18n';

type Props = { lang: Lang };

export default function MobileMenu({ lang }: Props) {
  const [open, setOpen] = useState(false);
  const tx = t[lang];

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function close() { setOpen(false); }

  return (
    <>
      <button
        type="button"
        className="nav-hamburger"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(o => !o)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="mobile-drawer-overlay"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-drawer"
        className={`mobile-drawer${open ? ' mobile-drawer--open' : ''}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="mobile-drawer-head">
          <span className="mobile-drawer-title">Unboks</span>
          <button
            type="button"
            className="mobile-drawer-close"
            aria-label="Close menu"
            onClick={close}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="mobile-drawer-nav" aria-label="Mobile">
          <a href="/" onClick={close}>{tx.nav_home ?? 'Home'}</a>
          <a href="/#services" onClick={close}>{tx.nav_services}</a>
          <a href="/#how" onClick={close}>{tx.nav_how}</a>
          <a href="/faq" onClick={close}>{tx.nav_faq}</a>
          <a href="/contact" onClick={close}>{tx.nav_contact}</a>
        </nav>

        <div className="mobile-drawer-actions">
          <a
            href="https://dashboard.unboks.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-drawer-login"
            onClick={close}
          >
            {tx.nav_login}
          </a>
          <a
            href="https://wa.me/59996881585"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-drawer-cta"
            onClick={close}
          >
            {tx.nav_cta}
          </a>
        </div>
      </aside>
    </>
  );
}
