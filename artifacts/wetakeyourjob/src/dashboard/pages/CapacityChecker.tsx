import { useState, useMemo } from "react";
import { useAvailability } from "@dashboard/hooks/use-bluemarlin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@dashboard/components/ui/table";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { ErrorState } from "@dashboard/components/ui/error-state";
import { format, parseISO } from "date-fns";
import { CalendarDays, Filter, Users, ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { cn } from "@dashboard/lib/utils";
import { AvailabilitySlot } from "@dashboard/lib/api";

type DayOption = 3 | 7 | 14;
type GroupMode = "date" | "trip";

const TRIP_FILTERS = [
  { label: "All",               match: null },
  { label: "Jet Ski",           match: (k: string) => /jet.?ski/i.test(k) },
  { label: "Klein Curaçao",     match: (k: string) => /klein/i.test(k) },
  { label: "Snorkeling 3-in-1", match: (k: string) => /snorkel|3.?in.?1/i.test(k) },
  { label: "Sunset Cruise",     match: (k: string) => /sunset/i.test(k) },
  { label: "West Coast Beach",  match: (k: string) => /west/i.test(k) },
];

function formatServiceName(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function getOccupancyColor(remaining: number, capacity: number): string {
  if (capacity === 0) return "bg-zinc-100/80 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400";
  const percent = remaining / capacity;
  if (remaining === 0) return "border-l-4 border-l-rose-500 bg-rose-50/80 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300";
  if (percent <= 0.25) return "border-l-4 border-l-orange-500 bg-orange-50/60 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300";
  if (percent <= 0.5) return "border-l-4 border-l-yellow-500 bg-yellow-50/60 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300";
  return "border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300";
}

interface GroupedSlots {
  key: string;
  label: string;
  slots: AvailabilitySlot[];
}

export default function CapacityChecker() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [days, setDays] = useState<DayOption>(7);
  const [groupBy, setGroupBy] = useState<GroupMode>("date");
  const [tripFilterIdx, setTripFilterIdx] = useState(0);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { data: slots, isLoading, error, refetch } = useAvailability(days);

  const activeFilter = TRIP_FILTERS[tripFilterIdx];

  const filteredSlots = useMemo(() => {
    if (!slots) return [];
    if (!activeFilter.match) return slots;
    return slots.filter(s => activeFilter.match!(s.service_key));
  }, [slots, activeFilter]);

  const grouped = useMemo((): GroupedSlots[] => {
    if (filteredSlots.length === 0) return [];

    const groups = new Map<string, AvailabilitySlot[]>();

    const sorted = [...filteredSlots].sort((a, b) => {
      if (groupBy === "date") {
        return a.date.localeCompare(b.date) || a.service_key.localeCompare(b.service_key);
      }
      return a.service_key.localeCompare(b.service_key) || a.date.localeCompare(b.date);
    });

    for (const slot of sorted) {
      const key = groupBy === "date" ? slot.date : slot.service_key;
      const existing = groups.get(key);
      if (existing) {
        existing.push(slot);
      } else {
        groups.set(key, [slot]);
      }
    }

    return Array.from(groups.entries()).map(([key, groupSlots]) => ({
      key,
      label: groupBy === "date"
        ? format(parseISO(key), 'EEEE, MMMM d, yyyy')
        : formatServiceName(key),
      slots: groupSlots,
    }));
  }, [filteredSlots, groupBy]);

  const PREVIEW_COUNT = 3;

  const toggleExpanded = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const DAY_OPTIONS: DayOption[] = [3, 7, 14];

  return (
    <div className="space-y-6">
      <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Capacity Checker</h1>
          <p className="text-muted-foreground">Real-time availability synced from the booking system.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-border overflow-hidden">
        {/* ── Controls row 1: Days + Group By ─── */}
        <div className="p-4 border-b border-border bg-muted/50 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2 bg-card p-1 rounded-lg border border-border">
            <CalendarDays className="w-4 h-4 text-muted-foreground ml-2" />
            <div className="flex">
              {DAY_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    days === d ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-card p-1 rounded-lg border border-border">
            <Filter className="w-4 h-4 text-muted-foreground ml-2" />
            <div className="flex">
              <button
                onClick={() => setGroupBy("date")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  groupBy === "date" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                By Date
              </button>
              <button
                onClick={() => setGroupBy("trip")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  groupBy === "trip" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                By Trip
              </button>
            </div>
          </div>
        </div>

        {/* ── Controls row 2: Trip type filters ─── */}
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex flex-wrap gap-2 items-center">
          {TRIP_FILTERS.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setTripFilterIdx(i)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
                tripFilterIdx === i
                  ? "bg-sky-600 border-sky-600 text-white"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-12 w-full bg-muted/50 rounded-md" />)}
            </div>
          ) : error ? (
            <ErrorState error={error} onRetry={() => refetch()} title="Failed to load availability" />
          ) : grouped.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground/80">No trips scheduled</h3>
              <p className="text-muted-foreground mt-1">No availability data found for the selected timeframe.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {grouped.map(group => {
                const isExpanded = expanded.has(group.key);
                const hasMore = group.slots.length > PREVIEW_COUNT;
                const visibleSlots = hasMore && !isExpanded
                  ? group.slots.slice(0, PREVIEW_COUNT)
                  : group.slots;
                const hiddenCount = group.slots.length - PREVIEW_COUNT;

                return (
                  <div key={group.key}>
                    <div className="w-full px-4 py-3 bg-muted border-b border-white/5 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">{group.label}</h3>
                      {hasMore && (
                        <span className="text-xs text-muted-foreground">{group.slots.length} departures</span>
                      )}
                    </div>
                    <Table>
                      <TableHeader className="bg-muted/50 border-b-white/5 hover:bg-muted/50">
                        <TableRow className="border-white/5 hover:bg-transparent">
                          {groupBy === "trip" && <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider h-10">Date</TableHead>}
                          {groupBy === "date" && <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider h-10">Trip</TableHead>}
                          <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Day</TableHead>
                          <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Departure</TableHead>
                          <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider text-right">Booked</TableHead>
                          <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider text-right">Remaining</TableHead>
                          <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleSlots.map((slot, idx) => {
                          const rowClass = getOccupancyColor(slot.spots_remaining, slot.capacity);
                          const isSoldOut = slot.spots_remaining === 0;
                          const dateObj = parseISO(slot.date);

                          return (
                            <TableRow
                              key={`${slot.service_key}-${slot.date}-${slot.slot_time}-${idx}`}
                              className={cn("border-white/5 transition-colors", rowClass, "hover:bg-muted/50 hover:opacity-100")}
                            >
                              {groupBy === "trip" && (
                                <TableCell className="font-medium">
                                  <span className={cn(isSoldOut ? "text-rose-200" : "text-foreground/90")}>{format(dateObj, 'MMM d, yyyy')}</span>
                                </TableCell>
                              )}
                              {groupBy === "date" && (
                                <TableCell className="font-semibold">{formatServiceName(slot.service_key)}</TableCell>
                              )}
                              <TableCell className={cn("text-xs", isSoldOut ? "text-rose-400/70" : "text-muted-foreground")}>{format(dateObj, 'EEE')}</TableCell>
                              <TableCell className="font-mono text-sm">{slot.slot_time}</TableCell>
                              <TableCell className="text-right">
                                <span className="font-medium text-lg">{slot.booked_guests}</span>
                                <span className="text-xs opacity-50 ml-1">/ {slot.capacity}</span>
                              </TableCell>
                              <TableCell className="text-right font-bold text-lg">
                                {slot.spots_remaining}
                              </TableCell>
                              <TableCell className="text-right">
                                {isSoldOut ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">Sold Out</span>
                                ) : (
                                  <span className="text-sm font-medium">
                                    {Math.round(((slot.capacity - slot.spots_remaining) / slot.capacity) * 100)}% Full
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {hasMore && (
                      <button
                        onClick={() => toggleExpanded(group.key)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground border-t border-white/5 hover:bg-muted/30 transition-colors"
                      >
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")} />
                        {isExpanded ? "Show Less" : `Show ${hiddenCount} More`}
                      </button>
                    )}
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
