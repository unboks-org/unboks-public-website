import Button from '../components/Button';
import Seo from '../components/Seo';

const BENEFITS = [
  {
    title: 'One Inbox. Every Channel.',
    desc: 'WhatsApp, Instagram, Email, Facebook, X, Messenger — all in one place. No switching tabs. No missing customers.',
  },
  {
    title: 'Less Busywork. More Business.',
    desc: 'Stop answering the same questions 30 times a day. We handle the repetitive work so you handle the real work.',
  },
  {
    title: 'Faster Replies. Happier Clients.',
    desc: 'Customers get instant, accurate responses around the clock. Your reputation improves automatically.',
  },
  {
    title: 'Smart Automation. Human Oversight.',
    desc: 'AI drafts the replies. Your team reviews what matters. You stay in control — always.',
  },
  {
    title: 'Proudly Based in Curaçao.',
    desc: 'Built here. Built for here. Island mindset. Global standards. Local pride.',
  },
];

const STEPS = [
  { num: '01', title: 'Connect your channels', desc: 'WhatsApp, Instagram, Email — everything lands in one inbox. Setup takes minutes.' },
  { num: '02', title: 'AI handles the routine', desc: 'Repetitive questions get answered instantly. Your team never types the same reply again.' },
  { num: '03', title: 'You stay in control', desc: 'Review, adjust, approve — whenever it matters. Human oversight, always on.' },
  { num: '04', title: 'Scale without burnout', desc: 'More clients, same team. Grow without hiring a team of 10.' },
];

export default function HomePage() {
  return (
    <>
      <Seo />

      {/* ── Hero — bright banner, top portion only ───────────────── */}
      <section className="relative w-full overflow-hidden bg-sky-50" data-testid="hero-panel">
        <h1 className="sr-only" data-testid="hero-title">All your messages. 1 Inbox.</h1>
        <img
          src="/a_bright_clean_promotional_hero_banner_compositio.png"
          alt="All your messages. 1 Inbox. — unified inbox across every channel"
          className="w-full h-[50vw] min-h-[400px] max-h-[620px] object-cover object-[center_top]"
          loading="eager"
          fetchPriority="high"
        />
      </section>

      {/* ── CTA bar below hero ───────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-8">
        <div className="wrap text-center">
          <p
            className="mb-4 text-lg text-slate-500 sm:text-xl"
            data-testid="hero-subtitle"
          >
            AI tools that handle emails, DMs, and messages. Your team stays in control.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to="/contact" data-testid="button-hero-cta">Book a strategy call</Button>
            <Button to="/services" variant="secondary" data-testid="button-hero-services">See how it works</Button>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="wrap">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-sky-500">Why WTYJ</p>
            <h2
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Less noise. More business.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-7 transition-colors hover:border-slate-200 hover:bg-slate-50"
              >
                <h3 className="mb-2 text-[17px] font-semibold text-slate-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature showcase — professional composite cards ─────── */}
      <section className="relative w-full overflow-hidden border-y border-slate-100 bg-slate-50">
        <img
          src="/a_clean_professional_marketing_composite_layout_w.png"
          alt="Feature cards — 24/7 coverage, multilingual, total control, faster replies, less busywork, smart automation"
          className="w-full h-[35vw] min-h-[280px] max-h-[440px] object-cover object-[center_bottom]"
          loading="lazy"
        />
      </section>

      {/* ── Time / Freedom ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50 py-20 lg:py-28">
        <div className="wrap relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-sky-500">Take back your time</p>
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 leading-[1.1] sm:text-4xl lg:text-5xl">
            Live the island life<br />you actually want.
          </h2>
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-slate-500">
            We take the repetitive communication off your hands so you can focus on clients, growth, and the life you moved here for.
          </p>
          <div className="mt-8">
            <Button to="/contact">Book a strategy call</Button>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20" data-testid="section-how">
        <div className="wrap">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-sky-500">How it works</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Simple. Powerful. Done.
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.num}>
                <p className="mb-3 text-5xl font-bold tabular-nums leading-none text-slate-200">{s.num}</p>
                <h3 className="mb-2 text-[15px] font-semibold text-slate-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark tech showcase — full dramatic section ──────────── */}
      <section className="relative w-full overflow-hidden bg-slate-950">
        <img
          src="/a_dark_high_contrast_tech_marketing_montage_con.png"
          alt="Technology — one inbox, every channel, total control"
          className="mx-auto w-full max-w-[1400px] h-auto"
          loading="lazy"
        />
      </section>

      {/* ── Curaçao identity ─────────────────────────────────────── */}
      <section className="bg-sky-50 py-16" data-testid="section-audience">
        <div className="wrap mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-sky-500">Where we're from</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Proudly based in Curaçao.
          </h2>
          <p className="text-lg leading-relaxed text-slate-500">
            Island mindset. Global standards. Local pride.<br />
            We build tools that match the way businesses here actually work.
          </p>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="wrap mx-auto max-w-2xl text-center">
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.06]">
            More time. More clients.<br />More life.
          </h2>
          <p className="mb-8 text-lg text-slate-500">
            Stop drowning in messages. Start growing with the same team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to="/contact">Book a strategy call</Button>
            <Button to="/services" variant="secondary">See how it works</Button>
          </div>
        </div>
      </section>
    </>
  );
}
