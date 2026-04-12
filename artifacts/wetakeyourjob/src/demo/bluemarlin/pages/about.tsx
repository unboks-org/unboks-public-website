import { LifeBuoy, Shield, ShipWheel } from 'lucide-react';

const points = [
  {
    icon: Shield,
    title: 'Safety-First Chartering',
    body: 'Crew certifications are current, emergency drills are practiced monthly, and all vessels carry audited safety inventory.'
  },
  {
    icon: ShipWheel,
    title: 'Licensed Local Crew',
    body: 'Our skippers combine navigation expertise with local reef knowledge for smooth, efficient day planning.'
  },
  {
    icon: LifeBuoy,
    title: '11+ Years in Service',
    body: 'BlueMarlin has hosted thousands of private departures for families, events, and corporate groups in Curaçao waters.'
  }
];

export default function AboutPage() {
  return (
    <section className="demo-section-shell py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Our Story</p>
        <h1 className="mt-3 font-serif text-4xl text-foreground" data-testid="text-about-title">Crafted days at sea, handled with precision</h1>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          BlueMarlin Tours Curaçao began as a small coastal guiding crew and evolved into a premium charter collective based in Willemstad.
          We design private itineraries around guest comfort, marine conditions, and local highlights so each journey feels smooth from dock to return.
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {points.map((point) => {
          const Icon = point.icon;
          return (
            <article key={point.title} className="rounded-md border border-border bg-card p-7" data-testid={`card-about-${point.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-foreground">{point.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
