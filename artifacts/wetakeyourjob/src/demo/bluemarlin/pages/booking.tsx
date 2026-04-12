import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BOAT_RESOURCES, TRIP_PACKAGES } from '@demo/config/resources';

const initialBoat = BOAT_RESOURCES[0]?.id ?? '';
const initialTrip = TRIP_PACKAGES[0]?.id ?? '';
const initialDuration = parseFloat(TRIP_PACKAGES[0]?.duration) || 4;

export default function BookingPage() {
  const [form, setForm] = useState({
    boat: initialBoat,
    trip_id: initialTrip,
    date: '',
    start_time: '09:00',
    duration_hours: initialDuration,
    pax: 4,
    customer_name: '',
    contact: ''
  });

  const [checking, setChecking] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<ResultState | null>(null);
  const [bookingResult, setBookingResult] = useState<ResultState | null>(null);

  const selectedTrip = useMemo(
    () => TRIP_PACKAGES.find((trip) => trip.id === form.trip_id) ?? TRIP_PACKAGES[0],
    [form.trip_id]
  );

  useEffect(() => {
    if (!selectedTrip) return;
    setForm((prev) => ({ ...prev, duration_hours: parseFloat(selectedTrip.duration) || 4 }));
  }, [selectedTrip?.id]);

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validateReserveFields() {
    if (!form.date) return 'Date is required.';
    if (!form.customer_name.trim()) return 'Customer name is required.';
    if (!form.contact.trim()) return 'Contact is required.';
    if (Number(form.pax) < 1) return 'Pax must be at least 1.';
    return null;
  }

  async function handleCheckAvailability() {
    if (!form.date) {
      setAvailabilityResult({ type: 'error', title: 'Missing Date', message: 'Date is required.' });
      return;
    }

    setChecking(true);
    setAvailabilityResult(null);

    const payload = {
      boat: form.boat,
      date: form.date,
      start_time: form.start_time,
      duration_hours: Number(form.duration_hours)
    };

    try {
      const res = await fetch('/api/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const response = await res.json();

      if (response?.available === true) {
        setAvailabilityResult({ type: 'success', title: 'Available', response });
      } else if (response?.available === false) {
        setAvailabilityResult({
          type: 'error',
          title: 'Not Available',
          response,
          conflictsCount: Array.isArray(response.conflicts) ? response.conflicts.length : 0
        });
      } else {
        setAvailabilityResult({
          type: 'error',
          title: 'Availability Check Failed',
          message: response?.error || 'Unexpected response from backend.',
          response
        });
      }
    } catch {
      setAvailabilityResult({
        type: 'error',
        title: 'Network Error',
        message: 'Backend unreachable — check tunnel + API_BASE_URL'
      });
    } finally {
      setChecking(false);
    }
  }

  async function handleReserveHold() {
    const validationError = validateReserveFields();
    if (validationError) {
      setBookingResult({ type: 'error', title: 'Validation Error', message: validationError });
      return;
    }

    setReserving(true);
    setBookingResult(null);

    const payload = {
      customer_name: form.customer_name,
      contact: form.contact,
      trip_type: selectedTrip?.name || 'Private Charter',
      boat: form.boat,
      date: form.date,
      start_time: form.start_time,
      duration_hours: Number(form.duration_hours),
      pax: Number(form.pax),
      price_quote: `${selectedTrip?.price || 0} USD`,
      status: 'pending'
    };

    try {
      const res = await fetch('/api/process-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const response = await res.json();

      if (response?.success === true) {
        setBookingResult({
          type: 'success',
          title: 'Hold Created',
          message: `Event ID: ${response.event_id || 'N/A'}`,
          response
        });
      } else {
        setBookingResult({
          type: 'error',
          title: 'Booking Failed',
          message: response?.error || 'Unexpected error.',
          response,
          stage: response?.stage
        });
      }
    } catch {
      setBookingResult({
        type: 'error',
        title: 'Network Error',
        message: 'Backend unreachable — check tunnel + API_BASE_URL'
      });
    } finally {
      setReserving(false);
    }
  }

  const selectedBoat = BOAT_RESOURCES.find((b) => b.id === form.boat);

  return (
    <section className="demo-section-shell py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Booking Desk</p>
        <h1 className="mt-3 font-serif text-4xl text-foreground" data-testid="text-booking-title">Reserve Your Charter</h1>
        <p className="mt-4 text-muted-foreground">
          Select your vessel, trip package, date, and group size. Then check availability or place a hold.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-7 rounded-md border border-border bg-card p-7 md:p-9">
          <h2 className="text-lg font-semibold text-foreground">Trip Details</h2>

          <Field label="Vessel">
            <select
              className="demo-input"
              value={form.boat}
              onChange={(e) => updateField('boat', e.target.value)}
              data-testid="select-boat"
            >
              {BOAT_RESOURCES.map((b) => (
                <option key={b.id} value={b.id}>{b.name} (cap. {b.capacity})</option>
              ))}
            </select>
          </Field>

          <Field label="Trip Package">
            <select
              className="demo-input"
              value={form.trip_id}
              onChange={(e) => updateField('trip_id', e.target.value)}
              data-testid="select-trip"
            >
              {TRIP_PACKAGES.map((t) => (
                <option key={t.id} value={t.id}>{t.name} — ${t.price} ({t.duration})</option>
              ))}
            </select>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date">
              <input
                type="date"
                className="demo-input"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
                data-testid="input-date"
              />
            </Field>
            <Field label="Start Time">
              <input
                type="time"
                className="demo-input"
                value={form.start_time}
                onChange={(e) => updateField('start_time', e.target.value)}
                data-testid="input-start-time"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Duration (hours)">
              <input
                type="number"
                className="demo-input bg-muted/50"
                value={form.duration_hours}
                readOnly
                data-testid="input-duration"
              />
            </Field>
            <Field label="Guests (pax)">
              <input
                type="number"
                className="demo-input"
                min={1}
                max={selectedBoat?.capacity || 20}
                value={form.pax}
                onChange={(e) => updateField('pax', parseInt(e.target.value) || 1)}
                data-testid="input-pax"
              />
            </Field>
          </div>

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            onClick={handleCheckAvailability}
            disabled={checking}
            data-testid="button-check-availability"
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {checking ? 'Checking...' : 'Check Availability'}
          </button>

          <div className="border-t border-border pt-7">
            <h2 className="text-lg font-semibold text-foreground">Guest Information</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Customer Name">
              <input
                type="text"
                className="demo-input"
                placeholder="Full name"
                value={form.customer_name}
                onChange={(e) => updateField('customer_name', e.target.value)}
                data-testid="input-customer-name"
              />
            </Field>
            <Field label="Contact (email / phone)">
              <input
                type="text"
                className="demo-input"
                placeholder="Email or phone"
                value={form.contact}
                onChange={(e) => updateField('contact', e.target.value)}
                data-testid="input-contact"
              />
            </Field>
          </div>

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50"
            onClick={handleReserveHold}
            disabled={reserving}
            data-testid="button-reserve-hold"
          >
            {reserving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {reserving ? 'Creating Hold...' : 'Reserve Hold'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-border bg-card p-7">
            <h2 className="text-lg font-semibold text-foreground">Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <SummaryRow label="Trip" value={selectedTrip?.name || ''} />
              <SummaryRow label="Vessel" value={selectedBoat?.name || ''} />
              <SummaryRow label="Duration" value={`${form.duration_hours} hours`} />
              <SummaryRow label="Guests" value={String(form.pax)} />
              <SummaryRow label="Date" value={form.date || '\u2014'} />
              <SummaryRow label="Time" value={form.start_time} />
            </div>
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="mt-1 text-3xl font-bold text-foreground" data-testid="text-price">${selectedTrip?.price || 0} <span className="text-base font-normal text-muted-foreground">USD</span></p>
            </div>
          </div>

          <StatusCard title="Availability Response" result={availabilityResult} mode="availability" />
          <StatusCard title="Booking Response" result={bookingResult} mode="booking" />
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function StatusCard({ title, result, mode }: { title: string; result: ResultState | null; mode: 'availability' | 'booking' }) {
  if (!result) {
    return (
      <article className="rounded-md border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">No response yet.</p>
      </article>
    );
  }

  const tone = result.type === 'success'
    ? 'border-emerald-200 bg-emerald-50'
    : 'border-red-200 bg-red-50';

  return (
    <article className={`rounded-md border ${tone} p-6`} data-testid={`card-status-${mode}`}>
      <h2 className="font-semibold text-foreground">{result.title}</h2>
      {result.message && <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>}

      {mode === 'availability' && result.response?.available === true && (
        <p className="mt-3 text-sm font-semibold text-emerald-700">Available</p>
      )}
      {mode === 'availability' && result.response?.available === false && (
        <p className="mt-3 text-sm font-semibold text-red-700">Not Available. Conflicts: {result.conflictsCount ?? 0}</p>
      )}
      {mode === 'booking' && result.response?.success === true && (
        <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-sm font-semibold text-emerald-700">Hold Created</p>
          <p className="mt-1 text-lg font-bold text-emerald-900" data-testid="text-event-id">event_id: {(result.response?.event_id as string) || 'N/A'}</p>
        </div>
      )}
      {mode === 'booking' && result.response?.success === false && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p>Error: {(result.response?.error as string) || result.message || 'Unknown error'}</p>
          <p className="mt-1">Stage: {(result.response?.stage as string) || result.stage || 'n/a'}</p>
        </div>
      )}
    </article>
  );
}

interface ResultState {
  type: 'success' | 'error';
  title: string;
  message?: string;
  response?: Record<string, unknown>;
  conflictsCount?: number;
  stage?: string;
}
