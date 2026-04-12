import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { useConversations, useConversation, useDeleteConversation } from "@dashboard/hooks/use-bluemarlin";
import { Conversation } from "@dashboard/lib/api";
import { useReadStatus } from "@dashboard/hooks/use-read-status";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import {
  MessageCircle, Phone, Search, ArrowLeft, ChevronRight, ChevronDown, ChevronUp,
  AlertTriangle, User, Archive, ArchiveRestore, Eye, Circle, CheckCircle, CheckCircle2, Clock, Ticket,
  Instagram, Facebook, Twitter, Globe, Mail, Trash2,
} from "lucide-react";
import { cn } from "@dashboard/lib/utils";
import { formatDistanceToNow, format } from "date-fns";

const FILTERS = ["All", "Active"];
const HIDDEN_KEY = "bluemarlin_hidden_conversations";

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


interface ConversationRowProps {
  conv: Conversation;
  isHidden?: boolean;
  readSet: Set<string>;
  onOpen: (phone: string) => void;
  onHide: (phone: string) => void;
  onUnhide: (phone: string) => void;
  onMarkRead: (phone: string) => void;
  onMarkUnread: (phone: string) => void;
  onDelete?: (phone: string) => void;
}

function ConversationRow({
  conv, isHidden = false, readSet,
  onOpen, onHide, onUnhide, onMarkRead, onMarkUnread, onDelete,
}: ConversationRowProps) {
  const isEscalated = conv.status === "escalated";
  const isRead = readSet.has(conv.phone);

  return (
    <div
      className={cn(
        "flex items-start gap-4 px-4 py-4 rounded-xl border border-border/60 bg-card cursor-pointer select-none group",
        "transition-all duration-150",
        "hover:border-border hover:shadow-lg hover:shadow-black/20 hover:-translate-y-px",
        isHidden && "opacity-50"
      )}
      onClick={() => onOpen(conv.phone)}
    >
      <div className="relative w-9 h-9 rounded-full bg-foreground/[0.06] flex items-center justify-center shrink-0 mt-0.5">
        <User className="w-4 h-4 text-foreground/40" />
        {!isRead && !isHidden && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={cn("text-sm text-foreground", isRead ? "font-medium" : "font-semibold")}>{conv.customer_name}</span>
          <span className="text-xs text-muted-foreground/50 tabular-nums shrink-0">
            {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
          </span>
        </div>
        <p className={cn("text-xs line-clamp-2 leading-relaxed", isRead ? "text-muted-foreground/55" : "text-foreground/75")}>
          {conv.last_message_role === "assistant" && <span className="text-primary/60 font-medium">AI · </span>}
          {conv.last_message}
        </p>
        <div className="flex items-center gap-1.5 mt-2.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-md bg-foreground/[0.05] text-muted-foreground/70 border border-border/40">
            {conv.channel === "instagram_dm" ? <Instagram className="w-2.5 h-2.5" />
            : conv.channel === "facebook_dm" ? <Facebook className="w-2.5 h-2.5" />
            : conv.channel === "twitter_dm" ? <Twitter className="w-2.5 h-2.5" />
            : conv.channel === "email" ? <Mail className="w-2.5 h-2.5" />
            : <Phone className="w-2.5 h-2.5" />}
            {conv.channel === "instagram_dm" ? "Instagram"
            : conv.channel === "facebook_dm" ? "Facebook"
            : conv.channel === "twitter_dm" ? "Twitter"
            : conv.channel === "email" ? "Email"
            : "WhatsApp"}
          </span>
          {isEscalated && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-500/8 text-rose-400/80 border border-rose-500/15">
              <AlertTriangle className="w-2.5 h-2.5" />
              Escalated
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/35 ml-auto tabular-nums">{conv.message_count} msg</span>
        </div>
      </div>
      <div className="shrink-0 self-center flex items-center gap-0.5">
        <button
          onClick={(e) => { e.stopPropagation(); isRead ? onMarkUnread(conv.phone) : onMarkRead(conv.phone); }}
          title={isRead ? "Mark as unread" : "Mark as read"}
          className="p-1.5 rounded-lg text-sky-400/50 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
        >
          {isRead ? <Circle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        </button>
        {isHidden ? (
          <button
            onClick={(e) => { e.stopPropagation(); onUnhide(conv.phone); }}
            title="Restore from archive"
            className="p-1.5 rounded-lg text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
          >
            <ArchiveRestore className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onHide(conv.phone); }}
            title="Archive this conversation"
            className="p-1.5 rounded-lg text-slate-400/50 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <Archive className="w-4 h-4" />
          </button>
        )}
        {isHidden && onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(conv.phone); }}
            title="Delete conversation"
            className="p-1.5 rounded-lg text-rose-400/50 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const bookingInfoRef = useRef<HTMLDivElement>(null);
  const { data: conversations, isLoading } = useConversations();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("list");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);
  const { hidden, hide, unhide, unhideAll } = useHiddenConversations();
  const { readSet, markRead, markUnread } = useReadStatus();
  const { data: detail } = useConversation(selectedPhone);

  const allConvs = (conversations ?? []).filter((c) => !hidden.has(c.phone));
  const tabCount = (f: string) => {
    if (f === "All") return allConvs.length;
    if (f === "Active") return allConvs.filter(c => c.status === "active").length;
    return 0;
  };

  const allFiltered = (conversations ?? []).filter((c) => {
    if (activeFilter === "Active" && c.status !== "active") return false;
    if (search) {
      const q = search.toLowerCase();
      return c.customer_name.toLowerCase().includes(q) || c.phone.includes(q) || c.last_message.toLowerCase().includes(q);
    }
    return true;
  });

  const filtered = allFiltered.filter((c) => !hidden.has(c.phone));
  const hiddenFiltered = allFiltered.filter((c) => hidden.has(c.phone));
  const hiddenCount = hiddenFiltered.length;
  const unreadCount = filtered.filter((c) => !readSet.has(c.phone)).length;

  const openConversation = (phone: string) => {
    setSelectedPhone(phone);
    setView("detail");
    markRead(phone);
  };

  const backToList = () => {
    setView("list");
    setSelectedPhone("");
  };

  useEffect(() => {
    const handler = () => { setView("list"); setSelectedPhone(""); };
    window.addEventListener("bluemarlin:nav:messages", handler);
    return () => window.removeEventListener("bluemarlin:nav:messages", handler);
  }, []);

  const deleteConv = useDeleteConversation();
  const handleDelete = (phone: string) => {
    if (window.confirm(`Permanently delete this conversation? This cannot be undone.`)) {
      deleteConv.mutate(phone);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={view === "detail" ? backToList : goBack} className="flex items-center gap-1 text-foreground/40 hover:text-foreground transition-colors pr-2 border-r border-border mr-1">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button onClick={backToList} className={cn("font-medium transition-colors", view === "list" ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
          Messages
        </button>
        {view === "detail" && detail && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-foreground font-medium">{detail.booking_state?.fields?.customer_name as string || selectedPhone}</span>
          </>
        )}
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-1">Messages</h1>
              <p className="text-muted-foreground text-sm">All conversations managed on your behalf — live and in full.</p>
            </div>
            {unreadCount > 0 && (
              <span className="shrink-0 mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold border border-sky-500/25">
                <Circle className="w-2 h-2 fill-sky-400" />
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shrink-0 w-fit">
              {FILTERS.map((f) => {
                const count = tabCount(f);
                const active = activeFilter === f;
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
                        active ? "bg-primary text-white ring-primary/40" : "bg-foreground/15 text-foreground ring-foreground/20"
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="space-y-3 flex-1 overflow-auto">
            {isLoading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
            ) : filtered.length > 0 ? (
              <>
                {(listExpanded ? filtered : filtered.slice(0, 3)).map((conv) => (
                  <ConversationRow
                    key={conv.phone}
                    conv={conv}
                    readSet={readSet}
                    onOpen={openConversation}
                    onHide={hide}
                    onUnhide={unhide}
                    onMarkRead={markRead}
                    onMarkUnread={markUnread}
                    onDelete={handleDelete}
                  />
                ))}
                {filtered.length > 3 && (
                  <button
                    onClick={() => setListExpanded(prev => !prev)}
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
                <MessageCircle className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground/50">
                  {(conversations?.length ?? 0) === 0 ? "No conversations yet" : "No conversations match this filter"}
                </p>
              </div>
            )}

            {/* Archived conversations section */}
            {hiddenCount > 0 && (
              <div className="pt-2 border-t border-border/40 mt-2">
                <button
                  onClick={() => setShowHidden((s) => !s)}
                  className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors mb-3 pt-2"
                >
                  <Archive className="w-3.5 h-3.5" />
                  {showHidden ? "Hide" : "Show"} {hiddenCount} archived conversation{hiddenCount !== 1 ? "s" : ""}
                  {showHidden && (
                    <button
                      onClick={(e) => { e.stopPropagation(); unhideAll(); setShowHidden(false); }}
                      className="ml-2 text-primary hover:underline"
                    >
                      Restore all
                    </button>
                  )}
                </button>
                {showHidden && hiddenFiltered.map((conv) => (
                  <ConversationRow
                    key={conv.phone}
                    conv={conv}
                    isHidden
                    readSet={readSet}
                    onOpen={openConversation}
                    onHide={hide}
                    onUnhide={unhide}
                    onMarkRead={markRead}
                    onMarkUnread={markUnread}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* DETAIL VIEW */}
      {view === "detail" && detail && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="mb-4 shrink-0 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{detail.booking_state?.fields?.customer_name as string || selectedPhone}</h2>
              <p className="text-xs text-muted-foreground font-mono">{selectedPhone}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {readSet.has(selectedPhone) && (
                <button
                  onClick={() => markUnread(selectedPhone)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground bg-muted/40 hover:bg-muted border border-border transition-colors"
                >
                  <Circle className="w-3.5 h-3.5" /> Mark unread
                </button>
              )}
            </div>
          </div>

          {/* Chat thread — newest first */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
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
                  // amber (default) for pending-payment state — Brief 163
                }
                return (
                  <div key={idx} className="flex justify-center">
                    <button
                      onClick={clickable ? () => {
                        if (isEscalation) navigate("/dashboard/escalations");
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
                      <span className="opacity-50 ml-1">{format(new Date(msg.created_at), 'h:mm a')}</span>
                    </button>
                  </div>
                );
              })() : (
                <div key={idx} className={cn("flex", msg.role === "user" ? "justify-start" : "justify-end")}>
                  <div className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-muted/60 border border-border text-foreground"
                      : "bg-primary/15 border border-primary/20 text-foreground"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1.5">
                      {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              )
            )}
            {detail.messages.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-8">No messages in this conversation.</p>
            )}
          </div>

          {/* Booking info panel */}
          <div ref={bookingInfoRef} className="shrink-0 mt-2 pt-3 border-t border-border space-y-3">
            {(detail.booking_state?.completed_bookings ?? []).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Completed Bookings</p>
                <div className="space-y-2">
                  {(detail.booking_state.completed_bookings as Record<string, unknown>[]).map((bk, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                      <Ticket className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{String(bk.service_name || bk.service_key || "Service")}</p>
                        <p className="text-xs text-muted-foreground">{String(bk.date || "")} {bk.guests ? `· ${bk.guests} guests` : ""} {bk.booking_ref ? `· ${bk.booking_ref}` : ""}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Object.keys(detail.booking_state?.fields ?? {}).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {(detail.booking_state?.completed_bookings ?? []).length > 0 ? "Current Booking" : "Booking Info"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(detail.booking_state.fields).map(([key, val]) => (
                    val ? (
                      <span key={key} className="text-xs bg-muted/50 border border-border rounded-lg px-2.5 py-1">
                        <span className="text-muted-foreground/60">{key.replace(/_/g, ' ')}:</span>{' '}
                        <span className="text-foreground/80 font-medium">{String(val)}</span>
                      </span>
                    ) : null
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
