import { useState, useCallback, useEffect } from "react";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { useEscalations, useEscalationMutations, useSuggestReply, useEscalationReply, useCustomerByIdentifier, useDeleteEscalation } from "@dashboard/hooks/use-bluemarlin";
import { useReadStatus } from "@dashboard/hooks/use-read-status";
import { useEmailSettings, openEmailCompose } from "@dashboard/hooks/use-email-settings";
import { usePlatformFilter } from "@dashboard/hooks/use-platform-filter";
import { matchesPlatformFilter } from "@dashboard/lib/channel-map";
import { PlatformFilterBar } from "@dashboard/components/PlatformFilterBar";
import { Button } from "@dashboard/components/ui/button";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import {
  AlertTriangle, ArrowLeft, ChevronRight, ChevronDown, ChevronUp, CheckCircle2,
  Mail, Phone, Clock, Shield, Archive, ArchiveRestore, Eye, Circle, CheckCircle,
  X, Send, Wand2, Trash2,
} from "lucide-react";
import { cn } from "@dashboard/lib/utils";
import { formatDistanceToNow } from "date-fns";

const FILTERS = ["All", "Semi", "Full", "Pending", "Resolved"];
const HIDDEN_KEY = "bluemarlin_hidden_escalations";
const READ_KEY = "bluemarlin_read_escalations";

