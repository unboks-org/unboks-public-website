import Button from '../components/Button';
import Seo from '../components/Seo';

export default function HomePage() {
  return (
    <>
      <Seo />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="w-full bg-[#edf5fb]" data-testid="hero-panel">
        <h1 className="sr-only" data-testid="hero-title">
          All your messages. 1 Inbox.
        </h1>
        <img
          src="/wtyj_hero_main.png"
          alt="All your messages. 1 Inbox. More time for what matters."
          className="w-full h-auto"
          width="1536"
          height="500"
          loading="eager"
          fetchPriority="high"
        />
      </section>

      {/* ── VALUE PROPOSITION ────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-16">
        <div className="wrap mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Less busywork.</h2>
              <p className="mt-1 text-sm text-slate-500" data-testid="hero-subtitle">More business.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Faster replies.</h2>
              <p className="mt-1 text-sm text-slate-500">Happier clients.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Smart automation.</h2>
              <p className="mt-1 text-sm text-slate-500">Human oversight.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button to="/contact" data-testid="button-hero-cta">Get started</Button>
            <Button to="/services" variant="secondary" data-testid="button-hero-services">See how it works</Button>
          </div>
        </div>
      </section>

      {/* ── PANEL SHOWCASE ───────────────────────────────────────── */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="wrap">
          <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            What we handle for you
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <img
              src="/wtyj_panel_inbox.png"
              alt="One Inbox. Every Channel. Total Control."
              className="w-full h-auto rounded-xl shadow-sm"
              width="512"
              height="250"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_busywork.png"
              alt="Less busywork. More business."
              className="w-full h-auto rounded-xl shadow-sm"
              width="512"
              height="230"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_replies.png"
              alt="Faster replies. Happier clients. Stronger reputation."
              className="w-full h-auto rounded-xl shadow-sm"
              width="512"
              height="230"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_24_7.png"
              alt="24/7 coverage. Every hour. Every day."
              className="w-full h-auto rounded-xl shadow-sm"
              width="512"
              height="250"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_languages.png"
              alt="All languages. One system."
              className="w-full h-auto rounded-xl shadow-sm"
              width="512"
              height="250"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_automation.png"
              alt="Smart automation. Human oversight."
              className="w-full h-auto rounded-xl shadow-sm"
              width="512"
              height="230"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── BIG BRAND STATEMENT ──────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="wrap mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-[1.1] sm:text-5xl lg:text-6xl">
            More time.<br />More clients.<br />More life.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg text-slate-500 leading-relaxed">
            All your messages. 1 Inbox. More time for what matters.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="wrap mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to take back your time?
          </h2>
          <p className="mb-8 text-base text-slate-400">
            Less noise. More business. Let's talk.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to="/contact">Get started</Button>
            <Button to="/services" variant="secondary" className="border-slate-700 text-slate-300 hover:bg-slate-800">See how it works</Button>
          </div>
        </div>
      </section>
    </>
  );
}
