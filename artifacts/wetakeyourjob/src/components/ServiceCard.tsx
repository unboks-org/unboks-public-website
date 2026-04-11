import React from 'react';
import InfoCard from './InfoCard';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function ServiceCard(props: ServiceCardProps) {
  return <InfoCard {...props} className="hover:border-glow/30 hover:bg-white/[0.05]" />;
}
