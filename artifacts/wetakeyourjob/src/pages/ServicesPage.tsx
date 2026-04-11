import {
  Activity,
  ArrowRight,
  Blend,
  LayoutDashboard,
  MessageCircleMore,
  ShieldCheck,
} from 'lucide-react';
import Button from '../components/Button';
import CTASection from '../components/CTASection';
import InfoCard from '../components/InfoCard';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import Seo from '../components/Seo';
import { serviceHighlights, services } from '../data/siteContent';

const icons = [MessageCircleMore, Blend, LayoutDashboard, Activity];

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Services"
        description="Explore AI communication systems, unified inbox workflows, dashboard control, workflow analysis, and human-in-the-loop operations."
      />

      <PageHeader
        badge="Services"
        title="Communication systems built around your workflow, not dropped on top of it."
        description="We focus on repetitive communication work, operational friction, response speed, and manager visibility so your team can move faster without losing control."
        actions={
          <>
            <Button to="/contact">Book a strategy call</Button>
            <Button to="/" variant="secondary">
              Back to homepage
            </Button>
          </>
        }
      />

      <Section title="What we build" description="Each engagement is designed to reduce repetitive communication work while keeping humans firmly in control.">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = icons[index];
            return <InfoCard key={service.title} {...service} icon={<Icon size={20} />} />;
          })}
        </div>
      </Section>

      <Section
        title="Human-in-the-loop operations by design"
        description="This is not a blind automation setup. The system is designed so staff and managers can review, intervene, and control the flow whenever context or judgment matters."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="panel p-8">
            <div className="grid gap-4">
              {[
                'Review queues for sensitive or high-value conversations',
                'Escalation rules for cases that need a person immediately',
                'Visibility into message volume, status, and follow-up',
                'Consistent communication rules across channels',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 px-4 py-4">
                  <ShieldCheck className="mt-1 text-glow shrink-0" size={18} />
                  <p className="text-sm leading-7 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-glow">Outcomes</p>
            <div className="mt-5 space-y-5">
              {serviceHighlights.map((item) => (
                <div key={item.title}>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="What clients are really buying" description="A practical operations upgrade, not just software access.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            'Less repetitive reply work',
            'Faster response coverage across channels',
            'More consistency without losing oversight',
          ].map((item) => (
            <div key={item} className="panel flex items-center gap-3 p-5">
              <ArrowRight size={18} className="text-glow shrink-0" />
              <p className="text-sm font-medium text-slate-100">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="If your team is buried in messages, there is a better operating model."
        description="We'll look at your workflow, identify repetitive communication load, and show you where an AI layer can save time without removing human control."
        primary={{ label: 'Book a strategy call', to: '/contact' }}
        secondary={{ label: 'Contact us', to: '/contact' }}
      />
    </>
  );
}
