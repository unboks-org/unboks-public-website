import Button from '../components/Button';
import Seo from '../components/Seo';

const CHANNELS = ['WhatsApp', 'Instagram', 'Facebook', 'Email', 'X', 'Telegram', 'Messenger'];

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
  { num: '01', title: 'Every message. One inbox.', desc: 'Connect all your channels in minutes. WhatsApp, Instagram, Email — everything lands in one place.' },
  { num: '02', title: 'AI handles the routine.', desc: 'Repetitive questions get answered instantly. Your team never has to type the same reply again.' },
  { num: '03', title: 'You stay in control.', desc: 'Review, adjust, approve — whenever it actually matters. Human oversight, always on.' },
  { num: '04', title: 'More time. More clients.', desc: 'Scale without burning out. Grow without hiring a team of 10.' },
];

export default function HomePage() {
  return (
    <>
      <Seo />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-white pt-16">
        <div className="mx-auto max-w-3xl px-6 pt-14 pb-10 text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
            WTYJ · We Take Your Job
          </p>
          <h1
            className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.04]"
            data-testid="hero-title"
          >
            All your messages.<br />1 Inbox.
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-slate-500"
            data-testid="hero-subtitle"
          >
            Every channel. One place. More time for what matters.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button to="/contact" data-testid="button-hero-cta">Book a strategy call</Button>
            <Button to="/services" variant="secondary" data-testid="button-hero-services">See how it works</Button>
          </div>
        </div>

        {/* Hero image — full width, no overlay, no crop */}
        <div className="w-full" data-testid="hero-panel">
          <img
            src="/wtyj-hero-layout.png"
            alt="We Take Your Job — unified inbox for all your channels"
            className="w-full h-auto"
            loading="eager"
            fetchPriority="high"
            width="1920"
            height="900"
          />
        </div>
      </section>

      {/* ── Channel strip ────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/70 py-5">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Every channel
            </span>
            {CHANNELS.map((c) => (
              <span key={c} className="text-sm font-medium text-slate-600">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="wrap">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-sky-500">Why WTYJ</p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Less noise.<br />More business.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-7 hover:border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <h3 className="mb-2 text-[17px] font-semibold text-slate-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Time / Freedom ───────────────────────────────────────── */}
      <section className="overflow-hidden bg-slate-50">
        <div className="wrap grid items-center gap-0 lg:grid-cols-2">
          {/* Copy side */}
          <div className="py-20 lg:pr-16 order-2 lg:order-1">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-sky-500">Take back your time</p>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 leading-[1.08] sm:text-5xl">
              Live the island life<br />you actually want.
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-slate-500">
              We take the repetitive communication off your hands so you can focus on clients, growth, and the life you actually want.
            </p>
            <p className="mt-3 max-w-md text-base leading-relaxed text-slate-400">
              Smart automation. Human oversight. More time for what matters.
            </p>
            <div className="mt-8">
              <Button to="/contact">Book a strategy call</Button>
            </div>
          </div>

          {/* Photo side */}
          <div className="order-1 lg:order-2 lg:-mr-8">
            <img
              src="/wtyj-hero-photo.jpg"
              alt="Island life — time, freedom, and business growth in Curaçao"
              className="w-full h-auto object-cover rounded-2xl lg:rounded-l-2xl lg:rounded-r-none shadow-sm"
              loading="lazy"
              width="800"
              height="600"
            />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-24" data-testid="section-how">
        <div className="wrap">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-sky-500">How it works</p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Simple. Powerful. Done.
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.num}>
                <p className="mb-3 text-5xl font-bold text-slate-100 tabular-nums leading-none">{s.num}</p>
                <h3 className="mb-2 text-[15px] font-semibold text-slate-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curaçao identity ─────────────────────────────────────── */}
      <section className="bg-sky-50 py-20" data-testid="section-audience">
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
      <section className="bg-white py-28">
        <div className="wrap mx-auto max-w-2xl text-center">
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl leading-[1.06]">
            More time.<br />More clients.<br />More life.
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
