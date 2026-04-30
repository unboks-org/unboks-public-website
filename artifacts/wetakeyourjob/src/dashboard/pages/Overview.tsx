import { useStatus, useDrafts, useConversations, useEscalations } from "@dashboard/hooks/use-client-api";
import { useReadStatus, useHiddenSet } from "@dashboard/hooks/use-read-status";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle, Share2, AlertTriangle, Settings,
  CheckCircle2, ArrowRight, RefreshCw, ChevronDown, ChevronUp, AlertCircle,
} from "lucide-react";
import { ClassBadge } from "@dashboard/components/ui/status-badge";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { Draft } from "@dashboard/lib/api";
import { cn } from "@dashboard/lib/utils";

// ─── Count-up ─────────────────────────────────────────────────────────────────
function useCountUp(target: number | undefined, duration = 700): number {
  const [value, setValue] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (target == null || done.current) { if (target != null) setValue(target); return; }
    done.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(e * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

// ─── Urgent Bar ───────────────────────────────────────────────────────────────
function UrgentBar({ drafts, onOpen, loading }: {
  drafts: Draft[];
  onOpen: (d: Draft) => void;
  loading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  if (loading) return (
    <div className="border border-[#d0d7de] bg-white p-4">
      <Skeleton className="h-4 w-44" />
    </div>
  );

  if (drafts.length === 0) return null;

  return (
    <div className="border border-[#d0d7de] bg-white overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[#f6f8fa] transition-colors"
      >
        <AlertCircle className="w-3.5 h-3.5 text-[#9a6700] shrink-0" />
        <span className="flex-1 text-[13px] font-medium text-[#24292f]">
          {drafts.length} post{drafts.length !== 1 ? "s" : ""} pending approval
        </span>
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-[#57606a] shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 text-[#57606a] shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-[#d0d7de] divide-y divide-[#d0d7de]">
          {drafts.map((draft) => (
            <div key={draft.id} className="flex items-center gap-4 px-5 py-3">
              <button
                onClick={() => onOpen(draft)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <ClassBadge contentClass={draft.content_class} />
                <p className="flex-1 text-[13px] text-[#57606a] line-clamp-1 min-w-0 hover:text-[#24292f] transition-colors">
                  {draft.instagram_caption}
                </p>
              </button>
              <span className="text-[12px] text-[#6e7781] shrink-0 tabular-nums hidden sm:block">
                {draft.created_at ? formatDistanceToNow(new Date(draft.created_at), { addSuffix: true }) : ""}
              </span>
              <button
                onClick={() => onOpen(draft)}
                className="h-7 px-3 text-[12px] font-medium border border-[#d0d7de] bg-white text-[#24292f] hover:bg-[#f6f8fa] rounded-md transition-colors shrink-0"
              >
                Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({
  icon: Icon,
  title,
  value,
  summary,
  alertBorder,
  stats,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  summary: string;
  iconColor: string;
  alertBorder?: boolean;
  stats?: { label: string; value: string | number }[];
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "border bg-white cursor-pointer select-none overflow-hidden hover:bg-[#f6f8fa] transition-colors",
        alertBorder ? "border-[#0969da]" : "border-[#d0d7de]"
      )}
      onClick={onClick}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#57606a]" />
            <span className="text-[12px] font-semibold text-[#57606a] uppercase tracking-wide">{title}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#6e7781]" />
        </div>

        <div>
          <p className="text-4xl font-bold tabular-nums text-[#24292f]">{value}</p>
          <p className="text-[13px] text-[#57606a] mt-1">{summary}</p>
        </div>

        {stats && stats.length > 0 && (
          <div className="pt-3 border-t border-[#d0d7de] grid grid-cols-3 divide-x divide-[#d0d7de]">
            {stats.map(({ label, value: v }) => (
              <div key={label} className="flex flex-col items-center gap-1 py-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6e7781]">{label}</p>
                <p className="text-[15px] font-bold text-[#24292f] tabular-nums">{v}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Overview() {
  const navigate = useNavigate();
  const { data: status, isLoading: statusLoading } = useStatus();
  const { data: allPending, isLoading: pendingLoading } = useDrafts("pending");
  const { data: recentPublished, refetch: refetchActivity } = useDrafts("published", 50);
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [archiveExpanded, setArchiveExpanded] = useState(false);

  const learningsCount = useCountUp(status?.learnings);

  const { data: conversations } = useConversations();
  const { readSet: msgReadSet } = useReadStatus();
  const hiddenSet = useHiddenSet();
  const today = new Date().toDateString();
  const visibleConvs = (conversations ?? []).filter(c => !hiddenSet.has(c.phone));
  const totalConvs = visibleConvs.length;
  const unreadConvs = visibleConvs.filter(c => !msgReadSet.has(c.phone)).length;
  const todayConvs = visibleConvs.filter(c => new Date(c.last_message_at).toDateString() === today).length;

  const { data: escalations } = useEscalations();
  const openEsc = (escalations ?? []).filter(e => e.status !== "resolved").length;
  const resolvedEsc = (escalations ?? []).filter(e => e.status === "resolved").length;
  const todayEsc = (escalations ?? []).filter(e => new Date(e.created_at).toDateString() === today).length;

  const cards = [
    {
      key: "messages",
      icon: MessageCircle,
      title: "Messages",
      value: conversations == null ? "—" : totalConvs,
      summary: conversations == null
        ? "Loading…"
        : unreadConvs > 0
          ? `${unreadConvs} unread`
          : totalConvs > 0 ? "All read" : "Inbox clear",
      iconColor: "",
      alertBorder: unreadConvs > 0,
      route: "/dashboard/messages",
      stats: [
        { label: "Unread", value: conversations == null ? "—" : unreadConvs },
        { label: "Today", value: conversations == null ? "—" : todayConvs },
        { label: "Total", value: conversations == null ? "—" : totalConvs },
      ],
    },
    {
      key: "social",
      icon: Share2,
      title: "Social Media",
      value: statusLoading ? "—" : (status?.pending ?? 0),
      summary: statusLoading
        ? "Loading…"
        : status?.pending
          ? `${status.pending} pending review`
          : "All posts up to date",
      iconColor: "",
      alertBorder: false,
      route: "/dashboard/social",
      stats: [
        { label: "Pending", value: status?.pending ?? "—" },
        { label: "Approved", value: status?.approved ?? "—" },
        { label: "Published", value: status?.published ?? "—" },
      ],
    },
    {
      key: "escalations",
      icon: AlertTriangle,
      title: "Escalations",
      value: escalations == null ? "—" : (escalations?.length ?? 0),
      summary: escalations == null
        ? "Loading…"
        : openEsc > 0
          ? `${openEsc} need${openEsc !== 1 ? "" : "s"} attention`
          : (escalations?.length ?? 0) > 0
            ? `All resolved`
            : "All clear",
      iconColor: "",
      alertBorder: openEsc > 0,
      route: "/dashboard/escalations",
      stats: [
        { label: "Open", value: escalations == null ? "—" : openEsc },
        { label: "Today", value: escalations == null ? "—" : todayEsc },
        { label: "Resolved", value: escalations == null ? "—" : resolvedEsc },
      ],
    },
    {
      key: "settings",
      icon: Settings,
      title: "Settings",
      value: learningsCount,
      summary: `${learningsCount} brand rule${learningsCount !== 1 ? "s" : ""} active`,
      iconColor: "",
      alertBorder: false,
      route: "/dashboard/settings",
      stats: [
        { label: "Rules", value: learningsCount },
        { label: "Approved", value: status?.approved ?? "—" },
        { label: "Drive", value: "—" },
      ],
    },
  ];

  return (
    <div className="space-y-5 pb-16">

      <UrgentBar
        drafts={allPending ?? []}
        onOpen={(d) => navigate(`/dashboard/social?draft=${d.id}`)}
        loading={pendingLoading}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(({ key, icon, title, value, summary, iconColor, alertBorder, route, stats }) => (
          <SummaryCard
            key={key}
            icon={icon}
            title={title}
            value={value}
            summary={summary}
            iconColor={iconColor}
            alertBorder={alertBorder}
            stats={stats}
            onClick={() => navigate(route)}
          />
        ))}
      </div>

      {/* Recent Activity */}
      {(() => {
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const recent = (recentPublished ?? []).filter(
          p => p.published_at && (now - new Date(p.published_at).getTime()) < oneDayMs
        );
        const archived = (recentPublished ?? []).filter(
          p => !p.published_at || (now - new Date(p.published_at).getTime()) >= oneDayMs
        );

        const renderRow = (post: typeof recent[0]) => (
          <div key={post.id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#f6f8fa] transition-colors border-b border-[#d0d7de] last:border-b-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1f883d] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#6e7781] uppercase tracking-wide mb-0.5">
                Post published
              </p>
              <p className="text-[13px] text-[#57606a] line-clamp-1 hover:text-[#24292f] transition-colors">{post.instagram_caption}</p>
            </div>
            <span className="text-[12px] text-[#6e7781] tabular-nums shrink-0">
              {post.published_at ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true }) : ""}
            </span>
          </div>
        );

        return (
          <div className="border border-[#d0d7de] bg-white overflow-hidden">
            <div className="flex items-center px-5 py-3.5 gap-3 border-b border-[#d0d7de]">
              <h2 className="text-[13px] font-semibold text-[#24292f] flex-1">Recent Activity</h2>
              <button
                onClick={() => refetchActivity()}
                className="p-1.5 rounded-md text-[#57606a] hover:text-[#24292f] hover:bg-[#d0d7de]/50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              {recent.length === 0 && archived.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-[13px] text-[#57606a]">No recent activity.</p>
                </div>
              ) : (
                <>
                  {recent.length > 0 && (
                    <>
                      {(activityExpanded ? recent : recent.slice(0, 5)).map(renderRow)}
                      {recent.length > 5 && (
                        <button
                          onClick={() => setActivityExpanded((e) => !e)}
                          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-[12px] text-[#57606a] hover:text-[#24292f] hover:bg-[#f6f8fa] transition-colors border-t border-[#d0d7de]"
                        >
                          {activityExpanded
                            ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                            : <><ChevronDown className="w-3.5 h-3.5" /> {recent.length - 5} more</>}
                        </button>
                      )}
                    </>
                  )}
                  {archived.length > 0 && (
                    <>
                      <button
                        onClick={() => setArchiveExpanded((e) => !e)}
                        className="w-full flex items-center gap-2 px-5 py-2.5 text-[12px] text-[#57606a] hover:text-[#24292f] hover:bg-[#f6f8fa] transition-colors border-t border-[#d0d7de]"
                      >
                        {archiveExpanded
                          ? <ChevronUp className="w-3.5 h-3.5" />
                          : <ChevronDown className="w-3.5 h-3.5" />}
                        Archive — {archived.length} older post{archived.length !== 1 ? "s" : ""}
                      </button>
                      {archiveExpanded && archived.map(renderRow)}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
