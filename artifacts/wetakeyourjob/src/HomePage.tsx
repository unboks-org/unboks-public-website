import MobileMenu from './MobileMenu';
import { useState, useRef, useEffect } from 'react';
import './homepage.css';
import { t, LANGUAGES, type Lang } from './i18n';
import logo from '@assets/image_1777095356119.png';
import logoPap from '@assets/image_1777081806501.png';

import imgSmartAutoPap from '@assets/smart_automation_papia_1777004242843.png';
import imgFasterRepliesPap from '@assets/chica_PAPIA_1777004355009.png';

import heroIllustration from '@assets/image_1777081964209.png';

import imgSmartAutoSv from '@assets/smart_automation_swedish_1777004242843.png';
import imgFasterRepliesSv from '@assets/chica_swedish_1777004355009.png';

import imgSmartAutoDefault from '@assets/wtyj_panel_smart_automation_human_oversight_premium_1777003358272.png';
import imgFasterRepliesDefault from '@assets/wtyj_panel_faster_replies_clean_1777003337352.png';

const LANG_KEY = 'unboks_language';
const SUPPORTED = new Set(LANGUAGES.map(l => l.code));

function detectBrowserLang(): Lang {
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const raw of candidates) {
    const lower = raw.toLowerCase();
    // exact match e.g. "pap-cw" → "pap"
    for (const code of SUPPORTED) {
      if (lower === code || lower.startsWith(code + '-')) return code as Lang;
    }
    // base language match e.g. "nl-nl" → "nl"
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

export default function HomePage() {
  const [lang, setLangState] = useState<Lang>(getInitialLanguage);
  const [dropOpen, setDropOpen] = useState(false);

  function setLang(l: Lang) {
    setLangState(l);
    saveLanguage(l);
  }
  const dropRef = useRef<HTMLDivElement>(null);
  const tx = t[lang];
  const activeLang = LANGUAGES.find(l => l.code === lang)!;

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
        <a className="nav-logo" href="#">
          <img src={lang === 'pap' ? logoPap : logo} alt="Unboks.org" className="nav-logo-img nav-logo-img--wide" />
        </a>
        <div className="nav-links">
          <a href="#services">{tx.nav_services}</a>
          <a href="#how">{tx.nav_how}</a>
          <a href="/faq">{tx.nav_faq}</a>
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
          {/* TODO: point this to final dashboard deployment URL if different */}
          <a href="https://dashboard.unboks.org" className="btn-ghost" target="_blank" rel="noopener noreferrer">{tx.nav_login}</a>
          <a href="https://wa.me/59996881585" target="_blank" rel="noopener noreferrer" className="btn-primary">{tx.nav_cta}</a>
          <MobileMenu lang={lang} />
        </div>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">{tx.hero_tag}</div>
          <h1>{tx.hero_h1a}<br /><em>{tx.hero_h1b}</em></h1>
          <p>{tx.hero_p}</p>
          <div className="hero-cta">
            <a href="https://wa.me/59996881585" target="_blank" rel="noopener noreferrer" className="btn-primary">{tx.hero_cta}</a>
            <a href="#how" className="btn-ghost">{tx.hero_see}</a>
          </div>
          <div className="hero-trust">{tx.hero_trust}</div>
        </div>
        <div className="hero-right">
          <img src={heroIllustration} alt="All your messaging channels in one inbox" className="hero-illustration" />
        </div>
      </section>

      <div className="channels">
        <span className="channels-label">{tx.channels_label}</span>
        <div className="channel-pills">
          <span className="pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#EA4335" opacity="0"/><path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335"/></svg>
            Email
          </span>
          <span className="pill pill--whatsapp">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </span>
          <span className="pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="url(#ig-grad)"><defs><linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </span>
          <span className="pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            Facebook
          </span>
          <span className="pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#29B6F6"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </span>
          <span className="pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#0084FF"><path d="M12 0C5.374 0 0 4.975 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.626 0 12-4.974 12-11.111S18.626 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/></svg>
            Messenger
          </span>
          <span className="pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X
          </span>
          <span className="pill pill--more">{tx.channel_more}</span>
        </div>
      </div>

      <section className="features" id="services">
        <div className="features-header">
          <div className="section-label">{tx.feat_label}</div>
          <div className="section-title">{tx.feat_title}</div>
          <p className="section-sub">{tx.feat_sub}</p>
        </div>
        <ul className="capabilities" role="list" aria-label={tx.cap_label}>
          <li className="capability-chip" role="listitem"><span className="capability-chip-dot" aria-hidden="true" />{tx.cap_autoreply}</li>
          <li className="capability-chip" role="listitem"><span className="capability-chip-dot" aria-hidden="true" />{tx.cap_triage}</li>
          <li className="capability-chip" role="listitem"><span className="capability-chip-dot" aria-hidden="true" />{tx.cap_routing}</li>
          <li className="capability-chip capability-chip--sot" role="listitem"><span className="capability-chip-dot" aria-hidden="true" />{tx.cap_sot}</li>
          <li className="capability-chip" role="listitem"><span className="capability-chip-dot" aria-hidden="true" />{tx.cap_escalation}</li>
          <li className="capability-chip" role="listitem"><span className="capability-chip-dot" aria-hidden="true" />{tx.cap_multilang}</li>
        </ul>
        <div className="feature-img-grid">
          <div className="feature-img-panel">
            <img src={lang === 'pap' ? imgSmartAutoPap : imgSmartAutoDefault} alt={tx.feat_panel1_caption} />
            <div className="feature-img-caption">{tx.feat_panel1_caption}</div>
          </div>
          <div className="feature-img-panel">
            <img src={lang === 'pap' ? imgFasterRepliesPap : imgFasterRepliesDefault} alt={tx.feat_panel2_caption} />
            {lang === 'sv' && (
              <div className="feature-img-body">{(tx as { feat_panel2_body?: string }).feat_panel2_body}</div>
            )}
            <div className="feature-img-caption">{tx.feat_panel2_caption}</div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="how-header">
          <div className="section-label">{tx.how_label}</div>
          <div className="section-title">{tx.how_title}</div>
          <p className="section-sub">{tx.how_sub}</p>
        </div>
        <div className="flow-map" role="list" aria-label={tx.flow_label}>
          <span className="flow-node" role="listitem">
            <span className="flow-node-dot" aria-hidden="true" />{tx.flow_n1}
          </span>
          <span className="flow-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
          <span className="flow-node flow-node--accent" role="listitem">
            <span className="flow-node-dot" aria-hidden="true" />{tx.flow_n2}
          </span>
          <span className="flow-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
          <span className="flow-node" role="listitem">
            <span className="flow-node-dot" aria-hidden="true" />{tx.flow_n3}
          </span>
          <span className="flow-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
          <span className="flow-node" role="listitem">
            <span className="flow-node-dot" aria-hidden="true" />{tx.flow_n4}
          </span>
          <span className="flow-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
          <span className="flow-node flow-node--strong" role="listitem">
            <span className="flow-node-dot" aria-hidden="true" />{tx.flow_n5}
          </span>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-content">
              <h3>{tx.step1_title}</h3>
              <p>{tx.step1_p}</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-content">
              <h3>{tx.step2_title}</h3>
              <p>{tx.step2_p}</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-content">
              <h3>{tx.step3_title}</h3>
              <p>{tx.step3_p}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="outcomes">
        <div className="outcomes-left">
          <div className="section-label">{tx.out_label}</div>
          <div className="section-title">
            {tx.out_title_a}<br />{tx.out_title_b}<br />{tx.out_title_c}
          </div>
          <div className="outcome-list">
            <div className="outcome-item">{tx.out1}</div>
            <div className="outcome-item">{tx.out2}</div>
            <div className="outcome-item">{tx.out3}</div>
            <div className="outcome-item">{tx.out4}</div>
          </div>
        </div>
        <div className="outcomes-right">
          <div className="section-label">{tx.stat_label}</div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-num">7+</div>
              <div className="stat-label">{tx.stat1_lbl}</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">24/7</div>
              <div className="stat-label">{tx.stat2_lbl}</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">&lt;1 min</div>
              <div className="stat-label">{tx.stat3_lbl}</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">5</div>
              <div className="stat-label">{tx.stat4_lbl}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-band" id="contact">
        <h2>{tx.cta_h2}</h2>
        <p>{tx.cta_p}</p>
        <div className="cta-actions">
          <a href="https://wa.me/59996881585" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {tx.cta_whatsapp}
          </a>
          <a href="/contact" className="btn-ghost btn-ghost--on-dark">{tx.cta_secondary}</a>
        </div>
      </div>

      <footer>
        <div>
          <div className="footer-brand">Unboks</div>
          <div className="footer-sub">{tx.footer_sub}</div>
        </div>
        <div className="footer-links">
          <a href="#services">{tx.nav_services}</a>
          <a href="#how">{tx.nav_how}</a>
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
