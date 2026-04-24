import './homepage.css';
import logo from '@assets/logo_whe_BG_1777002782162.png';
import heroImg from '@assets/wtyj_panel_hero_main_premium_1777003348842.png';
import imgSmartAuto from '@assets/wtyj_panel_smart_automation_human_oversight_premium_1777003358272.png';
import imgFasterReplies from '@assets/wtyj_panel_faster_replies_clean_1777003337352.png';
import img247 from '@assets/wtyj_panel_24_7_coverage_clean_1777003337351.png';
import imgLanguages from '@assets/wtyj_panel_all_languages_clean_1777003337352.png';

export default function HomePage() {
  return (
    <div className="hp-site">

      <nav>
        <a className="nav-logo" href="#">
          <img src={logo} alt="Unboks.org" className="nav-logo-img" />
        </a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#how">How it works</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          <a href="/dashboard/login" className="btn-ghost">Log in</a>
          <a href="#contact" className="btn-primary">Get started</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-tag">AI communication tools</div>
        <h1>All your messages.<br /><em>One inbox.</em></h1>
        <p>We build the communication layer your team is missing, so you spend less time on messages and more time on your business.</p>
        <div className="hero-cta">
          <a href="#contact" className="btn-primary">Get started</a>
          <a href="#how" className="btn-ghost">See how it works</a>
        </div>
      </section>

      <div className="hero-visual">
        <img src={heroImg} alt="Unboks unified inbox dashboard" />
      </div>

      <div className="channels">
        <span className="channels-label">Channels</span>
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
          <div className="section-label">What we handle</div>
          <div className="section-title">Less busywork. More business.</div>
          <p className="section-sub">We take the repetitive communication work off your team's plate, without taking them out of the loop.</p>
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
          <div className="section-label">How it works</div>
          <div className="section-title">We study your process, then build around it.</div>
          <p className="section-sub">No generic templates. We look at exactly where your team loses time and build a system around your actual workflow.</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-content">
              <h3>Discovery call</h3>
              <p>30 minutes to map where your team spends the most time on communication and where AI can take over safely.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-content">
              <h3>We build your system</h3>
              <p>Unified inbox, automated replies, escalation rules, and a control dashboard, all tailored to your workflow.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-content">
              <h3>Your team stays in control</h3>
              <p>Managers review, approve, and intervene anytime. Full visibility into every channel, no black boxes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="outcomes">
        <div className="outcomes-left">
          <div className="section-label">What you get</div>
          <div className="section-title">More time.<br />More clients.<br />More life.</div>
          <div className="outcome-list">
            <div className="outcome-item">Less repetitive reply work</div>
            <div className="outcome-item">Faster response across every channel</div>
            <div className="outcome-item">Full visibility without the manual load</div>
            <div className="outcome-item">More consistent client experience</div>
          </div>
        </div>
        <div className="outcomes-right">
          <div className="section-label">By the numbers</div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-num">7+</div>
              <div className="stat-label">Channels in one inbox</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">24/7</div>
              <div className="stat-label">Coverage, always on</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">&lt;1 min</div>
              <div className="stat-label">Average response time</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">0</div>
              <div className="stat-label">Messages missed</div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-band" id="contact">
        <h2>Let's see where your team is losing time.</h2>
        <p>Tell us what your team spends too much time on. We'll take it from there.</p>
        <div className="hero-cta">
          <a href="mailto:hello@unboks.org" className="btn-primary">Book a discovery call</a>
          <a href="mailto:hello@unboks.org" className="btn-ghost">hello@unboks.org</a>
        </div>
      </div>

      <footer>
        <div>
          <div className="footer-brand">Unboks</div>
          <div className="footer-sub">AI communication tools for lean teams.</div>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#how">How it works</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-email">hello@unboks.org</div>
      </footer>

    </div>
  );
}
