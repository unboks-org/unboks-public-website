import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { useDrafts, useDraft, useDraftMutations, useStatus, useAvailablePlatforms } from "@dashboard/hooks/use-client-api";
import { Draft, DraftStatus, ContentClass } from "@dashboard/lib/api";
import { AuthImage } from "@dashboard/components/ui/auth-image";
import { Button } from "@dashboard/components/ui/button";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import { StatusBadge, ClassBadge } from "@dashboard/components/ui/status-badge";
import { ErrorState } from "@dashboard/components/ui/error-state";
import { format } from "date-fns";
import {
  Sparkles, AlertCircle, CheckCircle2, XCircle, Send, Clock, CalendarDays,
  ListTodo, ArrowRight, ArrowLeft, ChevronRight, ChevronUp, ChevronDown, ExternalLink, HelpCircle, Loader2,
  ArrowUpDown, ArrowUp, ArrowDown, Pencil, Save, X, Instagram, Facebook, Trash2, Globe,
} from "lucide-react";
import { XBrandIcon } from "@dashboard/components/ui/x-brand-icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@dashboard/components/ui/dialog";
import { Input } from "@dashboard/components/ui/input";
import { Textarea } from "@dashboard/components/ui/textarea";
import { Badge } from "@dashboard/components/ui/badge";
import { cn } from "@dashboard/lib/utils";

type SortField = "date" | "status" | "class";
type SortDirection = "asc" | "desc";
type View = "list" | "detail";

const ALL_CLASSES: ContentClass[] = ["A", "B", "C", "D"];

