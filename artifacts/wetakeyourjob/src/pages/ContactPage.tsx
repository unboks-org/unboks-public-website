import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import Seo from '../components/Seo';

export default function ContactPage() {
  return (
    <>
      <Seo title="Contact" description="Get in touch to discuss AI communication tools for your team." />

      <PageHeader
        eyebrow="Contact"
        title="Let's see where your team is losing time."
        subtitle="Tell us what your team spends too much time on. We'll take it from there."
      />

      <section className="pb-24 sm:pb-32" data-testid="section-contact-form">
        <div className="wrap grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()} data-testid="contact-form">
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { label: 'Name', type: 'text', placeholder: 'Your name', id: 'name' },
                { label: 'Company', type: 'text', placeholder: 'Your company', id: 'company' },
                { label: 'Email', type: 'email', placeholder: 'you@company.com', id: 'email' },
                { label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000', id: 'phone' },
              ].map((f) => (
                <label key={f.id} className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</span>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    data-testid={`input-${f.id}`}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </label>
              ))}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">What does your team spend too much time on?</span>
              <textarea
                rows={5}
                placeholder="Email follow-up, WhatsApp replies, DMs, repeated customer questions..."
                data-testid="input-message"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              />
            </label>

            <Button type="submit" data-testid="button-submit">Send message</Button>
          </form>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6" data-testid="card-strategy-call">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-3">Strategy call</p>
              <h3 className="text-lg font-semibold text-slate-900">30-minute discovery call</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">We review your communication workflow and identify where AI can save the most time.</p>
              <Button href="mailto:hello@wetakeyourjob.com" variant="secondary" className="mt-5" data-testid="button-email">Email us directly</Button>
            </div>

            <div className="rounded-2xl border border-slate-100 p-6" data-testid="card-direct-contact">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-3">Direct</p>
              <p className="text-sm text-slate-600">hello@wetakeyourjob.com</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
