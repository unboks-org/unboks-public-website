import MobileMenu from './MobileMenu';
import { useState, useRef, useEffect } from 'react';
import './homepage.css';
import { t, LANGUAGES, type Lang } from './i18n';
import { FAQ_CATEGORIES } from './faq-data';
import logo from '@assets/image_1777095356119.png';
import logoPap from '@assets/image_1777081806501.png';

const LANG_KEY = 'unboks_language';
const SUPPORTED = new Set(LANGUAGES.map(l => l.code));

function detectBrowserLang(): Lang {
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const raw of candidates) {
    const lower = raw.toLowerCase();
    for (const code of SUPPORTED) {
      if (lower === code || lower.startsWith(code + '-')) return code as Lang;
    }
    const base = lower.split('-')[0];
    if (SUPPORTED.has(base as Lang)) return base as Lang;
  }
  return 'en';
}

function getInitialLanguage(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.has(saved as Lang)) return saved as Lang;
  } catch {}
  return detectBrowserLang();
}

function saveLanguage(lang: Lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{q}</span>
        <span className="faq-chevron" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div
        className="faq-answer-wrap"
        style={{ maxHeight: open ? (bodyRef.current?.scrollHeight ?? 600) + 'px' : '0px' }}
      >
        <div className="faq-answer" ref={bodyRef}>
          {a.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [lang, setLangState] = useState<Lang>(getInitialLanguage);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const tx = t[lang];
  const activeLang = LANGUAGES.find(l => l.code === lang)!;

  function setLang(l: Lang) {
    setLangState(l);
    saveLanguage(l);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="hp-site">

      <nav>
        <a className="nav-logo" href="/">
          <img src={lang === 'pap' ? logoPap : logo} alt="Unboks.org" className="nav-logo-img nav-logo-img--wide" />
        </a>
        <div className="nav-links">
          <a href="/#services">{tx.nav_services}</a>
          <a href="/#how">{tx.nav_how}</a>
          <a href="/pricing">{tx.nav_pricing}</a>
          <a href="/faq" aria-current="page">{tx.nav_faq}</a>
          <a href="/contact">{tx.nav_contact}</a>
        </div>
        <div className="nav-actions">
          <div className="lang-dropdown" ref={dropRef}>
            <button
              className="lang-trigger"
              onClick={() => setDropOpen(o => !o)}
              aria-haspopup="listbox"
              aria-expanded={dropOpen}
            >
              <span className="lang-flag">{activeLang.flag}</span>
              <span className="lang-name">{activeLang.label}</span>
              <span className="lang-chevron">{dropOpen ? '▲' : '▼'}</span>
            </button>
            {dropOpen && (
              <div className="lang-menu lang-menu--right" role="listbox">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    className={`lang-option${lang === l.code ? ' lang-option--active' : ''}`}
                    role="option"
                    aria-selected={lang === l.code}
                    onClick={() => { setLang(l.code); setDropOpen(false); }}
                  >
                    <span className="lang-flag">{l.flag}</span>
                    <span className="lang-name">{l.label}</span>
                    {lang === l.code && <span className="lang-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <a href="https://dashboard.unboks.org" className="btn-ghost" target="_blank" rel="noopener noreferrer">{tx.nav_login}</a>
          <a href="/contact" className="btn-primary">{tx.nav_cta}</a>
          <MobileMenu lang={lang} />
        </div>
      </nav>

      <section className="faq-hero">
        <div className="contact-tag">{tx.faq_tag}</div>
        <h1 className="contact-h1">{tx.faq_h1}</h1>
        <p className="contact-sub">{tx.faq_sub}</p>
      </section>

      <div className="faq-body">
        {FAQ_CATEGORIES.map(cat => (
          <div key={cat.label} className="faq-category">
            <div className="section-label">{cat.label}</div>
            <div className="faq-list">
              {cat.items.map(item => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <p className="faq-cta-text">{tx.faq_cta_text}</p>
        <a href="/contact" className="btn-primary">{tx.faq_cta_btn}</a>
      </div>

      <footer>
        <div>
          <div className="footer-brand">Unboks</div>
          <div className="footer-sub">{tx.footer_sub}</div>
        </div>
        <div className="footer-links">
          <a href="/#services">{tx.nav_services}</a>
          <a href="/#how">{tx.nav_how}</a>
          <a href="/pricing">{tx.nav_pricing}</a>
          <a href="/faq">{tx.nav_faq}</a>
          <a href="https://wa.me/59996881585" target="_blank" rel="noopener noreferrer">{tx.nav_contact}</a>
        </div>
        <a href="https://wa.me/59996881585" target="_blank" rel="noopener noreferrer" className="footer-wa-chip">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="footer-wa-icon">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          +599 968 81585
        </a>
      </footer>

    </div>
  );
}
