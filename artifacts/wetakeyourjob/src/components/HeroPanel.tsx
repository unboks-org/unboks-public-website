import { channels } from '../data/siteContent';

const metrics = [
  { label: 'First response', value: '-62%' },
  { label: 'Follow-up coverage', value: '98%' },
  { label: 'Time recovered', value: '75%' },
];

export default function HeroPanel() {
  return (
    <div data-testid="hero-panel" className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          </div>
          <span className="ml-2 text-xs text-slate-400">Operations</span>
        </div>
        <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">Human-in-loop</span>
      </div>

      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-3">Channels</p>
            <div className="flex flex-wrap gap-1.5">
              {channels.map((c) => (
                <span key={c} className="rounded-md bg-white border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600">{c}</span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-3">Review Queue</p>
            <div className="space-y-2">
              {['Needs approval', 'Auto-drafted', 'Follow-up due'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-xs text-slate-600">{item}</span>
                  <span className="h-4 w-4 rounded-full bg-white border border-slate-200 text-center text-[9px] font-bold text-slate-400 leading-4">!</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-xl font-semibold text-slate-900 tracking-tight">{m.value}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
