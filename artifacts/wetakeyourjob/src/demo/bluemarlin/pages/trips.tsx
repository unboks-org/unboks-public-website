import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { TRIP_PACKAGES } from '@demo/config/resources';

const PREFIX = '/demo/bluemarlin';

export default function TripsPage() {
  return (
    <div>
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="demo-section-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Curated Experiences</p>
            <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl" data-testid="text-trips-title">
              Boat Trips Curaçao
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the best day trips on the water with BlueMarlin Tours. From the crystal-clear waters of Klein Curaçao to vibrant marine life and stunning sunsets — discover the adventure that awaits you.
            </p>
          </div>
        </div>
      </section>

      <section className="demo-section-shell py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {TRIP_PACKAGES.map((trip) => (
            <article
              key={trip.id}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition duration-300 hover:shadow-xl"
              data-testid={`card-trip-${trip.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute right-3 top-3 rounded-md bg-white/90 px-3 py-1.5 text-sm font-bold text-foreground shadow-sm backdrop-blur-sm">
                  ${trip.price} <span className="text-xs font-normal text-muted-foreground">USD</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-semibold text-foreground">{trip.name}</h2>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {trip.duration}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-primary" /> {trip.schedule}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {trip.location}</span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{trip.description}</p>

                <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                  {trip.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">
                    {trip.priceKids !== null && (
                      <span>Kids: ${trip.priceKids} USD</span>
                    )}
                  </div>
                  <Link
                    to={`${PREFIX}/book`}
                    data-testid={`link-book-${trip.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Book Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 md:py-20">
        <div className="demo-section-shell text-center">
          <h2 className="font-serif text-3xl text-white md:text-4xl">Free Cancellation</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Cancel up to 48 hours in advance for a full refund. Live availability — book online 24/7.
          </p>
          <Link
            to={`${PREFIX}/book`}
            data-testid="link-trips-cta"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-10 py-3.5 text-sm font-semibold text-primary shadow-lg transition hover:shadow-xl"
          >
            Check Availability <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