function useHiddenEscalations() {
  const load = (): Set<string> => {
    try {
      const raw = localStorage.getItem(HIDDEN_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  };
  const [hidden, setHidden] = useState<Set<string>>(load);

  const hide = useCallback((id: string) => {
    setHidden((prev) => {
      const next = new Set(prev); next.add(id);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const unhide = useCallback((id: string) => {
    setHidden((prev) => {
      const next = new Set(prev); next.delete(id);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const unhideAll = useCallback(() => {
    localStorage.removeItem(HIDDEN_KEY);
    setHidden(new Set());
  }, []);

  return { hidden, hide, unhide, unhideAll };
}

type View = "list" | "detail";
interface ComposeState { to: string; subject: string; body: string; }

export default function Escalations() {
  const goBack = useGoBack();
  const { data: escalations, isLoading } = useEscalations();
  const { resolve } = useEscalationMutations();
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);
  const [compose, setCompose] = useState<ComposeState | null>(null);

  useEffect(() => {
    const handler = () => { setView("list"); setSelectedId(null); };
    window.addEventListener("bluemarlin:nav:escalations", handler);
    return () => window.removeEventListener("bluemarlin:nav:escalations", handler);
  }, []);

  const { hidden, hide, unhide, unhideAll } = useHiddenEscalations();
  const { readSet, markRead, markUnread } = useReadStatus(READ_KEY);
  const { settings: emailSettings } = useEmailSettings();
  const suggestReply = useSuggestReply();
  const escalationReply = useEscalationReply();
  const { selected: platformFilter } = usePlatformFilter();

  const allEscalations = escalations ?? [];
  const platformFiltered = allEscalations.filter((e) => matchesPlatformFilter(e.channel, platformFilter));
  const visibleAll = platformFiltered.filter((e) => !hidden.has(String(e.id)));
  const hiddenEscalations = platformFiltered.filter((e) => hidden.has(String(e.id)));
  const hiddenCount = hiddenEscalations.length;

  const pendingCount = visibleAll.filter((e) => e.status !== "resolved").length;
  const resolvedCount = visibleAll.filter((e) => e.status === "resolved").length;
  const semiCount = visibleAll.filter((e) => e.notification_type === "relay" || e.notification_type === "semi_escalation").length;
  const fullCount = visibleAll.filter((e) => e.notification_type !== "relay" && e.notification_type !== "semi_escalation").length;
  const allCount = visibleAll.length;
  const unreadCount = visibleAll.filter((e) => !readSet.has(String(e.id))).length;

  const tabCount = (f: string) => {
    if (f === "Pending") return pendingCount;
    if (f === "Resolved") return resolvedCount;
    if (f === "Semi") return semiCount;
    if (f === "Full") return fullCount;
    return allCount;
  };

  const filtered = visibleAll.filter((e) => {
    if (activeFilter === "Pending") return e.status !== "resolved";
    if (activeFilter === "Resolved") return e.status === "resolved";
    if (activeFilter === "Semi") return e.notification_type === "relay" || e.notification_type === "semi_escalation";
    if (activeFilter === "Full") return e.notification_type !== "relay" && e.notification_type !== "semi_escalation";
    return true;
  });

  const selected = allEscalations.find((e) => e.id === selectedId);

  // Brief 167/172: resolve the customer file for the selected escalation so
  // we can show a real phone number + display name instead of the Zernio hex.
  const customerLookupType = selected?.channel === "email"
    ? "email"
    : (selected && /^[a-f0-9]{24}$/i.test(selected.customer_id) ? "wa_conversation_id" : "phone");
  const { data: customerFile } = useCustomerByIdentifier(
    selected ? customerLookupType : undefined,
    selected?.customer_id,
  );

  const openDetail = (id: number, openCompose = false) => {
    setSelectedId(id);
    setView("detail");
    markRead(String(id));
    if (openCompose) {
      const esc = allEscalations.find(e => e.id === id);
      if (esc) {
        const parsed = parseEscalationBody(esc.body);
        setCompose({
          to: isSemi(esc.notification_type) ? "" : parsed.email,
          subject: isSemi(esc.notification_type) ? "" : `Re: ${cleanSubject(esc.subject)}`,
          body: "",
        });
      }
    } else {
      setCompose(null);
    }
  };

  const backToList = () => { setView("list"); setSelectedId(null); setCompose(null); };

  const getTypeLabel = (type: string) => {
    if (type === "relay" || type === "semi_escalation") return "Semi";
    return "Full";
  };
  const isSemi = (type: string) => type === "relay" || type === "semi_escalation";

  const parseEscalationBody = (body: string) => {
    const emailMatch = body.match(/Email:\s*(\S+@\S+)/i);
    const phoneMatch = body.match(/WhatsApp:\s*([^\s)]+)/);
    const questionMatch = body.match(/Their question:\s*(.+?)(?:\n|$)/);
    const chatLogStart = body.indexOf("=== CHAT LOG ===");
    const chatLog = chatLogStart >= 0 ? body.slice(chatLogStart + 16).trim() : "";
    return {
      email: emailMatch?.[1] || "",
      phone: phoneMatch?.[1] || "",
      question: questionMatch?.[1]?.trim() || "",
      chatLog,
    };
  };

  const cleanSubject = (subject: string): string => {
    const parts = subject.split(" - ");
    const intent = parts[parts.length - 1]?.trim() || subject;
    return intent.charAt(0).toUpperCase() + intent.slice(1);
  };

  const deleteEsc = useDeleteEscalation();
  const handleDeleteEscalation = (id: string) => {
    if (window.confirm(`Permanently delete this escalation? This cannot be undone.`)) {
      deleteEsc.mutate(Number(id));
    }
  };

  const sendCompose = () => {
    if (!compose) return;
    openEmailCompose(emailSettings, compose.to, compose.subject, compose.body);
    setCompose(null);
  };

  const EscalationRow = ({ esc, isHidden = false, onDelete }: { esc: typeof allEscalations[0]; isHidden?: boolean; onDelete?: (id: string) => void }) => {
    const isResolved = esc.status === "resolved";
    const semi = isSemi(esc.notification_type);
    const isRead = readSet.has(String(esc.id));

    return (
      <div
        className={cn(
          "flex items-start gap-4 px-4 py-4 rounded-xl border border-border/60 bg-card cursor-pointer select-none group",
          "transition-all duration-150",
          "hover:border-border hover:shadow-lg hover:shadow-black/20 hover:-translate-y-px",
          isHidden && "opacity-50"
        )}
        onClick={() => openDetail(esc.id)}
      >
        <div className="relative w-9 h-9 rounded-full bg-foreground/[0.06] flex items-center justify-center shrink-0 mt-0.5">
          {isResolved
            ? <CheckCircle2 className="w-4 h-4 text-emerald-400/70" />
            : <AlertTriangle className={cn("w-4 h-4", semi ? "text-muted-foreground/50" : "text-rose-400/70")} />}
          {!isRead && !isHidden && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={cn("text-sm text-foreground", isRead ? "font-medium" : "font-semibold")}>{esc.customer_name}</span>
            <span className="text-xs text-muted-foreground/50 tabular-nums shrink-0">
              {formatDistanceToNow(new Date(esc.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className={cn("text-xs line-clamp-2 leading-relaxed", isRead ? "text-muted-foreground/55" : "text-foreground/75")}>{esc.subject}</p>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className={cn(
              "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border",
              semi
                ? "bg-foreground/[0.05] text-muted-foreground/70 border-border/40"
                : "bg-rose-500/8 text-rose-400/80 border-rose-500/15"
            )}>
              {getTypeLabel(esc.notification_type)}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-md bg-foreground/[0.05] text-muted-foreground/70 border border-border/40">
              {esc.channel === "email" ? <Mail className="w-2.5 h-2.5" /> : <Phone className="w-2.5 h-2.5" />}
              {esc.channel}
            </span>
            {isResolved && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/8 text-emerald-400/80 border border-emerald-500/15">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Resolved
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 self-center flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); openDetail(esc.id, true); }}
            title={semi ? "Reply to customer" : "Send email to customer"}
            className="p-1.5 rounded-lg text-amber-400/50 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
          >
            {semi ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); isRead ? markUnread(String(esc.id)) : markRead(String(esc.id)); }}
            title={isRead ? "Mark as unread" : "Mark as read"}
            className="p-1.5 rounded-lg text-sky-400/50 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
          >
            {isRead ? <Circle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </button>
          {isHidden ? (
            <button
              onClick={(e) => { e.stopPropagation(); unhide(String(esc.id)); }}
              title="Restore from archive"
              className="p-1.5 rounded-lg text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
            >
              <ArchiveRestore className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); hide(String(esc.id)); }}
              title="Archive this escalation"
              className="p-1.5 rounded-lg text-slate-400/50 hover:text-slate-300 hover:bg-white/5 transition-colors"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
          {isHidden && onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(String(esc.id)); }}
              title="Delete escalation"
              className="p-1.5 rounded-lg text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Floating email compose modal */}
      {compose && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setCompose(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className={cn(
              "flex items-center justify-between px-5 py-3.5 border-b border-border",
              selected && isSemi(selected.notification_type) ? "bg-slate-500/10" : "bg-rose-500/10"
            )}>
              <div className="flex items-center gap-2.5">
                {selected && isSemi(selected.notification_type) ? (
                  <>
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-foreground">Semi Escalation Reply</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-500/20 text-slate-400 border border-slate-500/30">Semi</span>
                    <span className="text-xs text-muted-foreground">— Marina will reformat and send via WhatsApp</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-rose-400" />
                    <span className="text-sm font-semibold text-foreground">Full Escalation Email</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Full</span>
                    <span className="text-xs text-muted-foreground">— opens in {emailSettings.client === "gmail" ? "Gmail" : "your mail app"}</span>
                  </>
                )}
              </div>
              <button onClick={() => setCompose(null)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {/* Semi — read-only To + Context rows */}
              {selected && isSemi(selected.notification_type) && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-muted-foreground w-14 shrink-0">To</label>
                    <div className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/20 text-sm text-foreground/70">
                      {selected.customer_name}{selected.customer_id ? <span className="text-foreground/40 font-mono ml-2">· {selected.customer_id}</span> : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-muted-foreground w-14 shrink-0">Context</label>
                    <div className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/20 text-sm text-foreground/70">
                      {cleanSubject(selected.subject)}
                    </div>
                  </div>
                </>
              )}
              {/* Full email — editable To + Subject */}
              {selected && !isSemi(selected.notification_type) && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-muted-foreground w-14 shrink-0">To</label>
                    <input value={compose.to} onChange={(e) => setCompose({ ...compose, to: e.target.value })} placeholder="customer@email.com" className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-muted-foreground w-14 shrink-0">Subject</label>
                    <input value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })} className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                </>
              )}
              <div className="flex gap-3">
                <label className="text-xs font-semibold text-muted-foreground w-14 shrink-0 pt-2">
                  {selected && isSemi(selected.notification_type) ? "Reply" : "Body"}
                </label>
                <textarea
                  value={compose.body}
                  onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                  rows={5}
                  placeholder={selected && isSemi(selected.notification_type) ? "Type your answer to Marina here..." : ""}
                  className="flex-1 w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex justify-between items-center pt-1 gap-2">
                {selected && !isSemi(selected.notification_type) && (
                  <button
                    onClick={async () => {
                      if (!selected?.customer_id || !compose?.body.trim()) return;
                      try {
                        const result = await suggestReply.mutateAsync({ phone: selected.customer_id, draft_text: compose.body });
                        setCompose(prev => prev ? { ...prev, subject: result.subject, body: result.body } : prev);
                      } catch {}
                    }}
                    disabled={suggestReply.isPending || !compose?.body.trim()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-dashed border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    {suggestReply.isPending ? "Rewriting…" : "Rewrite"}
                  </button>
                )}
                {selected && isSemi(selected.notification_type) ? (
                  <button
                    onClick={async () => {
                      if (!selected || !compose?.body.trim()) return;
                      try {
                        await escalationReply.mutateAsync({ id: selected.id, answer: compose.body });
                        setCompose(null);
                        backToList();
                      } catch {}
                    }}
                    disabled={escalationReply.isPending || !compose?.body.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors ml-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {escalationReply.isPending ? "Sending…" : "Send Reply via Marina"}
                  </button>
                ) : (
                  <button onClick={sendCompose} disabled={!compose?.to} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors ml-auto">
                    <Send className="w-3.5 h-3.5" />
                    Open in {emailSettings.client === "gmail" ? "Gmail" : "Mail App"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={view === "detail" ? backToList : goBack} className="flex items-center gap-1 text-foreground/40 hover:text-foreground transition-colors pr-2 border-r border-border mr-1">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button onClick={backToList} className={cn("font-medium transition-colors", view === "list" ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
          Escalations
        </button>
        {view === "detail" && selected && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-foreground font-medium">{selected.customer_name}</span>
          </>
        )}
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-1 flex items-center gap-3">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
                Escalations
                {pendingCount > 0 && (
                  <span className="text-sm font-semibold bg-amber-500/15 text-amber-500 px-2.5 py-0.5 rounded-full">{pendingCount}</span>
                )}
              </h1>
              <p className="text-muted-foreground text-sm">Conversations that need your immediate attention.</p>
            </div>
            {unreadCount > 0 && (
              <span className="shrink-0 mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold border border-sky-500/25">
                <Circle className="w-2 h-2 fill-sky-400" />
                {unreadCount} unread
              </span>
            )}
          </div>

          <PlatformFilterBar className="mb-1" />

          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shrink-0 w-fit">
            {FILTERS.map((f) => {
              const count = tabCount(f);
              const active = activeFilter === f;
              const isPending = f === "Pending";
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-primary/15 text-primary" : "text-foreground/60 hover:text-foreground hover:bg-muted"
                  )}
                >
                  {f}
                  {count > 0 && (
                    <span className={cn(
                      "text-[11px] font-bold tabular-nums min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1.5 ring-1",
                      active
                        ? isPending
                          ? "bg-amber-500 text-white ring-amber-600/40"
                          : "bg-primary text-white ring-primary/40"
                        : "bg-foreground/15 text-foreground ring-foreground/20"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-3 flex-1 overflow-auto">
            {isLoading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
            ) : filtered.length > 0 ? (
              <>
                {(listExpanded ? filtered : filtered.slice(0, 3)).map((esc) => <EscalationRow key={esc.id} esc={esc} />)}
                {filtered.length > 3 && (
                  <button
                    onClick={() => setListExpanded(e => !e)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/30 transition-all"
                  >
                    {listExpanded
                      ? <><ChevronUp className="w-4 h-4" /> Show less</>
                      : <><ChevronDown className="w-4 h-4" /> Show {filtered.length - 3} more</>}
                  </button>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-border bg-card px-5 py-10 text-center">
                <Shield className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground/50">
                  {allEscalations.length === 0 ? "No escalations" : "No escalations match this filter"}
                </p>
              </div>
            )}

            {/* Archived escalations */}
            {hiddenCount > 0 && (
              <div className="pt-2 border-t border-border/40 mt-2">
                <button
                  onClick={() => setShowHidden(s => !s)}
                  className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors mb-3 pt-2"
                >
                  <Archive className="w-3.5 h-3.5" />
                  {showHidden ? "Hide" : "Show"} {hiddenCount} archived escalation{hiddenCount !== 1 ? "s" : ""}
                  {showHidden && (
                    <button
                      onClick={(e) => { e.stopPropagation(); unhideAll(); setShowHidden(false); }}
                      className="ml-2 text-primary hover:underline"
                    >
                      Restore all
                    </button>
                  )}
                </button>
                {showHidden && hiddenEscalations.map((esc) => (
                  <EscalationRow key={esc.id} esc={esc} isHidden onDelete={handleDeleteEscalation} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* DETAIL VIEW */}
      {view === "detail" && selected && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-4 shrink-0 flex-wrap">
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded",
              isSemi(selected.notification_type) ? "bg-blue-500/15 text-blue-400" : "bg-rose-500/15 text-rose-400"
            )}>
              {getTypeLabel(selected.notification_type)} Escalation
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              {selected.channel === "email" ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
              {selected.channel}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(selected.created_at), { addSuffix: true })}
            </span>
            <span className={cn(
              "text-xs font-bold uppercase px-2 py-0.5 rounded",
              selected.status === "resolved" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
            )}>
              {selected.status}
            </span>
            <div className="ml-auto flex items-center gap-2">
              {readSet.has(String(selected.id)) && (
                <button
                  onClick={() => markUnread(String(selected.id))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground bg-muted/40 hover:bg-muted border border-border transition-colors"
                >
                  <Circle className="w-3.5 h-3.5" /> Mark unread
                </button>
              )}
              {selected && (
                <button
                  onClick={() => {
                    const parsed = parseEscalationBody(selected.body);
                    setCompose({
                      to: isSemi(selected.notification_type) ? "" : parsed.email,
                      subject: isSemi(selected.notification_type) ? "" : `Re: ${cleanSubject(selected.subject)}`,
                      body: "",
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground bg-muted/40 hover:bg-muted border border-border transition-colors"
                >
                  {isSemi(selected.notification_type)
                    ? <><Phone className="w-3.5 h-3.5" /> Reply</>
                    : <><Mail className="w-3.5 h-3.5" /> Compose email</>
                  }
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
            {(() => {
              const parsed = parseEscalationBody(selected.body);
              return (
                <>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-muted/30 border border-border">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
                      <p className="text-sm font-medium text-foreground">{selected.customer_name}</p>
                    </div>
                    {parsed.email && (
                      <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-muted/30 border border-border">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                        <p className="text-sm text-foreground">{parsed.email}</p>
                      </div>
                    )}
                    <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-muted/30 border border-border">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
                      <p className="text-sm text-foreground">
                        {/* Brief 183: use enriched customer_contact from API */}
                        {selected.customer_contact || selected.customer_id}
                      </p>
                      {selected.customer_phone && selected.customer_phone !== selected.customer_contact && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono">{selected.customer_phone}</p>
                      )}
                      {selected.customer_email && selected.customer_email !== selected.customer_contact && (
                        <p className="text-xs text-muted-foreground mt-0.5">{selected.customer_email}</p>
                      )}
                    </div>
                    <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-muted/30 border border-border">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reason</p>
                      <p className="text-sm font-medium text-foreground">{parsed.question || cleanSubject(selected.subject)}</p>
                    </div>
                  </div>
                  {(parsed.chatLog || isSemi(selected.notification_type)) && (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {isSemi(selected.notification_type) ? "Relay Details" : "Conversation"}
                      </h3>
                      <pre className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed bg-muted/30 border border-border rounded-xl p-4 max-h-96 overflow-y-auto font-sans">
                        {isSemi(selected.notification_type) ? selected.body : parsed.chatLog}
                      </pre>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <div className="shrink-0 mt-4 pt-4 border-t border-border flex items-center gap-3">
            {selected.status !== "resolved" && (
              <Button
                onClick={() => { resolve.mutate(selected.id); backToList(); }}
                disabled={resolve.isPending}
                className="bg-emerald-500 text-white hover:bg-emerald-400"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {resolve.isPending ? "Resolving..." : "Mark Resolved"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm("Permanently delete this escalation? This cannot be undone.")) {
                  deleteEsc.mutate(selected.id);
                  backToList();
                }
              }}
              disabled={deleteEsc.isPending}
              className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteEsc.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
