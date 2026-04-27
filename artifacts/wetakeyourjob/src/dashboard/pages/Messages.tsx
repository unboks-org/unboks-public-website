import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { useConversations, useConversation, useDeleteConversation, useEscalations, useSuggestReply, useEscalationReply } from "@dashboard/hooks/use-bluemarlin";
import { useEmailSettings, openEmailCompose } from "@dashboard/hooks/use-email-settings";
import { Conversation } from "@dashboard/lib/api";
import { useReadStatus } from "@dashboard/hooks/use-read-status";
import { usePlatformFilter } from "@dashboard/hooks/use-platform-filter";
import { matchesPlatformFilter } from "@dashboard/lib/channel-map";
import { PlatformFilterBar } from "@dashboard/components/PlatformFilterBar";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import {
  MessageCircle, Phone, Search, ArrowLeft, ChevronRight, ChevronDown,
  AlertTriangle, User, Archive, ArchiveRestore, Circle, CheckCircle,
  CheckCircle2, Clock, Ticket, Instagram, Facebook, Twitter, Mail, Trash2, Check, X, Wand2, Send, Shield,
} from "lucide-react";
import { cn } from "@dashboard/lib/utils";
import { isToday, isThisYear, format, formatDistanceToNow } from "date-fns";

const HIDDEN_KEY = "bluemarlin_hidden_conversations";

function GmailCheckbox({
  checked,
  indeterminate,
  onChange,
  onClick,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <label
      onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
      className="relative flex items-center justify-center cursor-pointer"
    >
      <input
        type="checkbox"
        checked={checked}
        ref={(el) => { if (el) el.indeterminate = !!indeterminate; }}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={cn(
          "w-[16px] h-[16px] rounded-[2px] border flex items-center justify-center shrink-0 transition-colors",
          checked || indeterminate
            ? "bg-primary/70 border-primary/50"
            : "bg-transparent border-foreground/[0.22] hover:border-foreground/40"
        )}
      >
        {checked && <Check className="w-[10px] h-[10px] text-background" strokeWidth={3} />}
        {!checked && indeterminate && (
          <span className="w-[8px] h-[1.5px] bg-background rounded-full block" />
        )}
      </div>
    </label>
  );
}

function useHiddenConversations() {
  const load = (): Set<string> => {
    try {
      const raw = localStorage.getItem(HIDDEN_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  };
  const [hidden, setHidden] = useState<Set<string>>(load);

  const hide = useCallback((phone: string) => {
    setHidden((prev) => {
      const next = new Set(prev); next.add(phone);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event("bluemarlin:hidden"));
      return next;
    });
  }, []);

  const unhide = useCallback((phone: string) => {
    setHidden((prev) => {
      const next = new Set(prev); next.delete(phone);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event("bluemarlin:hidden"));
      return next;
    });
  }, []);

  const unhideAll = useCallback(() => {
    localStorage.removeItem(HIDDEN_KEY);
    setHidden(new Set());
    window.dispatchEvent(new Event("bluemarlin:hidden"));
  }, []);

  return { hidden, hide, unhide, unhideAll };
}

type View = "list" | "detail";
interface ComposeState { to: string; subject: string; body: string; }

const isSemi = (type: string) => type === "relay" || type === "semi_escalation";

const parseEscalationBody = (body: string) => {
  const emailMatch = body.match(/Email:\s*(\S+@\S+)/i);
  const phoneMatch = body.match(/WhatsApp:\s*([^\s)]+)/);
  const questionMatch = body.match(/Their question:\s*(.+?)(?:\n|$)/);
  const chatLogStart = body.indexOf("=== CHAT LOG ===");
  const chatLog = chatLogStart >= 0 ? body.slice(chatLogStart + 16).trim() : "";
  return { email: emailMatch?.[1] || "", phone: phoneMatch?.[1] || "", question: questionMatch?.[1]?.trim() || "", chatLog };
};

const cleanSubject = (subject: string): string => {
  const parts = subject.split(" - ");
  const intent = parts[parts.length - 1]?.trim() || subject;
  return intent.charAt(0).toUpperCase() + intent.slice(1);
};

function gmailDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "h:mm a");
  if (isThisYear(d)) return format(d, "MMM d");
  return format(d, "MMM d, yyyy");
}

function ChannelIcon({ channel }: { channel?: string }) {
  if (channel === "instagram_dm") return <Instagram className="w-3.5 h-3.5" />;
  if (channel === "facebook_dm") return <Facebook className="w-3.5 h-3.5" />;
  if (channel === "twitter_dm") return <Twitter className="w-3.5 h-3.5" />;
  if (channel === "email") return <Mail className="w-3.5 h-3.5" />;
  return <Phone className="w-3.5 h-3.5" />;
}

function channelLabel(channel?: string): string {
  if (channel === "instagram_dm") return "Instagram";
  if (channel === "facebook_dm") return "Facebook";
  if (channel === "twitter_dm") return "X / Twitter";
  if (channel === "email") return "Email";
  return "WhatsApp";
}

/** Looks like a raw UUID / long hex ID — not human-readable */
function looksLikeId(s: string): boolean {
  return /^[0-9a-f\-]{20,}$/i.test(s);
}

/**
 * Priority order for the main visible sender/customer label:
 * 1. Real name (has a space, or is an email, or is short & not an ID)
 * 2. Phone field — may hold a real phone number, email, or social handle for
 *    the channel (WhatsApp number, IG handle, etc.)
 * 3. "Unknown customer" — never leave the column empty
 */
function senderText(conv: Conversation): string {
  const name = (conv.customer_name ?? "").trim();

  // Looks like a real full name
  if (name && name.includes(" ")) return name;
  // Looks like an email
  if (name && name.includes("@")) return name;
  // Short non-ID string — could be a handle, username, or short name
  if (name && name.length <= 30 && !looksLikeId(name)) return name;

  // Fall back to the phone/identifier field — for WhatsApp it's a real number,
  // for email channels it may be the address, for socials a handle
  const phone = (conv.phone ?? "").trim();
  if (phone && phone.length <= 50 && !looksLikeId(phone)) return phone;

  return "Unknown customer";
}

function channelBadgeLabel(channel?: string): string {
  if (channel === "instagram_dm") return "Instagram";
  if (channel === "facebook_dm") return "Facebook";
  if (channel === "twitter_dm") return "X";
  if (channel === "email") return "Email";
  return "WhatsApp";
}

interface RowProps {
  conv: Conversation;
  isHidden?: boolean;
  isSelected?: boolean;
  readSet: Set<string>;
  escalationType?: string;
  onOpen: (phone: string) => void;
  onHide: (phone: string) => void;
  onUnhide: (phone: string) => void;
  onMarkRead: (phone: string) => void;
  onMarkUnread: (phone: string) => void;
  onSelect: (phone: string, checked: boolean) => void;
  onDelete?: (phone: string) => void;
}

