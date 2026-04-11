import { Activity, BriefcaseBusiness, ChartNoAxesCombined, Inbox, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import CTASection from '../components/CTASection';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import Seo from '../components/Seo';
import { services } from '../data/siteContent';

const serviceIcons = [BriefcaseBusiness, Inbox, ChartNoAxesCombined, Activity];

const outcomes = [
  'Less repetitive reply work',
  'Faster response coverage across channels',
  'More consistency without losing oversight',
];

const controls = [
  'Review queues for sensitive conversations',
  'Escalation rules when a person is needed',
  'Full visibility into message volume and follow-up',
];

export default function ServicesPage() {
  return (
    <>
      <Seo title="Services" description="AI communication systems, unified inboxes, and control dashboards for small business teams." />

      <PageHeader
        eyebrow="Services"
        title="Communication systems built around your workflow."
        subtitle="We focus on what slows your team down: repetitive replies, scattered channels, and lack of visibility."
        actions={<Button to="/contact">Get started</Button>}
      />

      <Section id="services" title="What we build">
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6" data-testid={`service-detail-${i}`}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                  <Icon size={18} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.brief}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <section className="border-y border-slate-100 py-20 sm:py-28 bg-slate-50/50" data-testid="section-control">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Human in the loop</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-8">Your team stays in control.</h2>
            <div className="space-y-4">
              {controls.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ShieldCheck size={16} className="mt-0.5 text-slate-400 shrink-0" />
                  <p className="text-sm text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Outcomes</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-8">What you get.</h2>
            <div className="space-y-4">
              {outcomes.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-white px-5 py-4" data-testid={`outcome-${item.replace(/\W/g, '')}`}>
                  <p className="text-sm font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Let's look at where your team is losing time." />
    </>
  );
}
