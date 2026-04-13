import Button from '../components/Button';
import Seo from '../components/Seo';

export default function HomePage() {
  return (
    <>
      <Seo />

      {/* ── SECTION 1 — HERO ─────────────────────────────────────── */}
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

      {/* ── SECTION 2 — SUPPORTING BRAND STRIP ───────────────────── */}
      <section className="bg-white py-10 sm:py-14">
        <div className="wrap mx-auto max-w-3xl text-center">
          <p
            className="mb-6 text-lg text-slate-500 sm:text-xl leading-relaxed"
            data-testid="hero-subtitle"
          >
            Less busywork. More business.<br className="hidden sm:inline" />
            {' '}Faster replies. Happier clients.<br className="hidden sm:inline" />
            {' '}Smart automation. Human oversight.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to="/contact" data-testid="button-hero-cta">Get started</Button>
            <Button to="/services" variant="secondary" data-testid="button-hero-services">See how it works</Button>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — SUPPORTING PANELS ────────────────────────── */}
      <section className="bg-slate-50/60 py-16 sm:py-20">
        <div className="wrap">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <img
              src="/wtyj_panel_inbox.png"
              alt="One Inbox. Every Channel. Total Control."
              className="w-full h-auto rounded-2xl"
              width="512"
              height="250"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_busywork.png"
              alt="Less busywork. More business."
              className="w-full h-auto rounded-2xl"
              width="512"
              height="230"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_replies.png"
              alt="Faster replies. Happier clients. Stronger reputation."
              className="w-full h-auto rounded-2xl"
              width="512"
              height="230"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_24_7.png"
              alt="24/7 coverage. Every hour. Every day."
              className="w-full h-auto rounded-2xl sm:col-span-1 lg:col-start-1"
              width="512"
              height="250"
              loading="lazy"
            />
            <img
              src="/wtyj_panel_languages.png"
              alt="All languages. One system."
              className="w-full h-auto rounded-2xl"
              width="512"
              height="250"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — FINAL CTA ────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="wrap mx-auto max-w-2xl text-center">
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 leading-[1.1] sm:text-4xl lg:text-5xl">
            More time. More clients.<br />More life.
          </h2>
          <p className="mb-8 text-lg text-slate-500">
            All your messages. 1 Inbox. More time for what matters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to="/contact">Get started</Button>
            <Button to="/services" variant="secondary">See how it works</Button>
          </div>
        </div>
      </section>
    </>
  );
}
