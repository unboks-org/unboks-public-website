import { Handshake, TimerReset, Waypoints } from 'lucide-react';
import Button from '../components/Button';
import CTASection from '../components/CTASection';
import InfoCard from '../components/InfoCard';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import Seo from '../components/Seo';

export default function AboutPage() {
  return (
    <>
      <Seo title="About" description="AI tools that enhance people, save time, and keep humans in control." />

      <PageHeader
        eyebrow="About"
        title="AI that removes the repetitive work. Not the people."
        subtitle="We build communication tools so your team can focus on the work that actually requires judgment and relationships."
        actions={<Button to="/contact">Get started</Button>}
      />

      <Section id="philosophy" title="How we think about AI.">
        <div className="grid gap-5 sm:grid-cols-3">
          <InfoCard title="Enhance people" description="Help teams save time and respond faster. Not replace them." icon={<Handshake size={18} />} />
          <InfoCard title="Humans in control" description="Managers get dashboard visibility. Staff review and approve." icon={<Waypoints size={18} />} />
          <InfoCard title="Operational focus" description="We target the communication work that silently eats hours every week." icon={<TimerReset size={18} />} />
        </div>
      </Section>

      <section className="border-t border-slate-100 py-20 sm:py-28 bg-slate-50/50" data-testid="section-practice">
        <div className="wrap max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">In practice</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">We study your process, then build around it.</h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            We look at how your business handles inbound messages, follow-up, and cross-channel communication. Then we build an AI layer that reduces the manual load and gives your team a stronger operating system.
          </p>
        </div>
      </section>

      <CTASection title="Let's talk about what AI can do for your team." />
    </>
  );
}