function ConversationRow({
  conv, isHidden = false, isSelected = false, readSet, escalationType,
  onOpen, onHide, onUnhide, onMarkRead, onMarkUnread, onSelect, onDelete,
}: RowProps) {
  const isEscalated = conv.status === "escalated";
  const isRead = readSet.has(conv.phone);

  return (
    <div
      className={cn(
        "relative flex items-center h-[56px] border-b cursor-pointer select-none transition-colors duration-75",
        "border-border/60 dark:border-border/[0.22]",
        isSelected
          ? "bg-primary/[0.09]"
          : isRead
          ? "hover:bg-muted/50 dark:hover:bg-white/[0.05]"
          : "bg-primary/[0.04] hover:bg-primary/[0.07]",
        isHidden && "opacity-50"
      )}
      onClick={() => onOpen(conv.phone)}
    >
      {/* checkbox column */}
      <div className="flex items-center justify-center w-10 h-full shrink-0">
        <GmailCheckbox
          checked={isSelected}
          onChange={(v) => onSelect(conv.phone, v)}
        />
      </div>

      {/* unread dot */}
      <div className="w-3 shrink-0 flex items-center justify-center">
        {!isRead && !isHidden && (
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        )}
      </div>

      {/* sender block: identity (always present) + compact channel badge */}
      <div className="w-[190px] shrink-0 flex items-center gap-1.5 pr-2 min-w-0">
        <span
          className={cn(
            "text-sm truncate min-w-0",
            isRead ? "font-normal text-foreground dark:text-foreground/85" : "font-semibold text-foreground"
          )}
        >
          {senderText(conv)}
        </span>
        <span className="shrink-0 inline-block text-[9px] font-semibold uppercase tracking-wide leading-tight px-1.5 py-[2px] rounded border border-border/50 bg-muted/50 text-muted-foreground/75">
          {channelBadgeLabel(conv.channel)}
        </span>
      </div>

      {/* snippet — no channel prefix, just AI indicator + message */}
      <span className="flex-1 min-w-0 text-sm truncate">
        <span className={cn("font-normal", isRead ? "text-foreground/70 dark:text-foreground/55" : "text-foreground/85 dark:text-foreground/75")}>
          {conv.last_message_role === "assistant" && (
            <span className="text-primary/70 mr-1">AI ·</span>
          )}
          {conv.last_message}
        </span>
      </span>

      {/* escalation badge only — channel icon + count removed */}
      {isEscalated && (
        <div className="ml-2 shrink-0">
          <span className={cn(
            "flex items-center gap-1 text-[11px] font-medium",
            escalationType && isSemi(escalationType) ? "text-blue-400/90" : "text-rose-400/90"
          )}>
            <AlertTriangle className="w-3 h-3" />
            {escalationType
              ? isSemi(escalationType) ? "Semi Escalation" : "Full Escalation"
              : "Escalated"}
          </span>
        </div>
      )}

      {/* right zone — date + permanent actions, always visible, stable layout */}
      <div
        className="shrink-0 flex items-center gap-0.5 pl-2 pr-2"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={cn(
            "text-[11px] tabular-nums mr-1.5 w-[46px] text-right",
            isRead ? "text-muted-foreground/75 dark:text-muted-foreground/55" : "font-medium text-foreground/90 dark:text-foreground/80"
          )}
        >
          {gmailDate(conv.last_message_at)}
        </span>

        {/* Reply — opens conversation */}
        <button
          onClick={() => onOpen(conv.phone)}
          title="Reply"
          className="p-1.5 rounded text-muted-foreground/50 hover:text-primary hover:bg-primary/[0.10] transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>

        {/* Mark read / unread */}
        <button
          onClick={() => isRead ? onMarkUnread(conv.phone) : onMarkRead(conv.phone)}
          title={isRead ? "Mark as unread" : "Mark as read"}
          className="p-1.5 rounded text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.08] transition-colors"
        >
          {isRead
            ? <Circle className="w-3.5 h-3.5" />
            : <CheckCircle className="w-3.5 h-3.5 text-primary/70" />}
        </button>

        {/* Archive / Restore */}
        {isHidden ? (
          <button
            onClick={() => onUnhide(conv.phone)}
            title="Restore from archive"
            className="p-1.5 rounded text-muted-foreground/50 hover:text-emerald-400 hover:bg-white/[0.08] transition-colors"
          >
            <ArchiveRestore className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onHide(conv.phone)}
            title="Archive"
            className="p-1.5 rounded text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.08] transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Delete — archived rows only */}
        {isHidden && onDelete && (
          <button
            onClick={() => onDelete(conv.phone)}
            title="Delete permanently"
            className="p-1.5 rounded text-muted-foreground/50 hover:text-rose-400 hover:bg-white/[0.08] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [searchParams] = useSearchParams();
  const escalationsMode = searchParams.get("view") === "escalations";
  const bookingInfoRef = useRef<HTMLDivElement>(null);
  const { data: conversations, isLoading } = useConversations();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("list");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());
  const [showHidden, setShowHidden] = useState(false);
  const { hidden, hide, unhide, unhideAll } = useHiddenConversations();
  const { readSet, markRead, markUnread } = useReadStatus();
  const { data: detail } = useConversation(selectedPhone);
  const { selected: platformFilter } = usePlatformFilter();
  const { data: escalations } = useEscalations();
  const suggestReply = useSuggestReply();
  const escalationReply = useEscalationReply();
  const { settings: emailSettings } = useEmailSettings();
  const [compose, setCompose] = useState<ComposeState | null>(null);

  useEffect(() => {
    setView("list");
    setSelectedPhone("");
    setSelectedSet(new Set());
  }, [escalationsMode]);

  const allFiltered = (conversations ?? []).filter((c) => {
    if (!matchesPlatformFilter(c.channel, platformFilter)) return false;
    if (escalationsMode && c.status !== "escalated") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.customer_name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.last_message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filtered = allFiltered.filter((c) => !hidden.has(c.phone));
  const hiddenFiltered = allFiltered.filter((c) => hidden.has(c.phone));
  const hiddenCount = hiddenFiltered.length;
  const unreadCount = filtered.filter((c) => !readSet.has(c.phone)).length;

  const allSelected = filtered.length > 0 && filtered.every((c) => selectedSet.has(c.phone));
  const someSelected = filtered.some((c) => selectedSet.has(c.phone));

  const toggleMasterSelect = () => {
    if (allSelected) {
      setSelectedSet(new Set());
    } else {
      setSelectedSet(new Set(filtered.map((c) => c.phone)));
    }
  };

  const handleRowSelect = (phone: string, checked: boolean) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (checked) next.add(phone); else next.delete(phone);
      return next;
    });
  };

  const openConversation = (phone: string) => {
    setSelectedPhone(phone);
    setView("detail");
    markRead(phone);
  };

  const backToList = () => {
    setView("list");
    setSelectedPhone("");
    setCompose(null);
  };

  useEffect(() => {
    const handler = () => { setView("list"); setSelectedPhone(""); };
    window.addEventListener("bluemarlin:nav:messages", handler);
    return () => window.removeEventListener("bluemarlin:nav:messages", handler);
  }, []);

  const deleteConv = useDeleteConversation();
  const handleDelete = (phone: string) => {
    if (window.confirm("Permanently delete this conversation? This cannot be undone.")) {
      deleteConv.mutate(phone);
    }
  };

  /* ── Bulk actions (applied to selectedSet) ── */
  const bulkArchive = () => {
    selectedSet.forEach((phone) => hide(phone));
    setSelectedSet(new Set());
  };

  const bulkMarkRead = () => {
    selectedSet.forEach((phone) => markRead(phone));
    setSelectedSet(new Set());
  };

  const bulkMarkUnread = () => {
    selectedSet.forEach((phone) => markUnread(phone));
    setSelectedSet(new Set());
  };

  const bulkDelete = () => {
    const count = selectedSet.size;
    if (window.confirm(`Permanently delete ${count} conversation${count !== 1 ? "s" : ""}? This cannot be undone.`)) {
      selectedSet.forEach((phone) => deleteConv.mutate(phone));
      setSelectedSet(new Set());
    }
  };

  const clearSelection = () => setSelectedSet(new Set());

  const selectionToolbarBtn = "p-1.5 rounded text-foreground/65 hover:text-foreground hover:bg-white/[0.10] transition-colors";

  /* ─── DETAIL VIEW ──────────────────────────────────────────────────────── */
  if (view === "detail" && detail) {
    const selectedConv = (conversations ?? []).find((c) => c.phone === selectedPhone);
    const isEscalated = selectedConv?.status === "escalated";
    const matchedEsc = isEscalated
      ? (escalations ?? []).find(
          (e) =>
            e.customer_id === selectedPhone ||
            e.customer_phone === selectedPhone ||
            e.customer_contact === selectedPhone ||
            (selectedConv && selectedConv.customer_name && e.customer_name === selectedConv.customer_name)
        ) ?? null
      : null;

    const sendCompose = () => {
      if (!compose || !matchedEsc) return;
      openEmailCompose(emailSettings, compose.to, compose.subject, compose.body);
      setCompose(null);
    };

    return (
      <div className="flex flex-col h-full overflow-y-auto p-5 md:p-8">

        {/* ── Floating Escalation Compose Modal ── */}
        {compose && matchedEsc && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setCompose(null)} />
            <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className={cn(
                "flex items-center justify-between px-5 py-3.5 border-b border-border",
                isSemi(matchedEsc.notification_type) ? "bg-slate-500/10" : "bg-rose-500/10"
              )}>
                <div className="flex items-center gap-2.5">
                  {isSemi(matchedEsc.notification_type) ? (
                    <>
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-[15px] font-semibold text-foreground">Semi Escalation Reply</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-500/20 text-slate-400 border border-slate-500/30">Semi</span>
                      <span className="text-sm text-muted-foreground">— The AI will reformat and send to the customer.</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-rose-400" />
                      <span className="text-[15px] font-semibold text-foreground">Full Escalation Email</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Full</span>
                      <span className="text-sm text-muted-foreground">— opens in {emailSettings.client === "gmail" ? "Gmail" : "your mail app"}</span>
                    </>
                  )}
                </div>
                <button onClick={() => setCompose(null)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                {isSemi(matchedEsc.notification_type) ? (
                  <>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-muted-foreground w-14 shrink-0">To</label>
                      <div className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/20 text-[15px] text-foreground/80">
                        {matchedEsc.customer_name}{matchedEsc.customer_id ? <span className="text-foreground/50 font-mono ml-2">· {matchedEsc.customer_id}</span> : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-muted-foreground w-14 shrink-0">Context</label>
                      <div className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/20 text-[15px] text-foreground/80">
                        {cleanSubject(matchedEsc.subject)}
                      </div>
                    </div>
                  </>
                ) : (
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
                    {isSemi(matchedEsc.notification_type) ? "Reply" : "Body"}
                  </label>
                  <textarea
                    value={compose.body}
                    onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                    rows={5}
                    placeholder={isSemi(matchedEsc.notification_type) ? "Type your answer for the AI here..." : ""}
                    className="flex-1 w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="flex justify-between items-center pt-1 gap-2">
                  {!isSemi(matchedEsc.notification_type) && (
                    <button
                      onClick={async () => {
                        if (!matchedEsc?.customer_id || !compose?.body.trim()) return;
                        try {
                          const result = await suggestReply.mutateAsync({ phone: matchedEsc.customer_id, draft_text: compose.body });
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
                  {isSemi(matchedEsc.notification_type) ? (
                    <button
                      onClick={async () => {
                        if (!matchedEsc || !compose?.body.trim()) return;
                        try {
                          await escalationReply.mutateAsync({ id: matchedEsc.id, answer: compose.body });
                          setCompose(null);
                        } catch {}
                      }}
                      disabled={escalationReply.isPending || !compose?.body.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors ml-auto"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {escalationReply.isPending ? "Sending…" : "Send AI Reply"}
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

        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-[15px] pb-4">
          <button
            onClick={backToList}
            className="flex items-center gap-1 text-foreground/50 hover:text-foreground transition-colors pr-2 border-r border-border mr-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={backToList} className="font-medium text-muted-foreground hover:text-foreground transition-colors">
            {escalationsMode ? "Escalations" : "Inbox"}
          </button>
          <>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-foreground font-medium">
              {detail.booking_state?.fields?.customer_name as string || selectedPhone}
            </span>
          </>
        </div>

        <div className="max-w-3xl flex flex-col flex-1 gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {detail.booking_state?.fields?.customer_name as string || selectedPhone}
              </h2>
              <p className="text-sm text-muted-foreground font-mono">{selectedPhone}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {readSet.has(selectedPhone) && (
                <button
                  onClick={() => markUnread(selectedPhone)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground bg-muted/40 hover:bg-muted border border-border transition-colors"
                >
                  <Circle className="w-3.5 h-3.5" /> Mark unread
                </button>
              )}
              {matchedEsc ? (
                <button
                  onClick={() => {
                    const parsed = parseEscalationBody(matchedEsc.body);
                    setCompose({
                      to: isSemi(matchedEsc.notification_type) ? "" : parsed.email,
                      subject: isSemi(matchedEsc.notification_type) ? "" : `Re: ${cleanSubject(matchedEsc.subject)}`,
                      body: "",
                    });
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    isSemi(matchedEsc.notification_type)
                      ? "text-sky-400 border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20"
                      : "text-rose-400 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20"
                  )}
                >
                  {isSemi(matchedEsc.notification_type)
                    ? <><Phone className="w-3.5 h-3.5" /> Answer AI</>
                    : <><Mail className="w-3.5 h-3.5" /> Compose email</>
                  }
                </button>
              ) : isEscalated && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
                  <Shield className="w-3.5 h-3.5" /> Escalated
                </span>
              )}
            </div>
          </div>

          {matchedEsc && (() => {
            const parsed = parseEscalationBody(matchedEsc.body);
            return (
              <div className="rounded-xl border border-border bg-card/60 p-4 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={cn(
                    "text-sm font-bold uppercase tracking-wider px-2.5 py-1 rounded",
                    isSemi(matchedEsc.notification_type) ? "bg-blue-500/15 text-blue-400" : "bg-rose-500/15 text-rose-400"
                  )}>
                    {isSemi(matchedEsc.notification_type) ? "Semi" : "Full"} Escalation
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    {matchedEsc.channel === "email" ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                    {matchedEsc.channel}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {(() => { try { return formatDistanceToNow(new Date(matchedEsc.created_at), { addSuffix: true }); } catch { return matchedEsc.created_at; } })()}
                  </span>
                  <span className={cn(
                    "text-sm font-bold uppercase px-2 py-0.5 rounded",
                    matchedEsc.status === "resolved" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                  )}>
                    {matchedEsc.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-[15px] font-medium text-foreground">{matchedEsc.customer_name}</p>
                  </div>
                  {parsed.email && (
                    <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-muted/30 border border-border">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                      <p className="text-[15px] text-foreground">{parsed.email}</p>
                    </div>
                  )}
                  <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
                    <p className="text-[15px] text-foreground">
                      {matchedEsc.customer_contact || matchedEsc.customer_id}
                    </p>
                    {matchedEsc.customer_phone && matchedEsc.customer_phone !== matchedEsc.customer_contact && (
                      <p className="text-sm text-muted-foreground mt-1 font-mono">{matchedEsc.customer_phone}</p>
                    )}
                    {matchedEsc.customer_email && matchedEsc.customer_email !== matchedEsc.customer_contact && (
                      <p className="text-sm text-muted-foreground mt-0.5">{matchedEsc.customer_email}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reason</p>
                    <p className="text-[15px] font-medium text-foreground">{parsed.question || cleanSubject(matchedEsc.subject)}</p>
                  </div>
                </div>

                {(parsed.chatLog || isSemi(matchedEsc.notification_type)) && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {isSemi(matchedEsc.notification_type) ? "Relay Details" : "Conversation"}
                    </h3>
                    <pre className="text-[15px] text-foreground/88 whitespace-pre-wrap leading-relaxed bg-muted/30 border border-border rounded-xl p-4 max-h-48 overflow-y-auto font-sans">
                      {isSemi(matchedEsc.notification_type) ? matchedEsc.body : parsed.chatLog}
                    </pre>
                  </div>
                )}
              </div>
            );
          })()}

          <div className="flex-1 space-y-3 pb-4">
            {[...detail.messages].reverse().map((msg, idx) =>
              msg.role === "system" ? (() => {
                const isEscalation = /escalat|relay/i.test(msg.text);
                const isBookingConfirmed = /booking confirmed/i.test(msg.text);
                const isHoldPlaced = /hold placed/i.test(msg.text);
                const isBookingEvent = isBookingConfirmed || isHoldPlaced;
                const clickable = isEscalation || isBookingEvent;
                let Icon = AlertTriangle;
                let colors = "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
                if (isBookingConfirmed) {
                  Icon = CheckCircle2;
                  colors = "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
                } else if (isHoldPlaced) {
                  Icon = Clock;
                }
                return (
                  <div key={idx} className="flex justify-center">
                    <button
                      onClick={clickable ? () => {
                        if (isEscalation) navigate("/dashboard?view=escalations");
                        else if (isBookingEvent) bookingInfoRef.current?.scrollIntoView({ behavior: "smooth" });
                      } : undefined}
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all",
                        colors,
                        clickable && "cursor-pointer hover:scale-[1.02] hover:shadow-sm"
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{msg.text}</span>
                      <span className="opacity-50 ml-1">{format(new Date(msg.created_at), "h:mm a")}</span>
                    </button>
                  </div>
                );
              })() : (
                <div key={idx} className={cn("flex", msg.role === "user" ? "justify-start" : "justify-end")}>
                  <div className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-muted/60 border border-border text-foreground"
                      : "bg-primary/15 border border-primary/20 text-foreground"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                      {format(new Date(msg.created_at), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              )
            )}
            {detail.messages.length === 0 && (
              <p className="text-base text-muted-foreground italic text-center py-8">No messages in this conversation.</p>
            )}
          </div>

          <div ref={bookingInfoRef} className="shrink-0 mt-2 pt-3 border-t border-border space-y-3">
            {(detail.booking_state?.completed_bookings ?? []).length > 0 && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Completed Bookings</p>
                <div className="space-y-2">
                  {(detail.booking_state.completed_bookings as Record<string, unknown>[]).map((bk, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                      <Ticket className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-medium text-foreground">{String(bk.service_name || bk.service_key || "Service")}</p>
                        <p className="text-sm text-muted-foreground">{String(bk.date || "")} {bk.guests ? `· ${bk.guests} guests` : ""} {bk.booking_ref ? `· ${bk.booking_ref}` : ""}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Object.keys(detail.booking_state?.fields ?? {}).length > 0 && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {(detail.booking_state?.completed_bookings ?? []).length > 0 ? "Current Booking" : "Booking Info"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(detail.booking_state.fields).map(([key, val]) =>
                    val ? (
                      <span key={key} className="text-sm bg-muted/50 border border-border rounded-lg px-2.5 py-1">
                        <span className="text-muted-foreground/70">{key.replace(/_/g, " ")}:</span>{" "}
                        <span className="text-foreground/88 font-medium">{String(val)}</span>
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─── LIST VIEW ────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-full">

      {/* ── Toolbar — swaps between normal and selection mode, same height/position ── */}
      <div
        className="flex items-center shrink-0 h-[50px] border-b border-border px-2 gap-1"
      >
        {/* master checkbox — always present in both modes */}
        <div className="flex items-center shrink-0">
          <div className="flex items-center justify-center w-10">
            <GmailCheckbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={toggleMasterSelect}
            />
          </div>
          <ChevronDown className="w-[10px] h-[10px] text-foreground/45 -ml-1.5 mr-1 shrink-0" />
        </div>

        {someSelected ? (
          /* ── SELECTION MODE ── */
          <>
            <span className="text-sm text-foreground/75 mr-1 shrink-0 tabular-nums">
              {selectedSet.size} selected
            </span>

            <div className="h-4 w-px bg-border/50 mx-2 shrink-0" />

            <button onClick={bulkArchive} title="Archive" className={selectionToolbarBtn}>
              <Archive className="w-[17px] h-[17px]" />
            </button>
            <button onClick={bulkMarkRead} title="Mark as read" className={selectionToolbarBtn}>
              <CheckCircle className="w-[17px] h-[17px]" />
            </button>
            <button onClick={bulkMarkUnread} title="Mark as unread" className={selectionToolbarBtn}>
              <Circle className="w-[17px] h-[17px]" />
            </button>

            {(() => {
              if (selectedSet.size !== 1) return null;
              const singlePhone = [...selectedSet][0];
              const singleConv = (conversations ?? []).find((c) => c.phone === singlePhone);
              if (!singleConv || singleConv.channel !== "email") return null;
              return (
                <>
                  <div className="h-4 w-px bg-border/50 mx-2 shrink-0" />
                  <button
                    onClick={() => {
                      const to = singlePhone.includes("@") ? singlePhone : "";
                      openEmailCompose(emailSettings, to, `Re: ${singleConv.customer_name}`, "");
                    }}
                    title="Reply to email"
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded text-foreground/75 hover:text-foreground hover:bg-white/[0.10] transition-colors text-sm"
                  >
                    <Mail className="w-[17px] h-[17px]" />
                    <span className="hidden sm:inline">Reply</span>
                  </button>
                </>
              );
            })()}

            <div className="h-4 w-px bg-border/50 mx-2 shrink-0" />

            <button
              onClick={bulkDelete}
              title="Delete"
              className="p-1.5 rounded text-rose-400/40 hover:text-rose-400 hover:bg-rose-400/[0.07] transition-colors"
            >
              <Trash2 className="w-[17px] h-[17px]" />
            </button>

            <div className="flex-1" />

            <button
              onClick={clearSelection}
              title="Clear selection"
              className={selectionToolbarBtn}
            >
              <X className="w-[17px] h-[17px]" />
            </button>
          </>
        ) : (
          /* ── NORMAL MODE ── */
          <>
            <div className="flex-1 h-full overflow-x-auto scrollbar-none">
              <PlatformFilterBar className="h-full" />
            </div>

            <div className="relative shrink-0 ml-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-48 pl-8 pr-3 py-1.5 rounded-md border border-border/40 bg-white/[0.04] text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all"
              />
            </div>
          </>
        )}
      </div>

      {/* ── Unread count ── */}
      {unreadCount > 0 && (
        <div
          className="flex items-center gap-1.5 px-[52px] py-1.5 text-xs text-muted-foreground/85 dark:text-muted-foreground/60 border-b border-border/40 dark:border-border/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
          {unreadCount} unread
        </div>
      )}

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="divide-y divide-border/[0.10]">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-center h-[56px] px-4 gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="w-32 h-3 rounded" />
                <Skeleton className="flex-1 h-3 rounded" />
                <Skeleton className="w-10 h-3 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            {filtered.map((conv) => (
              <ConversationRow
                key={conv.phone}
                conv={conv}
                isSelected={selectedSet.has(conv.phone)}
                readSet={readSet}
                escalationType={conv.status === "escalated"
                  ? (escalations ?? []).find((e) =>
                      e.customer_id === conv.phone ||
                      e.customer_phone === conv.phone ||
                      e.customer_contact === conv.phone ||
                      (conv.customer_name && e.customer_name === conv.customer_name)
                    )?.notification_type
                  : undefined}
                onOpen={openConversation}
                onHide={hide}
                onUnhide={unhide}
                onMarkRead={markRead}
                onMarkUnread={markUnread}
                onSelect={handleRowSelect}
                onDelete={handleDelete}
              />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <MessageCircle className="w-7 h-7 text-foreground/20" />
            <p className="text-base text-foreground/50">
              {(conversations?.length ?? 0) === 0
                ? "No conversations yet"
                : escalationsMode
                ? "No escalated conversations"
                : "No conversations match this filter"}
            </p>
          </div>
        )}

        {/* ── Archived section ── */}
        {hiddenCount > 0 && (
          <div className="border-t border-border/40 dark:border-border/[0.08]">
            <button
              onClick={() => setShowHidden((s) => !s)}
              className="flex items-center gap-2 px-[52px] py-2.5 text-[13px] text-muted-foreground/85 dark:text-muted-foreground/60 hover:text-muted-foreground transition-colors w-full"
            >
              <Archive className="w-3.5 h-3.5" />
              {showHidden ? "Hide" : "Show"} {hiddenCount} archived
              <ChevronDown className={cn("w-3 h-3 ml-auto transition-transform", showHidden && "rotate-180")} />
            </button>
            {showHidden && (
              <>
                <div
                  className="flex items-center justify-end px-4 py-1.5 border-b border-border/30 dark:border-border/20"
                >
                  <button
                    onClick={() => { unhideAll(); setShowHidden(false); }}
                    className="text-xs text-primary/70 hover:text-primary transition-colors"
                  >
                    Restore all
                  </button>
                </div>
                {hiddenFiltered.map((conv) => (
                  <ConversationRow
                    key={conv.phone}
                    conv={conv}
                    isHidden
                    isSelected={selectedSet.has(conv.phone)}
                    readSet={readSet}
                    escalationType={conv.status === "escalated"
                      ? (escalations ?? []).find((e) =>
                          e.customer_id === conv.phone ||
                          e.customer_phone === conv.phone ||
                          e.customer_contact === conv.phone ||
                          (conv.customer_name && e.customer_name === conv.customer_name)
                        )?.notification_type
                      : undefined}
                    onOpen={openConversation}
                    onHide={hide}
                    onUnhide={unhide}
                    onMarkRead={markRead}
                    onMarkUnread={markUnread}
                    onSelect={handleRowSelect}
                    onDelete={handleDelete}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
