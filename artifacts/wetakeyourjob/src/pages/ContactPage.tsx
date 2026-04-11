import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import Seo from '../components/Seo';

const fields = [
  { label: 'Name', type: 'text', placeholder: 'Your name' },
  { label: 'Company', type: 'text', placeholder: 'Your company' },
  { label: 'Email', type: 'email', placeholder: 'you@company.com' },
  { label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
];

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact"
        description="Contact We Take Your Job to discuss AI communication tools, workflow analysis, and strategy-call availability."
      />

      <PageHeader
        badge="Contact"
        title="Let's look at where your team is losing time."
        description="Tell us where repetitive communication is slowing your business down. We'll use that to frame the conversation."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-6 sm:p-8">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.label} className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">{field.label}</span>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-glow/50 focus:bg-white/[0.06]"
                    />
                  </label>
                ))}
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  What does your team spend too much time on?
                </span>
                <textarea
                  rows={6}
                  placeholder="Email follow-up, WhatsApp replies, Instagram DMs, lead qualification, scheduling, repeated customer questions..."
                  className="w-full rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-glow/50 focus:bg-white/[0.06]"
                />
              </label>

              <Button type="submit" className="w-full sm:w-auto">
                Submit
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="panel p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-glow">Strategy call</p>
              <h2 className="mt-4 text-3xl font-semibold">See where time can be recovered first.</h2>
              <p className="mt-4 text-sm leading-7">
                We'll review your communication workflow, spot repetitive load, and outline where a
                controlled AI layer can make the biggest impact.
              </p>
              <div className="mt-8 space-y-3 text-sm text-slate-200">
                <p>30-minute discovery conversation</p>
                <p>Focused on message volume, follow-up, and visibility gaps</p>
                <p>Clear next-step recommendation</p>
              </div>
              <Button href="mailto:hello@wetakeyourjob.com" variant="secondary" className="mt-8">
                Email us directly
              </Button>
            </div>

            <div className="panel p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Direct contact</p>
              <div className="mt-4 space-y-2 text-sm text-slate-200">
                <p>hello@wetakeyourjob.com</p>
                <p>wetakeyourjob.com</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
