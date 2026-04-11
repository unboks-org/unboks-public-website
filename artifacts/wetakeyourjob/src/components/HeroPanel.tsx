import Badge from './Badge';

const metrics = [
  { label: 'First-response time', value: '-62%' },
  { label: 'Lead follow-up coverage', value: '98%' },
  { label: 'Team time recovered', value: '70-80%' },
];

export default function HeroPanel({ channels }: { channels: string[] }) {
  return (
    <div className="panel relative overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px] opacity-[0.07]" />
      <div className="absolute -right-8 top-8 h-32 w-32 rounded-full bg-glow/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Operations dashboard</p>
            <h3 className="mt-1 text-xl font-semibold">Communication control layer</h3>
          </div>
          <Badge>Human oversight</Badge>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Channel intake</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {channels.map((channel) => (
                <span
                  key={channel}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
                >
                  {channel}
                </span>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-dashed border-glow/20 bg-glow/5 p-4">
              <p className="text-sm font-medium text-white">Unified inbox routing</p>
              <p className="mt-2 text-sm text-slate-300">
                Messages are triaged, drafted, tagged, and escalated with clear manager visibility.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Review queue</p>
              <div className="mt-4 space-y-3">
                {['Needs approval', 'Auto-drafted', 'Follow-up due'].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{item}</p>
                      <p className="text-xs text-slate-400">Queue {index + 1}</p>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-teal" />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
