import { Handshake, TimerReset, Waypoints } from 'lucide-react';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import Seo from '../components/Seo';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description="Learn the practical philosophy behind We Take Your Job: AI tools that enhance people, save time, and keep humans in control."
      />

      <PageHeader
        badge="About"
        title="AI tools for teams that need more time, speed, and control."
        description="We Take Your Job is built around a simple idea: AI should remove repetitive communication work so people can focus on the work that actually requires judgment, context, and relationship-building."
        actions={<Button to="/contact">Book a strategy call</Button>}
      />

      <Section title="Our philosophy" description="Practical tools for real businesses, not abstract AI promises.">
        <div className="grid gap-6 md:grid-cols-3">
          <InfoCard
            title="Enhance people"
            description="The goal is not blind replacement. The goal is to help teams save time, respond faster, and work with more consistency."
            icon={<Handshake size={20} />}
          />
          <InfoCard
            title="Keep humans in control"
            description="Managers need dashboard visibility. Staff need a clear way to review, approve, and step in when context matters."
            icon={<Waypoints size={20} />}
          />
          <InfoCard
            title="Focus on operational efficiency"
            description="We focus on communication workflows because that is where many small businesses lose hours every week without noticing the full cost."
            icon={<TimerReset size={20} />}
          />
        </div>
      </Section>

      <Section title="What that means in practice">
        <div className="panel p-8">
          <p className="max-w-4xl text-lg leading-8 text-slate-200">
            We study how a business handles inbound messages, follow-up, repeated questions, and
            cross-channel communication. Then we build an AI layer that reduces manual load,
            centralizes the flow, and gives the team a stronger operating system for communication.
          </p>
        </div>
      </Section>
    </>
  );
}
