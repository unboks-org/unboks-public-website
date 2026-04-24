import { useState } from 'react';
import './homepage.css';
import { t, LANGUAGES, type Lang } from './i18n';
import logo from '@assets/logo_whe_BG_1777002782162.png';
import heroImg from '@assets/wtyj_panel_hero_main_premium_1777003348842.png';
import imgSmartAuto from '@assets/wtyj_panel_smart_automation_human_oversight_premium_1777003358272.png';
import imgFasterReplies from '@assets/wtyj_panel_faster_replies_clean_1777003337352.png';
import img247 from '@assets/wtyj_panel_24_7_coverage_clean_1777003337351.png';
import imgLanguages from '@assets/wtyj_panel_all_languages_clean_1777003337352.png';

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('pap');
  const tx = t[lang];

  return (
    <div className="hp-site">

      {/* Language bar */}
      <div className="lang-bar">
        <span className="lang-bar-label">🌐</span>
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            className={`lang-btn${lang === l.code ? ' lang-btn--active' : ''}`}
            onClick={() => setLang(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <nav>
        <a className="nav-logo" href="#">
          <img src={logo} alt="Unboks.org" className="nav-logo-img" />
        </a>
        <div className="nav-links">
          <a href="#services">{tx.nav_services}</a>
          <a href="#how">{tx.nav_how}</a>
          <a href="#contact">{tx.nav_contact}</a>
        </div>
        <div className="nav-actions">
          <a href="/dashboard/login" className="btn-ghost">{tx.nav_login}</a>
          <a href="#contact" className="btn-primary">{tx.nav_cta}</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-tag">{tx.hero_tag}</div>
        <h1>{tx.hero_h1a}<br /><em>{tx.hero_h1b}</em></h1>
        <p>{tx.hero_p}</p>
        <div className="hero-cta">
          <a href="#contact" className="btn-primary">{tx.hero_cta}</a>
          <a href="#how" className="btn-ghost">{tx.hero_see}</a>
        </div>
      </section>

      <div className="hero-visual">
        <img src={heroImg} alt="Unboks unified inbox dashboard" />
      </div>

      <div className="channels">
        <span className="channels-label">{tx.channels_label}</span>
        <div className="channel-pills">
          <span className="pill">Email</span>
          <span className="pill">WhatsApp</span>
          <span className="pill">Instagram</span>
          <span className="pill">Facebook</span>
          <span className="pill">Telegram</span>
          <span className="pill">Messenger</span>
          <span className="pill">X / Twitter</span>
        </div>
      </div>

      <section className="features" id="services">
        <div className="features-header">
          <div className="section-label">{tx.feat_label}</div>
          <div className="section-title">{tx.feat_title}</div>
          <p className="section-sub">{tx.feat_sub}</p>
        </div>
        <div className="feature-img-grid">
          <div className="feature-img-panel">
            <img src={imgSmartAuto} alt="Smart automation with human oversight" />
          </div>
          <div className="feature-img-panel">
            <img src={imgFasterReplies} alt="Faster replies, happier clients" />
          </div>
          <div className="feature-img-panel">
            <img src={img247} alt="24/7 coverage" />
          </div>
          <div className="feature-img-panel">
            <img src={imgLanguages} alt="All languages, one system" />
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="how-header">
          <div className="section-label">{tx.how_label}</div>
          <div className="section-title">{tx.how_title}</div>
          <p className="section-sub">{tx.how_sub}</p>
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
              <div className="stat-num">0</div>
              <div className="stat-label">{tx.stat4_lbl}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-band" id="contact">
        <h2>{tx.cta_h2}</h2>
        <p>{tx.cta_p}</p>
        <div className="hero-cta">
          <a href="mailto:hello@unboks.org" className="btn-primary">{tx.cta_book}</a>
          <a href="mailto:hello@unboks.org" className="btn-ghost">hello@unboks.org</a>
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
          <a href="#contact">{tx.nav_contact}</a>
        </div>
        <div className="footer-email">hello@unboks.org</div>
      </footer>

    </div>
  );
}
