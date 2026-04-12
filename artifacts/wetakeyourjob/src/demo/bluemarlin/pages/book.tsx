import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Loader2, Ship, Users, Mail, Phone, User } from 'lucide-react';
import { TRIP_PACKAGES } from '@demo/config/resources';
import { apiRequest } from '@demo/lib/queryClient';

const PREFIX = '/demo/bluemarlin';

export default function BookPage() {
  const [selectedTrip, setSelectedTrip] = useState('');
  const [date, setDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const trip = TRIP_PACKAGES.find((t) => t.id === selectedTrip);
  const total = trip ? trip.price * adults + (trip.priceKids ?? 0) * kids : 0;

  const canSubmit = selectedTrip && date && adults >= 1 && firstName && lastName && email && !sending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !trip) return;
    setSending(true);
    try {
      await apiRequest('POST', '/api/submit-booking', {
        tripName: trip.name,
        date,
        adults,
        kids,
        total,
        firstName,
        lastName,
        email,
        phone,
        notes,
        duration: trip.duration,
        priceAdult: trip.price,
        priceKid: trip.priceKids
      });
    } catch {
    }
    setSubmitted(true);
    setSending(false);
  }

  if (submitted) {
    return (
      <div className="demo-section-shell py-20 md:py-28">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Ship className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl text-foreground" data-testid="text-book-confirmation">
            Booking Request Sent!
          </h1>
          <p className="mt-4 text-muted-foreground">
            Thank you, {firstName}! We've received your request for the <strong>{trip?.name}</strong> on{' '}
            <strong>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
            We'll confirm availability and send details to <strong>{email}</strong> shortly.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">This is a demo — no real booking was made.</p>
          <Link
            to={`${PREFIX}/`}
            data-testid="link-book-back-home"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="demo-section-shell py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <Link
            to={`${PREFIX}/`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            data-testid="link-book-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="mt-4 font-serif text-4xl text-foreground md:text-5xl" data-testid="text-book-title">
            Book your trip
          </h1>
          <p className="mt-2 text-muted-foreground">Fill in the details below and we'll confirm your charter.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
              <Ship className="h-4 w-4 text-primary" /> Select your trip
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {TRIP_PACKAGES.map((pkg) => (
                <label
                  key={pkg.id}
                  data-testid={`radio-trip-${pkg.id}`}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    selectedTrip === pkg.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="trip"
                    value={pkg.id}
                    checked={selectedTrip === pkg.id}
                    onChange={() => setSelectedTrip(pkg.id)}
                    className="mt-1 accent-[hsl(190,80%,38%)]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{pkg.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{pkg.duration} · {pkg.schedule}</p>
                    <p className="mt-1 text-sm font-bold text-primary">${pkg.price}<span className="font-normal text-muted-foreground"> / adult</span></p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" /> Date & Guests
            </legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-foreground">Preferred Date</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="demo-input"
                  data-testid="input-date"
                />
              </div>
              <div>
                <label htmlFor="adults" className="mb-1.5 block text-sm font-medium text-foreground">Adults</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg font-bold transition" data-testid="button-adults-minus">−</button>
                  <span className="w-8 text-center text-sm font-semibold text-foreground" data-testid="text-adults-count">{adults}</span>
                  <button type="button" onClick={() => setAdults(Math.min(20, adults + 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg font-bold transition" data-testid="button-adults-plus">+</button>
                </div>
              </div>
              <div>
                <label htmlFor="kids" className="mb-1.5 block text-sm font-medium text-foreground">Kids</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setKids(Math.max(0, kids - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg font-bold transition" data-testid="button-kids-minus">−</button>
                  <span className="w-8 text-center text-sm font-semibold text-foreground" data-testid="text-kids-count">{kids}</span>
                  <button type="button" onClick={() => setKids(Math.min(10, kids + 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg font-bold transition" data-testid="button-kids-plus">+</button>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
              <User className="h-4 w-4 text-primary" /> Your Details
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-foreground">First Name</label>
                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="demo-input" data-testid="input-first-name" />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-foreground">Last Name</label>
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="demo-input" data-testid="input-last-name" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="demo-input" data-testid="input-email" />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">Phone (optional)</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="demo-input" data-testid="input-phone" />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-foreground">Special Requests (optional)</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Birthday celebration, dietary requirements, etc." className="demo-input resize-none" data-testid="input-notes" />
            </div>
          </fieldset>

          {trip && (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-6" data-testid="section-price-summary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Total</p>
                  <p className="text-sm text-muted-foreground">
                    {adults} adult{adults !== 1 ? 's' : ''} × ${trip.price}
                    {kids > 0 && <> + {kids} kid{kids !== 1 ? 's' : ''} × ${trip.priceKids}</>}
                  </p>
                </div>
                <p className="text-3xl font-bold text-foreground" data-testid="text-total-price">${total}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            data-testid="button-submit-booking"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit Booking Request <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
