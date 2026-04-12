import { Link } from 'react-router-dom';
import {
  Anchor,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Compass,
  Crown,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Waves
} from 'lucide-react';
import heroImage from '@assets/Klein-Curacao-beach-via-Canva.jpg_1775488974762.webp';
import { TRIP_PACKAGES } from '@demo/config/resources';

const PREFIX = '/demo/bluemarlin';

const badges: Record<string, { label: string; color: string }> = {
  'klein-curacao': { label: 'Most Popular', color: 'bg-amber-500 text-white' },
  'sunset-cruise': { label: 'Luxury', color: 'bg-gradient-to-r from-amber-600 to-amber-500 text-white' },
  'west-coast-beach': { label: 'Explorer', color: 'bg-primary text-white' },
  'snorkeling-trip': { label: 'Adventure', color: 'bg-emerald-600 text-white' },
  'jet-ski-excursion': { label: 'Thrill', color: 'bg-rose-500 text-white' }
};

const featuredIds = ['klein-curacao', 'sunset-cruise', 'west-coast-beach'];
const featuredPackages = TRIP_PACKAGES.filter((t) => featuredIds.includes(t.id));

const stats = [
  { value: '2,500+', label: 'Happy Guests', icon: Users },
  { value: '5', label: 'Unique Experiences', icon: Compass },
  { value: '4.9', label: 'Average Rating', icon: Star },
  { value: '365', label: 'Days of Sunshine', icon: Sparkles }
];

const faqs = [
  {
    q: 'What should guests bring?',
    a: 'Swimwear, reef-safe sunscreen, and a light layer. Chilled drinks and snorkel sets are included.'
  },
  { q: 'Are children allowed?', a: 'Yes. Family-friendly routes include child-size life vests and calm-water stops.' },
  { q: 'What is your weather policy?', a: 'If marine conditions are unsafe, we provide reschedule or full refund options.' },
  { q: 'Where is the meeting point?', a: 'Handelskade 14, Willemstad. Final boarding details are sent 24h prior.' }
];

