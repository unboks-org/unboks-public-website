import { useConversations, useEscalations, useStatus } from "@dashboard/hooks/use-client-api";
import { useHiddenSet } from "@dashboard/hooks/use-read-status";
import { PLATFORMS, channelToPlatformKey } from "@dashboard/lib/channel-map";
import { cn } from "@dashboard/lib/utils";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import {
  BarChart3, ArrowLeft, AlertTriangle, Archive, TrendingUp,
  ShoppingBag, Inbox,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend,
} from "recharts";
import { format, subDays } from "date-fns";

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="border border-[#d0d7de] bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#57606a]" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#57606a]">{label}</span>
      </div>
      <p className="text-3xl font-bold text-[#24292f] tabular-nums">{value}</p>
      {sub && <p className="text-[12px] text-[#57606a] mt-1">{sub}</p>}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[200px] flex items-center justify-center">
      <p className="text-sm text-muted-foreground/40">{label}</p>
    </div>
  );
}

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #d0d7de",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#24292f",
  },
  itemStyle: { color: "#24292f" },
};

export default function Analytics() {
  const goBack = useGoBack();
  const { data: conversations } = useConversations();
  const { data: escalations } = useEscalations();
  const { data: status } = useStatus();
  const hiddenSet = useHiddenSet();

  const allConvs = conversations ?? [];
  const visibleConvs = allConvs.filter((c) => !hiddenSet.has(c.phone));
  const archivedCount = allConvs.length - visibleConvs.length;

  const allEscalations = escalations ?? [];
  const openEsc = allEscalations.filter((e) => e.status !== "resolved").length;
  const resolvedEsc = allEscalations.filter((e) => e.status === "resolved").length;

  const platformCounts = PLATFORMS.map((p) => ({
    name: p.label,
    count: allConvs.filter((c) => channelToPlatformKey(c.channel) === p.key).length,
  }));

  const escStatusData = [
    { name: "Open", value: openEsc, color: "#f43f5e" },
    { name: "Resolved", value: resolvedEsc, color: "#10b981" },
  ].filter((d) => d.value > 0);

  const now = new Date();
  const trendData = Array.from({ length: 14 }, (_, i) => {
    const day = subDays(now, 13 - i);
    const dayStr = format(day, "yyyy-MM-dd");
    const dayLabel = format(day, "MMM d");
    const convCount = allConvs.filter((c) => {
      try { return format(new Date(c.last_message_at), "yyyy-MM-dd") === dayStr; } catch { return false; }
    }).length;
    const escCount = allEscalations.filter((e) => {
      try { return format(new Date(e.created_at), "yyyy-MM-dd") === dayStr; } catch { return false; }
    }).length;
    return { day: dayLabel, conversations: convCount, escalations: escCount };
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={goBack} className="flex items-center gap-1.5 text-[13px] text-[#57606a] hover:text-[#24292f] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Settings
      </button>

      <div>
        <h1 className="text-[18px] font-semibold text-[#24292f] mb-1">Analytics</h1>
        <p className="text-[13px] text-[#57606a]">Overview of communication activity and system health.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Inbox} label="Total Inbox" value={visibleConvs.length} color="text-sky-400" />
        <StatCard icon={AlertTriangle} label="Escalations" value={allEscalations.length} sub={`${openEsc} open`} color="text-rose-400" />
        <StatCard icon={Archive} label="Archived" value={archivedCount} color="text-slate-400" />
        <StatCard icon={TrendingUp} label="Published" value={status?.published ?? 0} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-[#d0d7de] bg-white p-5">
          <h3 className="text-[13px] font-semibold text-[#24292f] mb-4">Messages by Platform</h3>
          {platformCounts.some((p) => p.count > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={platformCounts}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor" }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No message data available" />
          )}
        </div>

        <div className="border border-[#d0d7de] bg-white p-5">
          <h3 className="text-[13px] font-semibold text-[#24292f] mb-4">Escalation Status</h3>
          {escStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={escStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {escStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No escalation data" />
          )}
        </div>
      </div>

      <div className="border border-[#d0d7de] bg-white p-5">
        <h3 className="text-[13px] font-semibold text-[#24292f] mb-4">14-Day Activity</h3>
        {trendData.some((d) => d.conversations > 0 || d.escalations > 0) ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "currentColor" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor" }} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="conversations" name="Conversations" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} />
              <Area type="monotone" dataKey="escalations" name="Escalations" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart label="No activity in the last 14 days" />
        )}
      </div>

      <div className="border border-[#d0d7de] bg-white p-5">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-4 h-4 text-[#57606a]" />
          <h3 className="text-[13px] font-semibold text-[#24292f]">Bookings Summary</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Bookings analytics will appear here when booking data becomes available.
        </p>
      </div>
    </div>
  );
}