export default function ContentPipeline() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<View>("list");
  const [statusFilter, setStatusFilter] = useState<DraftStatus | "all">("approved");
  const [classFilter, setClassFilter] = useState<ContentClass | "all">("all");
  const { data: drafts, isLoading, error, refetch } = useDrafts(statusFilter === "all" ? undefined : statusFilter);
  const { approve, reject, publish, update, generate, generateGraphics, remove, updatePlatforms, schedule, unschedule } = useDraftMutations();
  const { data: status } = useStatus();
  const { data: availablePlatformsData } = useAvailablePlatforms();
  const connectedPlatforms = availablePlatformsData?.platforms ?? ["instagram"];
  const { data: recentPublished } = useDrafts("published", 3);

  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);
  const { data: selectedDraft } = useDraft(selectedDraftId ?? 0);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [generateConfirmOpen, setGenerateConfirmOpen] = useState(false);
  const [generateCount, setGenerateCount] = useState(3);
  const [listExpanded, setListExpanded] = useState(false);

  // Track which draft IDs have been manually edited
  const [editedIds, setEditedIds] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("bluemarlin_edited_ids") ?? "[]")); } catch { return new Set(); }
  });
  const markEdited = (id: number) => {
    setEditedIds(prev => {
      const next = new Set(prev); next.add(id);
      localStorage.setItem("bluemarlin_edited_ids", JSON.stringify([...next]));
      return next;
    });
  };
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [editFbCaption, setEditFbCaption] = useState("");
  const [editHashtags, setEditHashtags] = useState("");
  const [editVisualSuggestion, setEditVisualSuggestion] = useState("");
  const [editReasoning, setEditReasoning] = useState("");

  // Schedule state
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [classGuideOpen, setClassGuideOpen] = useState(false);


  // Open specific draft from URL param
  useEffect(() => {
    const draftParam = searchParams.get("draft");
    if (draftParam) {
      const id = parseInt(draftParam, 10);
      if (!isNaN(id)) {
        setSelectedDraftId(id);
        setStatusFilter("pending");
        setView("detail");
        searchParams.delete("draft");
        setSearchParams(searchParams, { replace: true });
      }
    }
    if (searchParams.get("generate") === "true") {
      setGenerateConfirmOpen(true);
      searchParams.delete("generate");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openDraft = (id: number) => {
    setSelectedDraftId(id);
    setView("detail");
    setIsEditing(false);
  };

  const backToList = () => {
    setView("list");
    setSelectedDraftId(null);
    setIsEditing(false);
  };


  // Handlers
  const handleReject = () => {
    if (selectedDraft) {
      reject.mutate({ id: selectedDraft.id, reason: rejectReason || "No reason provided" });
      setRejectModalOpen(false);
      setRejectReason("");
      backToList();
    }
  };

  const startEditing = () => {
    if (!selectedDraft) return;
    setEditCaption(selectedDraft.instagram_caption);
    setEditFbCaption(selectedDraft.facebook_caption);
    setEditHashtags(selectedDraft.hashtags.join(", "));
    setEditVisualSuggestion(selectedDraft.visual_suggestion ?? "");
    setEditReasoning(selectedDraft.reasoning ?? "");
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!selectedDraft) return;
    const hashtags = editHashtags.split(",").map(t => t.trim()).filter(Boolean);
    const visualChanged = editVisualSuggestion.trim() !== (selectedDraft.visual_suggestion ?? "").trim();
    const draftId = selectedDraft.id;
    update.mutate(
      {
        id: draftId,
        data: {
          instagram_caption: editCaption,
          facebook_caption: editFbCaption,
          hashtags,
          visual_suggestion: editVisualSuggestion,
          reasoning: editReasoning,
          status: "pending",
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          markEdited(draftId);
          if (visualChanged) {
            generateGraphics.mutate(draftId);
          }
        },
      }
    );
  };


  // Sort & filter
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "date" ? "desc" : "asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/60" />;
    return sortDirection === "asc"
      ? <ArrowUp className="w-3.5 h-3.5 text-primary" />
      : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
  };

  const statusOrder: Record<DraftStatus, number> = { pending: 0, approved: 1, rejected: 2, published: 3, scheduled: 4, deleted: 5 };
  const classOrder: Record<ContentClass, number> = { A: 0, B: 1, C: 2, D: 3 };

  const filteredDrafts = useMemo(() => {
    if (!drafts) return [];
    let result = [...drafts];
    if (classFilter !== "all") result = result.filter(d => d.content_class === classFilter);
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortField === "status") cmp = statusOrder[a.status] - statusOrder[b.status];
      else if (sortField === "class") cmp = classOrder[a.content_class] - classOrder[b.content_class];
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return result;
  }, [drafts, classFilter, sortField, sortDirection]);

  return (
    <div className="h-full flex flex-col">

      {/* ── BREADCRUMB ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <button onClick={goBack} className="flex items-center gap-1 text-foreground/40 hover:text-foreground transition-colors pr-2 border-r border-border mr-1">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => navigate("/dashboard")} className="font-medium transition-colors text-muted-foreground hover:text-foreground">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <button onClick={backToList} className={cn("font-medium transition-colors", view === "list" ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
          Social Media
        </button>
        {view === "detail" && selectedDraft && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-foreground font-medium">Draft #{selectedDraft.id}</span>
          </>
        )}
      </div>

      {/* ── LIST VIEW ───────────────────────────────────────────── */}
      {view === "list" && (
        <>
          <div className="mb-6 shrink-0">
            <h1 className="text-3xl font-display font-bold text-foreground">Social Media</h1>
          </div>

          {/* ── Stats bar ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 shrink-0">
            {[
              { label: "Waiting",   value: status?.pending ?? 0,   dot: "bg-orange-500",  filter: "pending"   as DraftStatus },
              { label: "Approved",  value: status?.approved ?? 0,  dot: "bg-emerald-400", filter: "approved"  as DraftStatus },
              { label: "Published", value: status?.published ?? 0, dot: "bg-blue-400",    filter: "published" as DraftStatus },
            ].map(({ label, value, dot, filter }) => {
              const active = statusFilter === filter;
              return (
                <button
                  key={label}
                  onClick={() => setStatusFilter(filter)}
                  className={cn(
                    "glass-card rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-all",
                    active
                      ? "border-primary/50 ring-1 ring-primary/30 bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/30 cursor-pointer"
                  )}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <div className="min-w-0">
                    <p className={cn("text-xs font-medium", active ? "text-primary/80" : "text-foreground/55")}>{label}</p>
                    <p className={cn("text-sm font-bold truncate", active ? "text-primary" : "text-foreground")}>{value}</p>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setGenerateConfirmOpen(true)}
              disabled={generate.isPending}
              className="rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-all bg-sky-600 hover:bg-sky-500 border border-sky-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sky-900/40"
            >
              {generate.isPending
                ? <Loader2 className="w-3.5 h-3.5 shrink-0 text-white animate-spin" />
                : <Sparkles className="w-3.5 h-3.5 shrink-0 text-white" />}
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/70">Action</p>
                <p className="text-sm font-bold text-white truncate">
                  {generate.isPending ? "Generating…" : "Generate Posts"}
                </p>
              </div>
            </button>
          </div>

          <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-white/5">
            <div className="p-4 border-b border-border flex flex-col gap-3 bg-muted/50">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="overflow-x-auto scrollbar-none">
                  <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 min-w-max">
                    {([
                      { value: "pending",   label: "Pending",   count: status?.pending,   activeBadge: "bg-amber-500 text-white ring-amber-600/40",   activeText: "text-amber-500" },
                      { value: "approved",  label: "Approved",  count: status?.approved,  activeBadge: "bg-emerald-500 text-white ring-emerald-600/40", activeText: "text-emerald-500" },
                      { value: "published", label: "Published", count: status?.published, activeBadge: "bg-sky-500 text-white ring-sky-600/40",         activeText: "text-sky-500" },
                      { value: "scheduled", label: "Scheduled", count: undefined,         activeBadge: "bg-purple-500 text-white ring-purple-600/40",  activeText: "text-purple-500" },
                      { value: "rejected",  label: "Rejected",  count: status?.rejected,  activeBadge: "bg-rose-500 text-white ring-rose-600/40",      activeText: "text-rose-500" },
                      { value: "all",       label: "All",       count: (status?.pending ?? 0) + (status?.approved ?? 0) + (status?.rejected ?? 0) + (status?.published ?? 0), activeBadge: "bg-primary text-white ring-primary/40", activeText: "text-primary" },
                    ] as const).map(({ value, label, count, activeBadge }) => {
                      const active = statusFilter === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setStatusFilter(value as DraftStatus | "all")}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            active ? "bg-primary/15 text-primary" : "text-foreground/60 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          {label}
                          {count != null && count > 0 && (
                            <span className={cn(
                              "text-[11px] font-bold tabular-nums min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1.5 ring-1",
                              active ? activeBadge : "bg-foreground/15 text-foreground ring-foreground/20"
                            )}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-card p-1 rounded-lg border border-border">
                    <span className="text-xs text-foreground/70 px-2 font-medium">Class</span>
                    <button onClick={() => setClassFilter("all")} className={cn("px-2 py-1 text-xs font-medium rounded-md transition-colors", classFilter === "all" ? "bg-muted text-foreground" : "text-foreground/65 hover:text-foreground")}>All</button>
                    {ALL_CLASSES.map(c => {
                      const colors: Record<ContentClass, string> = { A: "text-sky-500", B: "text-emerald-500", C: "text-orange-500", D: "text-purple-500" };
                      return (
                        <button key={c} onClick={() => setClassFilter(c)} className={cn("w-7 h-7 text-xs font-bold rounded-md transition-colors flex items-center justify-center", classFilter === c ? "bg-muted" : "hover:bg-muted/50", colors[c])}>{c}</button>
                      );
                    })}
                    <button
                      onClick={() => setClassGuideOpen(true)}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-foreground/55 hover:text-foreground/80 hover:bg-muted/50 transition-colors ml-0.5"
                      title="What do A, B, C, D mean?"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-foreground/60 uppercase tracking-wider px-1">
                <div className="w-16 shrink-0" />
                <div className="flex-1 flex items-center gap-6 ml-4">
                  <button onClick={() => toggleSort("class")} className="flex items-center gap-1 hover:text-foreground transition-colors">Class <SortIcon field="class" /></button>
                  <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground transition-colors">Date <SortIcon field="date" /></button>
                  <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-foreground transition-colors ml-auto">Status <SortIcon field="status" /></button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-0 relative">
              {isLoading ? (
                <div className="p-4 space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-20 w-full bg-muted/50 rounded-xl" />)}</div>
              ) : error ? (
                <ErrorState error={error} onRetry={() => refetch()} title="Failed to load drafts" />
              ) : !filteredDrafts.length ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <ListTodo className="w-16 h-16 text-muted-foreground/20 mb-4" />
                  <h3 className="text-xl font-medium text-foreground/80">No drafts found</h3>
                  <p className="text-muted-foreground max-w-md mt-2">Adjust your filters or generate new drafts from the Overview page.</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {(listExpanded ? filteredDrafts : filteredDrafts.slice(0, 3)).map((draft) => {
                    const rowStyle =
                      draft.status === "approved"  ? { border: "border-l-emerald-500", bg: "bg-emerald-50/50 dark:bg-emerald-950/20" }
                    : draft.status === "rejected"  ? { border: "border-l-rose-500",    bg: "bg-rose-50/50 dark:bg-rose-950/20" }
                    : draft.status === "published" ? { border: "border-l-sky-500",     bg: "bg-sky-50/50 dark:bg-sky-950/20" }
                    : draft.status === "scheduled" ? { border: "border-l-purple-500",  bg: "bg-purple-50/50 dark:bg-purple-950/20" }
                                                   : { border: "border-l-orange-500",  bg: "bg-orange-50/50 dark:bg-orange-950/20" };
                    return (
                      <div
                        key={draft.id}
                        onClick={() => openDraft(draft.id)}
                        className={cn("p-4 rounded-xl border-l-4 border-t border-r border-b border-border/65 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-start gap-3 group", rowStyle.border, rowStyle.bg)}
                      >
                        <div className={cn("w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-xl font-bold relative",
                          draft.content_class === "A" ? "bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400" : draft.content_class === "B" ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : draft.content_class === "C" ? "bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400" : "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400"
                        )}>
                          {draft.content_class}
                          {editedIds.has(draft.id) && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-background flex items-center justify-center">
                              <Pencil className="w-1.5 h-1.5 text-white" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <ClassBadge contentClass={draft.content_class} />
                            <span className="text-xs font-mono text-muted-foreground/60">#{draft.id}</span>
                            <span className="text-xs font-medium text-muted-foreground">{format(new Date(draft.created_at), 'MMM d, h:mm a')}</span>
                            {editedIds.has(draft.id) && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/10 border border-sky-500/20 rounded-full px-2 py-0.5">
                                <Pencil className="w-2.5 h-2.5" /> Edited
                              </span>
                            )}
                            <StatusBadge status={draft.status} className="ml-auto" />
                          </div>
                          <p className="text-sm text-foreground/80 line-clamp-2">{draft.instagram_caption}</p>
                          {(draft.platforms ?? ["instagram"]).length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1">
                              {(draft.platforms ?? ["instagram"]).map((p: string) => (
                                <span key={p} className="inline-flex items-center gap-1 text-xs text-muted-foreground/60">
                                  {p === "instagram" ? <Instagram className="w-3 h-3" /> : <Facebook className="w-3 h-3" />}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {draft.image_path && (
                          <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-border/70 self-center">
                            <AuthImage draftId={draft.id} className="w-full h-full object-cover" fallbackText="" />
                          </div>
                        )}
                        <div className="shrink-0 self-center">
                          <ArrowRight className="w-5 h-5 text-muted-foreground/40" />
                        </div>
                      </div>
                    );
                  })}
                  {filteredDrafts.length > 3 && (
                    <button
                      onClick={() => setListExpanded(e => !e)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 mt-1 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/30 transition-all"
                    >
                      {listExpanded
                        ? <><ChevronUp className="w-4 h-4" /> Show less</>
                        : <><ChevronDown className="w-4 h-4" /> Show {filteredDrafts.length - 3} more</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── DETAIL VIEW ─────────────────────────────────────────── */}
      {view === "detail" && selectedDraft && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ClassBadge contentClass={selectedDraft.content_class} />
              <StatusBadge status={selectedDraft.status} />
              {editedIds.has(selectedDraft.id) && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full px-2.5 py-0.5">
                  <Pencil className="w-3 h-3" /> Edited
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{format(new Date(selectedDraft.created_at), 'MMM d, yyyy — h:mm a')}</span>
          </div>

          {selectedDraft.status === "published" && selectedDraft.instagram_url && (
            <div className="mb-5">
              <a
                href={selectedDraft.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-rose-500 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View on Instagram
              </a>
            </div>
          )}

          {selectedDraft.rejection_reason && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-3 text-sm text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p><strong>Rejection Reason:</strong> {selectedDraft.rejection_reason}</p>
            </div>
          )}

          {selectedDraft.image_path && (
            <div className="mb-6 shrink-0" id="post-image-preview">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Post Preview</h3>
              <div className="rounded-xl overflow-hidden border border-border bg-black/40 max-w-sm">
                <AuthImage draftId={selectedDraft.id} />
              </div>
            </div>
          )}


          <div className="flex-1 space-y-6 overflow-y-auto min-h-0 pb-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Instagram Copy</h3>
              {isEditing ? (
                <Textarea value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="min-h-[120px] bg-muted/50 border-border text-sm text-foreground" />
              ) : (
                <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{selectedDraft.instagram_caption}</div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Facebook Copy</h3>
              {isEditing ? (
                <Textarea value={editFbCaption} onChange={(e) => setEditFbCaption(e.target.value)} className="min-h-[120px] bg-muted/50 border-border text-sm text-foreground" />
              ) : (
                <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{selectedDraft.facebook_caption}</div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Hashtags</h3>
              {isEditing ? (
                <Input value={editHashtags} onChange={(e) => setEditHashtags(e.target.value)} placeholder="#tag1, #tag2, #tag3" className="bg-muted/50 border-border text-sm text-foreground" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedDraft.hashtags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>

            {(selectedDraft.visual_suggestion || isEditing) && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Suggested Image Direction
                </h3>
                {isEditing ? (
                  <Textarea value={editVisualSuggestion} onChange={(e) => setEditVisualSuggestion(e.target.value)} className="min-h-[80px] bg-muted/50 border-border text-sm text-foreground" />
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm text-foreground/70 italic">"{selectedDraft.visual_suggestion}"</div>
                    {generateGraphics.isPending && (
                      <div className="flex items-center gap-2 text-xs text-sky-400 animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Regenerating image based on new direction…
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {(selectedDraft.reasoning || isEditing) && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Why This Was Suggested</h3>
                {isEditing ? (
                  <Textarea value={editReasoning} onChange={(e) => setEditReasoning(e.target.value)} className="min-h-[80px] bg-muted/50 border-border text-sm text-foreground" />
                ) : (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border text-sm text-foreground/60 italic">"{selectedDraft.reasoning}"</div>
                )}
              </div>
            )}
          </div>

          {/* Platform selector */}
          {!isEditing && (selectedDraft.status === 'pending' || selectedDraft.status === 'approved') && connectedPlatforms.length > 0 && (
            <div className="shrink-0 mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Publish to</p>
              <div className="flex gap-2">
                {connectedPlatforms.map((platform) => {
                  const draftPlatforms = selectedDraft.platforms ?? ["instagram"];
                  const isActive = draftPlatforms.includes(platform);
                  const Icon = platform === "instagram" ? Instagram
                    : platform === "facebook" ? Facebook
                    : platform === "twitter" ? XBrandIcon
                    : Globe;
                  const label = platform === "twitter" ? "X" : platform.charAt(0).toUpperCase() + platform.slice(1);
                  return (
                    <button
                      key={platform}
                      disabled={updatePlatforms.isPending}
                      onClick={() => {
                        const next = isActive
                          ? draftPlatforms.filter((p: string) => p !== platform)
                          : [...draftPlatforms, platform];
                        updatePlatforms.mutate({ id: selectedDraft.id, platforms: next });
                      }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                        isActive
                          ? platform === "instagram"
                            ? "bg-gradient-to-r from-fuchsia-500/15 to-rose-500/15 border-fuchsia-500/30 text-fuchsia-400"
                            : platform === "twitter"
                            ? "bg-neutral-400/15 border-neutral-400/30 text-neutral-300"
                            : "bg-blue-500/15 border-blue-500/30 text-blue-400"
                          : "bg-muted/30 border-border text-muted-foreground/50 hover:text-muted-foreground hover:border-border",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="shrink-0 mt-4 pt-4 flex gap-3 border-t border-border bg-background [padding-bottom:max(1rem,env(safe-area-inset-bottom))]">
            {isEditing && (
              <>
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 text-foreground/70 hover:bg-muted"><X className="w-4 h-4 mr-2" /> Cancel</Button>
                <Button
                  onPointerDown={(e) => { e.preventDefault(); if (!update.isPending) saveEdit(); }}
                  disabled={update.isPending}
                  className="flex-1 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white"
                  style={{ touchAction: "manipulation" }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {update.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}

            {!isEditing && selectedDraft.status === 'pending' && (
              <>
                <Button onClick={() => setRejectModalOpen(true)} className="flex-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
                <Button variant="outline" onClick={startEditing} className="flex-1 border-border text-foreground hover:bg-muted"><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
                <Button onClick={() => { approve.mutate(selectedDraft.id); }} disabled={approve.isPending} className="flex-1 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"><CheckCircle2 className="w-4 h-4 mr-2" />{approve.isPending ? "Approving..." : "Approve"}</Button>
              </>
            )}
            {!isEditing && selectedDraft.status === 'pending' && (
              <Button
                variant="ghost"
                onClick={() => { remove.mutate(selectedDraft.id); backToList(); }}
                disabled={remove.isPending}
                className="w-full text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 text-xs mt-1"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                {remove.isPending ? "Deleting..." : "Delete"}
              </Button>
            )}

            {!isEditing && selectedDraft.status === 'approved' && (
              <>
                <Button onClick={() => { publish.mutate(selectedDraft.id); backToList(); }} disabled={publish.isPending || (selectedDraft.platforms ?? []).length === 0} className="flex-[2] bg-blue-500 text-foreground hover:bg-blue-400 shadow-lg shadow-blue-500/20"><Send className="w-4 h-4 mr-2" />{publish.isPending ? "Publishing..." : "Publish Now"}</Button>
                <Button onClick={() => setScheduleOpen(true)} variant="outline" className="shrink-0 border-border text-foreground hover:bg-muted text-sm px-4"><CalendarDays className="w-3.5 h-3.5 mr-1.5" />Schedule</Button>
              </>
            )}
            {!isEditing && selectedDraft.status === 'approved' && (
              <Button
                variant="ghost"
                onClick={() => { remove.mutate(selectedDraft.id); backToList(); }}
                disabled={remove.isPending}
                className="w-full text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 text-xs mt-1"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                {remove.isPending ? "Deleting..." : "Delete"}
              </Button>
            )}

            {!isEditing && selectedDraft.status === 'scheduled' && (
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Scheduled for {selectedDraft.scheduled_at ? format(new Date(selectedDraft.scheduled_at), 'MMM d, yyyy — h:mm a') : 'unknown'}</span>
                </div>
                <Button onClick={() => { unschedule.mutate(selectedDraft.id); backToList(); }} disabled={unschedule.isPending} variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                  {unschedule.isPending ? "Unscheduling..." : "Unschedule"}
                </Button>
              </div>
            )}
            {!isEditing && selectedDraft.status === 'scheduled' && (
              <Button
                variant="ghost"
                onClick={() => { remove.mutate(selectedDraft.id); backToList(); }}
                disabled={remove.isPending}
                className="w-full text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 text-xs mt-1"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                {remove.isPending ? "Deleting..." : "Delete"}
              </Button>
            )}

            {!isEditing && selectedDraft.status === 'published' && (
              <Button variant="outline" className="w-full border-border text-muted-foreground" disabled>No actions available</Button>
            )}

            {!isEditing && (selectedDraft.status === 'rejected' || selectedDraft.status === 'deleted') && (
              <Button
                variant="outline"
                onClick={() => { remove.mutate(selectedDraft.id); backToList(); }}
                disabled={remove.isPending}
                className="w-full border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {remove.isPending ? "Deleting..." : "Delete Draft"}
              </Button>
            )}
          </div>
        </div>
      )}


      {/* ── CLASS GUIDE DIALOG ──────────────────────────────────── */}
      <Dialog open={classGuideOpen} onOpenChange={setClassGuideOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-display">Post Class Types</DialogTitle>
            <DialogDescription className="text-foreground/55">
              Each draft is assigned a class that describes its purpose.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-3 text-sm py-2">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0 mt-0.5">A</span>
              <div><p className="font-semibold text-foreground">Evergreen</p><p className="text-foreground/55 text-xs mt-0.5">Destination highlights, brand storytelling, and timeless content.</p></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 mt-0.5">B</span>
              <div><p className="font-semibold text-foreground">Commercial</p><p className="text-foreground/55 text-xs mt-0.5">Availability, promotions, and booking nudges.</p></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs shrink-0 mt-0.5">C</span>
              <div><p className="font-semibold text-foreground">Operational</p><p className="text-foreground/55 text-xs mt-0.5">Schedule changes, sold-out notices, and service updates.</p></div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs shrink-0 mt-0.5">D</span>
              <div><p className="font-semibold text-foreground">Reactive</p><p className="text-foreground/55 text-xs mt-0.5">Events, holidays, and timely posts tied to current happenings.</p></div>
            </li>
          </ul>
        </DialogContent>
      </Dialog>

      {/* ── REJECT DIALOG ───────────────────────────────────────── */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Reject Draft</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Reason is <strong>optional</strong>. If provided, it helps our system avoid similar drafts in the future.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReject(); } }}
              placeholder="Leave blank or add a note, e.g. 'Tone is too playful'"
              className="min-h-[90px] bg-muted/50 border-border focus:border-rose-500/50 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectModalOpen(false)} className="text-foreground/70 hover:bg-muted">Cancel</Button>
            <Button onClick={handleReject} disabled={reject.isPending} className="bg-rose-500 text-foreground hover:bg-rose-600">Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl">Schedule Post</DialogTitle>
            <DialogDescription className="text-muted-foreground">Pick a date and time, or leave empty to auto-assign the next open slot.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Date</label>
              <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-muted/50 border-border" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Time (UTC)</label>
              <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-muted/50 border-border" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setScheduleOpen(false)} className="text-foreground/70">Cancel</Button>
            <Button
              disabled={schedule.isPending}
              onClick={() => {
                if (!selectedDraft) return;
                const scheduledAt = scheduleDate && scheduleTime
                  ? new Date(`${scheduleDate}T${scheduleTime}:00Z`).toISOString()
                  : undefined;
                schedule.mutate({ id: selectedDraft.id, scheduledAt }, {
                  onSuccess: () => {
                    setScheduleOpen(false);
                    setScheduleDate("");
                    setScheduleTime("");
                    backToList();
                  },
                });
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              {schedule.isPending ? "Scheduling..." : scheduleDate && scheduleTime ? "Schedule" : "Auto-assign Slot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Generate Confirm Dialog ───────────────────────────────── */}
      <Dialog open={generateConfirmOpen} onOpenChange={setGenerateConfirmOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-sm">
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-lg font-display">Generate {generateCount} new post{generateCount === 1 ? "" : "s"}?</DialogTitle>
            <DialogDescription className="text-foreground/60 mt-1">
              Our system will write new social media drafts based on your current availability, brand voice, and recent content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 3, 5, 10].map((n) => (
              <button
                key={n}
                onClick={() => setGenerateCount(n)}
                className={cn(
                  "w-10 h-10 rounded-lg text-sm font-semibold transition-all",
                  generateCount === n
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <DialogFooter className="mt-2 flex gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 border-border"
              onClick={() => setGenerateConfirmOpen(false)}
            >
              No, cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setGenerateConfirmOpen(false);
                generate.mutate(generateCount);
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Yes, generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