export default function HomePage() {
  return (
    <div>
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Luxury catamaran in turquoise Caribbean waters near Curaçao"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        <div className="demo-section-shell relative z-10 py-32">
          <div className="max-w-2xl space-y-8" style={{ animation: 'demo-fadeup .8s cubic-bezier(.22,1,.36,1)' }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                Premium Charter Experiences
              </span>
            </div>
            <h1 className="font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-[5.5rem]" data-testid="text-hero-title">
              Charter Your Perfect Day in{' '}
              <span className="italic">Curaçao</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-white/80" style={{ animation: 'demo-fadeup .8s cubic-bezier(.22,1,.36,1) .15s both' }}>
              Catamarans, yachts, and private RIB experiences with frictionless booking. Departing daily from Willemstad.
            </p>
            <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center" style={{ animation: 'demo-fadeup .8s cubic-bezier(.22,1,.36,1) .3s both' }}>
              <Link
                to={`${PREFIX}/book`}
                data-testid="link-hero-booking"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-9 py-4 text-sm font-bold uppercase tracking-wider text-foreground shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(0,0,0,.3)] sm:w-auto"
              >
                Check Availability
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to={`${PREFIX}/trips`}
                data-testid="link-hero-trips"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-9 py-4 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/10 sm:w-auto"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative -mt-1 border-b border-border/50 bg-background">
        <div className="demo-section-shell grid grid-cols-2 gap-6 py-12 md:grid-cols-4 md:py-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="demo-section-shell grid gap-px md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Licensed & Insured', text: 'Certified crew with full vessel insurance coverage' },
            { icon: Waves, title: 'Daily Departures', text: 'Multiple sailings every day from Handelskade, Willemstad' },
            { icon: BadgeCheck, title: 'Instant Confirmation', text: 'Real-time availability with immediate booking confirmation' }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4 bg-background px-8 py-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="demo-section-shell py-24 md:py-32">
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">Our Packages</span>
            <div className="h-px w-8 bg-amber-400" />
          </div>
          <h2 className="mx-auto max-w-xl font-serif text-3xl text-foreground md:text-5xl">
            Curated experiences for every occasion
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Hand-picked charter experiences designed for unforgettable moments on the Caribbean Sea.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {featuredPackages.map((pkg, i) => {
            const badge = badges[pkg.id];
            return (
              <article
                key={pkg.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                data-testid={`card-package-${pkg.id}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className={`absolute left-4 top-4 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-lg ${badge.color}`}>
                    {badge.label}
                  </span>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/80" />
                    <span className="text-xs font-medium text-white/90">{pkg.duration}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-sm font-medium text-muted-foreground">from</span>
                    <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                    <span className="text-sm text-muted-foreground">/ person</span>
                  </div>
                  <div className="my-5 h-px bg-border/60" />
                  <ul className="flex-1 space-y-2.5">
                    {pkg.includes.slice(0, 3).map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`${PREFIX}/book`}
                    data-testid={`link-package-book-${pkg.id}`}
                    className={`mt-7 block w-full rounded-xl py-3 text-center text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                      i === 0
                        ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30'
                        : 'border border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    Book Now
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Link
            to={`${PREFIX}/trips`}
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary transition hover:gap-3"
            data-testid="link-view-all-trips"
          >
            Explore all experiences <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-muted/60 via-muted/30 to-background py-24 md:py-32">
        <div className="demo-section-shell grid items-center gap-16 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-px w-8 bg-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">About BlueMarlin</span>
            </div>
            <h2 className="font-serif text-3xl text-foreground md:text-5xl">
              Luxury hospitality, precise operations
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              BlueMarlin Tours Curaçao is a fictional brand created for a live marketing and automation demonstration.
              The design mirrors premium Caribbean charter experiences with conversion-first UX patterns.
            </p>
            <div className="mt-8 flex items-center gap-4 rounded-xl border border-amber-200/60 bg-amber-50/50 px-5 py-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="h-5 w-px bg-amber-200" />
              <div>
                <span className="text-lg font-bold text-foreground">4.9</span>
                <span className="ml-1.5 text-sm text-muted-foreground">guest score from demo storytelling</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-lg md:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">What this demo proves</h3>
            </div>
            <ul className="space-y-5">
              {[
                { icon: MessageCircle, text: 'Website can pre-qualify leads in under 60 seconds.' },
                { icon: Anchor, text: 'Agents can check real-time slot conflicts through proxy API.' },
                { icon: BadgeCheck, text: 'Sales reps can create holds without exposing backend keys.' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.text} className="flex items-start gap-4 text-sm leading-relaxed text-muted-foreground">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="pt-1">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="demo-section-shell py-24 md:py-32">
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">FAQ</span>
            <div className="h-px w-8 bg-amber-400" />
          </div>
          <h2 className="font-serif text-3xl text-foreground md:text-5xl" data-testid="text-faq-title">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Everything you need to know before your charter experience.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          {faqs.map((item) => (
            <article key={item.q} className="group rounded-2xl border border-border/60 bg-card p-7 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
              <h3 className="font-semibold text-foreground">{item.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-28" data-testid="section-ready-to-book">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-teal-700" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,.2) 0%, transparent 50%)' }} />
        <div className="demo-section-shell relative z-10 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-white/40" />
            <Crown className="h-4 w-4 text-amber-300" />
            <div className="h-px w-8 bg-white/40" />
          </div>
          <h2 className="font-serif text-3xl text-white md:text-5xl">
            Ready to set sail?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/80">
            Pick your vessel, choose a date, and lock in your charter in minutes.
          </p>
          <Link
            to={`${PREFIX}/book`}
            data-testid="link-ready-to-book"
            className="group mt-10 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-12 py-4 text-sm font-bold uppercase tracking-wider text-primary shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(0,0,0,.25)] sm:w-auto"
          >
            Open Booking <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
