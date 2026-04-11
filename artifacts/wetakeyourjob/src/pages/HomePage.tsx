import {
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Clock3,
  Eye,
  Inbox,
  MessagesSquare,
  ScanSearch,
} from 'lucide-react';
import Badge from '../components/Badge';
import BenefitCard from '../components/BenefitCard';
import Button from '../components/Button';
import CTASection from '../components/CTASection';
import HeroPanel from '../components/HeroPanel';
import InfoCard from '../components/InfoCard';
import Section from '../components/Section';
import Seo from '../components/Seo';
import ServiceCard from '../components/ServiceCard';
import StepCard from '../components/StepCard';
import {
  audiences,
  benefits,
  channels,
  problemPoints,
  services,
  steps,
} from '../data/siteContent';

const icons = [Clock3, MessagesSquare, Inbox, Eye];
const serviceIcons = [BriefcaseBusiness, Inbox, ChartNoAxesCombined, ScanSearch];

export default function HomePage() {
  return (
    <>
      <Seo />

      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="container-shell grid gap-12 lg:grid-cols-[1fr_520px] lg:items-center">
          <div>
            <Badge>Human + AI communication systems</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.04] sm:text-6xl">
              Take 70-80% of repetitive communication off your team's hands.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              We build AI communication tools for small and mid-sized businesses so your team saves
              time, replies faster, and misses fewer opportunities with humans always in control.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/contact">Book a strategy call</Button>
              <Button to="/services" variant="secondary">
                See what we build
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                'Save time across your team',
                'Respond faster across every major channel',
                'Reduce missed leads and lost business',
                'Keep full visibility and human oversight',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-glow" />
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <HeroPanel channels={channels} />
        </div>
      </section>

      <Section
        id="problem"
        eyebrow="The problem"
        title="Small teams lose time and business when communication becomes a full-time job."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {problemPoints.map((point, index) => {
            const Icon = icons[index];
            return (
              <InfoCard
                key={point}
                title={point}
                description="The cost shows up as slower replies, inconsistent follow-up, and internal drag that compounds as message volume grows."
                icon={<Icon size={20} />}
              />
            );
          })}
        </div>
      </Section>

      <Section
        id="what-we-do"
        eyebrow="What we do"
        title="We build AI tools that make your team faster, sharper, and more productive."
        description="We do not sell generic automation for the sake of automation. We study how your company works, identify repetitive manual communication work, and build the right AI system around your team."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = serviceIcons[index];
            return <ServiceCard key={service.title} {...service} icon={<Icon size={20} />} />;
          })}
        </div>
      </Section>

      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="A practical AI layer for real business communication."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={index + 1} {...step} />
          ))}
        </div>
      </Section>

      <Section
        id="who-its-for"
        eyebrow="Who it is for"
        title="Built for small and mid-sized businesses with lean teams."
        description="Especially companies where staff are answering emails, WhatsApp messages, DMs, and customer questions all day long or where slow replies are already costing money."
      >
        <div className="flex flex-wrap gap-3">
          {audiences.map((audience) => (
            <span
              key={audience}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
            >
              {audience}
            </span>
          ))}
        </div>
      </Section>

      <Section
        id="benefits"
        eyebrow="Why it works"
        title="More speed. Better consistency. More output from the same team."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit} title={benefit} index={index + 1} />
          ))}
        </div>
      </Section>

      <Section
        id="difference"
        eyebrow="Differentiator"
        title="Not just another inbox tool."
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel p-8">
            <p className="text-lg leading-8 text-slate-200">
              Most platforms give you software. We go further: we analyze your workflow, we build
              the AI communication layer around your business, and we add the dashboard and control
              structure your team actually needs.
            </p>
            <div className="mt-8 space-y-4">
              {[
                'We analyze how your team actually communicates.',
                'We build around your channels, rules, and real follow-up flow.',
                'We add the oversight layer managers need to stay in control.',
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <ArrowRight className="mt-1 text-glow" size={16} />
                  <p className="text-sm leading-7 text-slate-300">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-8">
            <div className="grid gap-4">
              {[
                ['Generic SaaS', 'Software access only'],
                ['Workflow-driven build', 'Custom communication layer'],
                ['Manager visibility', 'Escalations, review, and control'],
                ['Team impact', 'Faster replies without adding headcount'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <CTASection
        title="Your team has better things to do than answer the same messages all day."
        description="Let's build a communication system that saves time, reduces manual work, and keeps your team in control."
        primary={{ label: 'Book a strategy call', to: '/contact' }}
        secondary={{ label: 'Contact us', to: '/contact' }}
      />
    </>
  );
}
