import { useState, useRef, useEffect } from 'react';
import './homepage.css';
import { t, LANGUAGES, type Lang } from './i18n';
import { PRICING } from './pricing-data';
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
  return 'pap';
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

const Check = () => (
  <svg className="pricing-check" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 10.5l3.5 3.5L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function PricingPage() {
  const [lang, setLangState] = useState<Lang>(getInitialLanguage);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const tx = t[lang];
  const px = PRICING[lang];
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
          <a href="/pricing" aria-current="page">{tx.nav_pricing}</a>
          <a href="/faq">{tx.nav_faq}</a>
          <a href="/contact">{tx.nav_contact}</a>
        </div>
        <div className="nav-actions">
          <div className="lang-dropdown" ref={dropRef}>
            <button className="lang-trigger" onClick={() => setDropOpen(o => !o)} aria-haspopup="listbox" aria-expanded={dropOpen}>
              <span className="lang-flag">{activeLang.flag}</span>
              <span className="lang-name">{activeLang.label}</span>
              <span className="lang-chevron">{dropOpen ? '▲' : '▼'}</span>
            </button>
            {dropOpen && (
              <div className="lang-menu lang-menu--right" role="listbox">
                {LANGUAGES.map(l => (
                  <button key={l.code} className={`lang-option${lang === l.code ? ' lang-option--active' : ''}`} role="option" aria-selected={lang === l.code} onClick={() => { setLang(l.code); setDropOpen(false); }}>
                    <span className="lang-flag">{l.flag}</span>
                    <span className="lang-name">{l.label}</span>
                    {lang === l.code && <span className="lang-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <a href="https://dashboard.unboks.org" className="btn-ghost" target="_blank" rel="noopener noreferrer">{tx.nav_login}</a>
          <a href="https://wa.me/59996881585" target="_blank" rel="noopener noreferrer" className="btn-primary">{tx.nav_cta}</a>
        </div>
      </nav>

      <section className="pricing-hero">
        <div className="pricing-tag">{px.tag}</div>
        <h1 className="pricing-h1">{px.h1}</h1>
        <p className="pricing-intro">{px.intro}</p>
      </section>

      <section className="pricing-steps" aria-label={px.tag}>
        <div className="pricing-step">
          <div className="pricing-step-num">1</div>
          <div className="pricing-step-body">
            <div className="pricing-step-t">{px.step1_t}</div>
            <div className="pricing-step-d">{px.step1_d}</div>
          </div>
        </div>
        <div className="pricing-step-arrow" aria-hidden="true">→</div>
        <div className="pricing-step">
          <div className="pricing-step-num">2</div>
          <div className="pricing-step-body">
            <div className="pricing-step-t">{px.step2_t}</div>
            <div className="pricing-step-d">{px.step2_d}</div>
          </div>
        </div>
        <div className="pricing-step-arrow" aria-hidden="true">→</div>
        <div className="pricing-step">
          <div className="pricing-step-num">3</div>
          <div className="pricing-step-body">
            <div className="pricing-step-t">{px.step3_t}</div>
            <div className="pricing-step-d">{px.step3_d}</div>
          </div>
        </div>
      </section>

      <section className="pricing-grid" aria-label="Plans">
        {px.plans.map(plan => (
          <div key={plan.id} className={`pricing-card${plan.id === 'business' ? ' pricing-card--featured' : ''}`}>
            {plan.id === 'business' && (
              <div className="pricing-badge">{px.most_popular}</div>
            )}
            <div className="pricing-card-name">{plan.name}</div>
            <div className="pricing-card-price">
              <span className="pricing-card-price-num">{plan.price}</span>
              <span className="pricing-card-price-per">{px.per_month}</span>
            </div>
            <div className="pricing-card-setup">{px.setup_label}: <strong>{plan.setup}</strong></div>
            <a href="/contact" className={plan.id === 'business' ? 'pricing-cta pricing-cta--primary' : 'pricing-cta'}>{px.cta}</a>
            <ul className="pricing-features" role="list">
              {plan.features.map((f, i) => (
                <li key={i}><Check />{f}</li>
              ))}
            </ul>
            <div className="pricing-best-for">
              <div className="pricing-best-for-label">{px.best_for_label}</div>
              <div className="pricing-best-for-text">{plan.best_for}</div>
            </div>
          </div>
        ))}
      </section>

      <p className="pricing-split-note">{px.split_note}</p>

      <section className="pricing-addons" aria-labelledby="addons-h">
        <h2 id="addons-h" className="pricing-section-h">{px.addons_h}</h2>
        <div className="pricing-addons-list">
          <div className="pricing-addon"><span className="pricing-addon-l">{px.addon_channel_l}</span><span className="pricing-addon-v">{px.addon_channel_v}</span></div>
          <div className="pricing-addon"><span className="pricing-addon-l">{px.addon_user_l}</span><span className="pricing-addon-v">{px.addon_user_v}</span></div>
          <div className="pricing-addon"><span className="pricing-addon-l">{px.addon_x_l}</span><span className="pricing-addon-v">{px.addon_x_v}</span></div>
          <div className="pricing-addon"><span className="pricing-addon-l">{px.addon_traffic_l}</span><span className="pricing-addon-v">{px.addon_traffic_v}</span></div>
          <div className="pricing-addon"><span className="pricing-addon-l">{px.addon_brand_l}</span><span className="pricing-addon-v">{px.addon_brand_v}</span></div>
        </div>
      </section>

      <section className="pricing-defs" aria-labelledby="defs-h">
        <h2 id="defs-h" className="pricing-section-h">{px.def_h}</h2>
        <div className="pricing-defs-list">
          <p>{px.def_channel}</p>
          <p>{px.def_user}</p>
        </div>
      </section>

      <footer>
        <div>
          <div className="footer-brand">Unboks</div>
          <div className="footer-sub">{tx.footer_sub}</div>
        </div>
        <div className="footer-links">
          <a href="/#services">{tx.nav_services}</a>
          <a href="/pricing">{tx.nav_pricing}</a>
          <a href="/faq">{tx.nav_faq}</a>
          <a href="https://wa.me/59996881585" target="_blank" rel="noopener noreferrer">{tx.nav_contact}</a>
        </div>
        <a href="https://wa.me/59996881585" target="_blank" rel="noopener noreferrer" className="footer-wa-chip">+599 968 81585</a>
      </footer>
    </div>
  );
}
