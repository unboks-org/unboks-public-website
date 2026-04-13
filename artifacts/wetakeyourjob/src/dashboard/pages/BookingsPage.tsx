import { useState, useMemo, useCallback } from "react";
import { useAvailability } from "@dashboard/hooks/use-bluemarlin";
import { useBookingsLabel } from "@dashboard/hooks/use-bookings-label";
import { format, parseISO } from "date-fns";
import {
  CalendarDays, Users, AlertCircle, TrendingUp,
  RefreshCw, ChevronDown, ChevronUp, Anchor, X,
} from "lucide-react";
import { cn } from "@dashboard/lib/utils";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { ErrorState } from "@dashboard/components/ui/error-state";
import type { AvailabilitySlot } from "@dashboard/lib/api";

type FilterMode = "all" | "today" | "sold-out" | "nearly-full" | "today-available" | "capacity";
type DayRange = 7 | 14 | 30;

function formatService(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function slotStatus(s: AvailabilitySlot) {
  if (s.capacity === 0) return "unknown" as const;
  if (s.spots_remaining === 0) return "sold-out" as const;
  const pct = s.spots_remaining / s.capacity;
  if (pct <= 0.25) return "nearly-full" as const;
  if (pct <= 0.5) return "filling" as const;
  return "available" as const;
}

type SlotStatus = ReturnType<typeof slotStatus>;

const STATUS: Record<SlotStatus, { label: string; badgeCls: string; barCls: string; textCls: string }> = {
  "sold-out":    { label: "Sold Out",    badgeCls: "bg-rose-500/15 text-rose-400 border border-rose-500/25",    barCls: "bg-rose-500",    textCls: "text-rose-400" },
  "nearly-full": { label: "Nearly Full", badgeCls: "bg-orange-500/15 text-orange-400 border border-orange-500/25", barCls: "bg-orange-500", textCls: "text-orange-400" },
  "filling":     { label: "Filling",     badgeCls: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",  barCls: "bg-yellow-400",  textCls: "text-yellow-400" },
  "available":   { label: "Available",   badgeCls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25", barCls: "bg-emerald-500", textCls: "text-emerald-400" },
  "unknown":     { label: "—",           badgeCls: "bg-muted/50 text-muted-foreground border border-border",   barCls: "bg-muted-foreground", textCls: "text-muted-foreground" },
};

function slotId(s: AvailabilitySlot) {
  return `${s.service_key}__${s.date}__${s.slot_time}`;
}

export default function BookingsPage() {
  const { label: bookingsLabel } = useBookingsLabel();
  const [range, setRange] = useState<DayRange>(7);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [serviceFilters, setServiceFilters] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [capacityOpen, setCapacityOpen] = useState(true);

  const { data: slots, isLoading, error, refetch, isFetching } = useAvailability(range);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const allSlots: AvailabilitySlot[] = slots ?? [];
  const todaySlots = allSlots.filter((s) => s.date === todayStr);

  const todayBooked = todaySlots.reduce((n, s) => n + s.booked_guests, 0);
  const todayCapacity = todaySlots.reduce((n, s) => n + s.capacity, 0);
  const todayRemaining = todaySlots.reduce((n, s) => n + s.spots_remaining, 0);
  const todayPct = todayCapacity > 0 ? Math.round((todayBooked / todayCapacity) * 100) : 0;
  const soldOutCount = allSlots.filter((s) => s.spots_remaining === 0).length;
  const nearlyFullCount = allSlots.filter((s) => slotStatus(s) === "nearly-full").length;

  const toggleService = useCallback((key: string) => {
    setServiceFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    setExpandedId(null);
  }, []);

  const clearServiceFilters = useCallback(() => {
    setServiceFilters(new Set());
  }, []);

  const filteredSlots = useMemo(() => {
    let sorted = [...allSlots].sort(
      (a, b) => a.date.localeCompare(b.date) || a.slot_time.localeCompare(b.slot_time)
    );
    if (serviceFilters.size > 0) {
      sorted = sorted.filter((s) => serviceFilters.has(s.service_key));
    }
    switch (filter) {
      case "today":           return sorted.filter((s) => s.date === todayStr && s.booked_guests > 0);
      case "sold-out":        return sorted.filter((s) => s.spots_remaining === 0);
      case "nearly-full":     return sorted.filter((s) => slotStatus(s) === "nearly-full");
      case "today-available": return sorted.filter((s) => s.date === todayStr && s.spots_remaining > 0);
      case "capacity":        return sorted.filter((s) => s.date === todayStr);
      default:                return sorted;
    }
  }, [allSlots, filter, serviceFilters, todayStr]);

  const groupedByDate = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();
    for (const s of filteredSlots) {
      const g = map.get(s.date) ?? [];
      g.push(s);
      map.set(s.date, g);
    }
    return Array.from(map.entries());
  }, [filteredSlots]);

  const serviceBlocks = useMemo(() => {
    const map = new Map<string, { booked: number; total: number; slots: number }>();
    for (const s of allSlots) {
      const cur = map.get(s.service_key) ?? { booked: 0, total: 0, slots: 0 };
      cur.booked += s.booked_guests;
      cur.total += s.capacity;
      cur.slots++;
      map.set(s.service_key, cur);
    }
    return Array.from(map.entries())
      .map(([key, v]) => ({
        key,
        name: formatService(key),
        booked: v.booked,
        total: v.total,
        slots: v.slots,
        pct: v.total > 0 ? Math.round((v.booked / v.total) * 100) : 0,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [allSlots]);

  const RANGES: DayRange[] = [7, 14, 30];

  const SNAPSHOT: {
    id: FilterMode;
    label: string;
    value: number | string;
    sub?: string;
    icon: React.ElementType;
    iconCls: string;
    activeCls: string;
  }[] = [
    {
      id: "today",
      label: "Booked Today",
      value: isLoading ? "—" : todayBooked,
      sub: `of ${todayCapacity} capacity`,
      icon: CalendarDays,
      iconCls: "text-primary",
      activeCls: "border-primary/40 bg-primary/8",
    },
    {
      id: "today-available",
      label: "Spots Left Today",
      value: isLoading ? "—" : todayRemaining,
      sub: todayCapacity > 0 ? `${100 - todayPct}% remaining` : "no trips today",
      icon: Users,
      iconCls: "text-emerald-400",
      activeCls: "border-emerald-500/40 bg-emerald-500/8",
    },
    {
      id: "nearly-full",
      label: "Nearly Full",
      value: isLoading ? "—" : nearlyFullCount,
      sub: `slot${nearlyFullCount !== 1 ? "s" : ""} ≤25% remaining`,
      icon: TrendingUp,
      iconCls: "text-orange-400",
      activeCls: "border-orange-500/40 bg-orange-500/8",
    },
    {
      id: "sold-out",
      label: "Sold Out",
      value: isLoading ? "—" : soldOutCount,
      sub: `slot${soldOutCount !== 1 ? "s" : ""} fully booked`,
      icon: AlertCircle,
      iconCls: "text-rose-400",
      activeCls: "border-rose-500/40 bg-rose-500/8",
    },
    {
      id: "capacity",
      label: "Capacity Today",
      value: isLoading ? "—" : `${todayPct}%`,
      sub: todayCapacity > 0 ? `${todayBooked} / ${todayCapacity} seats` : "no trips today",
      icon: Anchor,
      iconCls: "text-sky-400",
      activeCls: "border-sky-500/40 bg-sky-500/8",
    },
  ];

  const hasServiceFilter = serviceFilters.size > 0;
  const hasAnyFilter = hasServiceFilter || filter !== "all";

  const listTitle = hasServiceFilter
    ? serviceFilters.size === 1
      ? formatService([...serviceFilters][0])
      : `${serviceFilters.size} trips selected`
    : filter === "all"            ? `All Slots — Next ${range} Days`
    : filter === "today"          ? "Booked Today"
    : filter === "today-available"? "Spots Left Today"
    : filter === "sold-out"       ? "Sold Out"
    : filter === "nearly-full"    ? "Nearly Full"
    : filter === "capacity"       ? "Today's Capacity Breakdown"
    : "All Slots";

  return (
    <div className="space-y-4 max-w-5xl">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{bookingsLabel}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live overview of today's bookings, pipeline status, and capacity.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-card border border-border rounded-lg p-0.5">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  range === r
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r}d
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* ── LAYER 1 — Commercial Snapshot ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {SNAPSHOT.map((s) => {
          const Icon = s.icon;
          const active = filter === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setFilter(active ? "all" : s.id)}
              className={cn(
                "relative flex flex-col gap-1 p-3.5 rounded-xl border transition-all text-left",
                active
                  ? cn("shadow-sm", s.activeCls)
                  : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center justify-between mb-0.5">
                <Icon className={cn("w-3.5 h-3.5", s.iconCls)} />
                {active && <X className="w-3 h-3 text-muted-foreground/60" />}
              </div>
              <span className="text-2xl font-bold text-foreground tabular-nums leading-none">
                {isLoading ? <Skeleton className="h-7 w-12 rounded" /> : s.value}
              </span>
              <span className="text-[11px] font-semibold text-foreground/80 leading-tight">
                {s.label}
              </span>
              {s.sub && (
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {isLoading ? "" : s.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── LAYER 2 — Capacity Block ────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setCapacityOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Anchor className="w-4 h-4 text-primary/70" />
            <span className="text-sm font-semibold text-foreground">
              Capacity — Next {range} Days
            </span>
            <span className="text-xs text-muted-foreground">
              ({serviceBlocks.length} trip{serviceBlocks.length !== 1 ? "s" : ""})
            </span>
          </div>
          {capacityOpen
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {capacityOpen && (
          <div className="border-t border-border divide-y divide-border/50">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-32 rounded" />
                    <Skeleton className="h-2 flex-1 rounded-full" />
                    <Skeleton className="h-3 w-12 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState error={error} onRetry={() => refetch()} title="Failed to load capacity" />
            ) : serviceBlocks.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No capacity data available for this period.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {serviceBlocks.map((svc, idx) => {
                  const remaining = svc.total - svc.booked;
                  const pctStr = svc.total > 0 ? `${svc.pct}%` : "—";
                  const st: SlotStatus = svc.total === 0 ? "unknown"
                    : svc.booked === svc.total ? "sold-out"
                    : remaining / svc.total <= 0.25 ? "nearly-full"
                    : remaining / svc.total <= 0.5 ? "filling"
                    : "available";
                  const cfg = STATUS[st];
                  const isActive = serviceFilters.has(svc.key);
                  return (
                    <button
                      key={svc.key}
                      onClick={() => toggleService(svc.key)}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 text-left w-full transition-colors",
                        idx % 2 === 1 && "sm:border-l sm:border-border/50",
                        isActive
                          ? "bg-primary/8 ring-1 ring-inset ring-primary/30"
                          : "hover:bg-muted/25 active:bg-muted/40"
                      )}
                    >
                      <div className="w-[130px] shrink-0">
                        <p className={cn(
                          "text-[13px] font-medium truncate transition-colors",
                          isActive ? "text-primary" : "text-foreground group-hover:text-foreground"
                        )}>
                          {svc.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {svc.slots} slot{svc.slots !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {svc.booked} / {svc.total}
                          </span>
                          <span className={cn("text-[11px] font-semibold tabular-nums", cfg.textCls)}>
                            {pctStr}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", cfg.barCls)}
                            style={{ width: `${Math.min(svc.pct, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", cfg.badgeCls)}>
                          {cfg.label}
                        </span>
                        {isActive && (
                          <X className="w-3 h-3 text-primary/60 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── LAYER 3 — Live List ────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">

        {/* ── Trip filter bar ── */}
        {!isLoading && !error && serviceBlocks.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border/60 overflow-x-auto scrollbar-none">
            {/* Trip pills */}
            {serviceBlocks.map((svc) => {
              const on = serviceFilters.has(svc.key);
              return (
                <button
                  key={svc.key}
                  onClick={() => toggleService(svc.key)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border",
                    on
                      ? "bg-primary/12 border-primary/35 text-primary"
                      : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {svc.name}
                  <span className={cn(
                    "text-[10px] tabular-nums",
                    on ? "text-primary/70" : "text-muted-foreground/50"
                  )}>
                    {svc.slots}
                  </span>
                </button>
              );
            })}

            {/* ALL pill — always last, never highlighted */}
            <button
              onClick={() => clearServiceFilters()}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            >
              All
              <span className="text-[10px] tabular-nums text-muted-foreground/50">
                {allSlots.length}
              </span>
            </button>
          </div>
        )}

        {/* List header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 min-w-0">
            <CalendarDays className="w-4 h-4 text-primary/70 shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate">
              {listTitle}
            </span>
            {!isLoading && (
              <span className="text-xs text-muted-foreground shrink-0">
                ({filteredSlots.length} slot{filteredSlots.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>
          {hasAnyFilter && (
            <button
              onClick={() => { clearServiceFilters(); setFilter("all"); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>

        {/* Capacity summary banner — shown when "Capacity Today" card is active */}
        {!isLoading && !error && filter === "capacity" && todayCapacity > 0 && (
          <div className="grid grid-cols-4 divide-x divide-border/50 border-b border-border/60 bg-sky-500/[0.04]">
            {[
              { label: "Total seats today", value: todayCapacity, cls: "text-foreground" },
              { label: "Booked",            value: todayBooked,   cls: "text-foreground" },
              { label: "Remaining",         value: todayRemaining, cls: "text-emerald-400" },
              { label: "Fill rate",         value: `${todayPct}%`, cls: todayPct >= 75 ? "text-rose-400" : todayPct >= 50 ? "text-orange-400" : "text-emerald-400" },
            ].map((m) => (
              <div key={m.label} className="flex flex-col gap-0.5 px-4 py-3">
                <span className={cn("text-xl font-bold tabular-nums", m.cls)}>{m.value}</span>
                <span className="text-[11px] text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Table header — hidden for booking-centric views */}
        {!isLoading && !error && filteredSlots.length > 0 && filter !== "today" && (
          <div className="grid grid-cols-[1fr_80px_80px_100px_80px_90px] gap-0 px-4 py-2 border-b border-border/50 bg-muted/10">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Trip</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Departs</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">Fill</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Left</span>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Status</span>
          </div>
        )}

        <div>
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-11 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="p-4">
              <ErrorState error={error} onRetry={() => refetch()} title="Failed to load schedule" />
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
              <CalendarDays className="w-7 h-7 text-foreground/15" />
              <p className="text-sm text-muted-foreground">
                {filter === "sold-out"          ? "No slots are sold out right now."
                 : filter === "nearly-full"     ? "No slots are nearly full right now."
                 : filter === "today"           ? "No bookings recorded for today."
                 : filter === "today-available" ? "No available spots remain for today."
                 : filter === "capacity"        ? "No trips scheduled for today."
                 : "No slots match this filter."}
              </p>
              {hasAnyFilter && (
                <button
                  onClick={() => { clearServiceFilters(); setFilter("all"); }}
                  className="text-xs text-primary/70 hover:text-primary transition-colors mt-1"
                >
                  Clear all filters
                </button>
              )}
            </div>

          ) : filter === "today" ? (
            /* ── Booked Today — booking-centric list ── */
            <div className="divide-y divide-border/40">
              {filteredSlots.map((slot) => {
                const id = slotId(slot);
                const isExpanded = expandedId === id;
                const st = slotStatus(slot);
                const cfg = STATUS[st];
                const fillPct = slot.capacity > 0
                  ? Math.round((slot.booked_guests / slot.capacity) * 100)
                  : 0;
                return (
                  <div key={id} className="group">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/20 transition-colors",
                        isExpanded && "bg-muted/20"
                      )}
                    >
                      {/* Expand chevron */}
                      <span className="shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                        {isExpanded
                          ? <ChevronUp className="w-3.5 h-3.5" />
                          : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>

                      {/* Trip + time */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-foreground truncate">
                          {formatService(slot.service_key)}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Departs <span className="font-mono text-foreground/70">{slot.slot_time}</span>
                          {" · "}{format(parseISO(slot.date), "EEE, MMM d")}
                        </p>
                      </div>

                      {/* Guests booked */}
                      <div className="shrink-0 flex items-center gap-1.5 text-foreground/80">
                        <Users className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-sm font-semibold tabular-nums">
                          {slot.booked_guests}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          guest{slot.booked_guests !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Status badge */}
                      <div className="shrink-0">
                        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", cfg.badgeCls)}>
                          {cfg.label}
                        </span>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="mx-4 mb-3 rounded-lg border border-border/60 bg-muted/15 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
                          <span className="text-[13px] font-semibold text-foreground">
                            {formatService(slot.service_key)}
                          </span>
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", cfg.badgeCls)}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 px-4 py-3">
                          {[
                            { label: "Date",      value: format(parseISO(slot.date), "EEEE, MMMM d, yyyy") },
                            { label: "Departure", value: slot.slot_time },
                            { label: "Booked",    value: `${slot.booked_guests} guest${slot.booked_guests !== 1 ? "s" : ""}` },
                            { label: "Capacity",  value: `${slot.capacity} total seats` },
                            { label: "Remaining", value: `${slot.spots_remaining} spot${slot.spots_remaining !== 1 ? "s" : ""} left` },
                            { label: "Fill Rate", value: `${fillPct}%` },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                              <p className="text-[13px] font-medium text-foreground">{value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2 border-t border-border/30 bg-muted/10">
                          <p className="text-[10px] text-muted-foreground/60">
                            Individual guest names and booking references are available in your booking management system.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          ) : (
            /* ── All other filters — slot inventory table (grouped by date) ── */
            <div className="divide-y divide-border/40">
              {groupedByDate.map(([date, daySlots]) => {
                const dateObj = parseISO(date);
                const isToday = date === todayStr;
                return (
                  <div key={date}>
                    {/* Date group header */}
                    <div className={cn(
                      "px-4 py-1.5 flex items-center gap-2",
                      isToday ? "bg-primary/5" : "bg-muted/10"
                    )}>
                      <span className={cn(
                        "text-[11px] font-bold uppercase tracking-wider",
                        isToday ? "text-primary" : "text-muted-foreground/80"
                      )}>
                        {isToday ? "Today · " : ""}
                        {format(dateObj, "EEE, MMM d")}
                      </span>
                      <span className="text-[11px] text-muted-foreground/60">
                        {daySlots.reduce((n, s) => n + s.booked_guests, 0)} booked
                        {" · "}
                        {daySlots.reduce((n, s) => n + s.spots_remaining, 0)} remaining
                      </span>
                    </div>

                    {/* Slot rows */}
                    {daySlots.map((slot) => {
                      const id = slotId(slot);
                      const isExpanded = expandedId === id;
                      const st = slotStatus(slot);
                      const cfg = STATUS[st];
                      const fillPct = slot.capacity > 0
                        ? Math.round((slot.booked_guests / slot.capacity) * 100)
                        : 0;

                      return (
                        <div key={id} className="group">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : id)}
                            className={cn(
                              "w-full grid grid-cols-[1fr_80px_80px_100px_80px_90px] gap-0 px-4 py-2.5 text-left hover:bg-muted/20 transition-colors",
                              isExpanded && "bg-muted/20"
                            )}
                          >
                            {/* Trip name */}
                            <span className="text-sm font-medium text-foreground truncate pr-2 flex items-center gap-1.5">
                              {isExpanded
                                ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" />
                                : <ChevronDown className="w-3 h-3 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground" />}
                              {formatService(slot.service_key)}
                            </span>

                            {/* Date */}
                            <span className="text-sm text-muted-foreground self-center">
                              {format(parseISO(slot.date), "MMM d")}
                            </span>

                            {/* Departure */}
                            <span className="text-sm font-mono text-foreground/80 self-center">
                              {slot.slot_time}
                            </span>

                            {/* Fill bar */}
                            <div className="flex items-center gap-1.5 self-center">
                              <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden min-w-[40px]">
                                <div
                                  className={cn("h-full rounded-full", cfg.barCls)}
                                  style={{ width: `${Math.min(fillPct, 100)}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-muted-foreground tabular-nums w-7 text-right">
                                {fillPct}%
                              </span>
                            </div>

                            {/* Remaining */}
                            <span className={cn(
                              "text-sm font-semibold tabular-nums text-right self-center",
                              slot.spots_remaining === 0 ? "text-rose-400" : "text-foreground/80"
                            )}>
                              {slot.spots_remaining}
                            </span>

                            {/* Status badge */}
                            <div className="flex justify-end self-center">
                              <span className={cn(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                                cfg.badgeCls
                              )}>
                                {cfg.label}
                              </span>
                            </div>
                          </button>

                          {/* ── Expanded detail ── */}
                          {isExpanded && (
                            <div className="mx-4 mb-2 rounded-lg border border-border/60 bg-muted/15 overflow-hidden">
                              <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
                                <span className="text-[13px] font-semibold text-foreground">
                                  {formatService(slot.service_key)}
                                </span>
                                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", cfg.badgeCls)}>
                                  {cfg.label}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 px-4 py-3">
                                {[
                                  { label: "Date",       value: format(parseISO(slot.date), "EEEE, MMMM d, yyyy") },
                                  { label: "Departure",  value: slot.slot_time },
                                  { label: "Service",    value: slot.service_key },
                                  { label: "Booked",     value: `${slot.booked_guests} guest${slot.booked_guests !== 1 ? "s" : ""}` },
                                  { label: "Capacity",   value: `${slot.capacity} total` },
                                  { label: "Remaining",  value: `${slot.spots_remaining} spot${slot.spots_remaining !== 1 ? "s" : ""}` },
                                  { label: "Fill Rate",  value: `${fillPct}%` },
                                ].map(({ label, value }) => (
                                  <div key={label}>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                                    <p className="text-[13px] font-medium text-foreground">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
