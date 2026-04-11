import { ArrowRight, BriefcaseBusiness, ChartNoAxesCombined, Inbox, ScanSearch } from 'lucide-react';
import BenefitCard from '../components/BenefitCard';
import Button from '../components/Button';
import CTASection from '../components/CTASection';
import HeroPanel from '../components/HeroPanel';
import Section from '../components/Section';
import Seo from '../components/Seo';
import ServiceCard from '../components/ServiceCard';
import StepCard from '../components/StepCard';
import { audiences, benefits, services, steps } from '../data/siteContent';

const serviceIcons = [BriefcaseBusiness, Inbox, ChartNoAxesCombined, ScanSearch];

export default function HomePage() {
  return (
    <>
      <Seo />

      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_480px] lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]" data-testid="hero-title">
              Take 70-80% of repetitive communication off your team.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-500 leading-relaxed" data-testid="hero-subtitle">
              AI tools that handle emails, DMs, and messages. Your team stays in control.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/contact" data-testid="button-hero-cta">Get started</Button>
              <Button to="/services" variant="secondary" data-testid="button-hero-services">See what we build</Button>
            </div>
          </div>
          <HeroPanel />
        </div>
      </section>

      <Section id="services" eyebrow="What we build" title="AI communication tools for lean teams.">
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => {
            const Icon = serviceIcons[i];
            return <ServiceCard key={s.title} {...s} icon={<Icon size={18} />} />;
          })}
        </div>
      </Section>

      <section className="border-y border-slate-100 py-20 sm:py-28 bg-slate-50/50" data-testid="section-how">
        <div className="wrap">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-14">From analysis to faster replies.</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <StepCard key={s.num} {...s} />
            ))}
          </div>
        </div>
      </section>

      <Section id="benefits" eyebrow="Benefits" title="What changes for your team.">
        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((b) => (
            <BenefitCard key={b.title} {...b} />
          ))}
        </div>
      </Section>

      <section className="py-20 sm:py-28" data-testid="section-audience">
        <div className="wrap">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Built for</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-10">Small teams with high message volume.</h2>
          <div className="flex flex-wrap gap-2">
            {audiences.map((a) => (
              <span key={a} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600" data-testid={`audience-${a.replace(/\W/g, '')}`}>
                {a}
              </span>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-3">
            <ArrowRight size={16} className="text-slate-400" />
            <p className="text-sm text-slate-500">If your team answers the same messages every day, this is for you.</p>
          </div>
        </div>
      </section>

      <CTASection title="Your team has better things to do." subtitle="Let's build a communication system that saves hours every week." />
    </>
  );
}
