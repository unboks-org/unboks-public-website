import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoBack } from "@dashboard/hooks/use-go-back";
import { useConversations, useConversation, useDeleteConversation } from "@dashboard/hooks/use-bluemarlin";
import { Conversation } from "@dashboard/lib/api";
import { useReadStatus } from "@dashboard/hooks/use-read-status";
import { usePlatformFilter } from "@dashboard/hooks/use-platform-filter";
import { matchesPlatformFilter } from "@dashboard/lib/channel-map";
import { PlatformFilterBar } from "@dashboard/components/PlatformFilterBar";
import { Skeleton } from "@dashboard/components/ui/skeleton";
import {
  MessageCircle, Phone, Search, ArrowLeft, ChevronRight, ChevronDown,
  AlertTriangle, User, Archive, ArchiveRestore, Circle, CheckCircle,
  CheckCircle2, Clock, Ticket, Instagram, Facebook, Twitter, Mail, Trash2,
} from "lucide-react";
import { cn } from "@dashboard/lib/utils";
import { isToday, isThisYear, format } from "date-fns";

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

function gmailDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, "h:mm a");
  if (isThisYear(d)) return format(d, "MMM d");
  return format(d, "MMM d, yyyy");
}

function ChannelIcon({ channel }: { channel?: string }) {
  if (channel === "instagram_dm") return <Instagram className="w-3 h-3" />;
  if (channel === "facebook_dm") return <Facebook className="w-3 h-3" />;
  if (channel === "twitter_dm") return <Twitter className="w-3 h-3" />;
  if (channel === "email") return <Mail className="w-3 h-3" />;
  return <Phone className="w-3 h-3" />;
}

function channelLabel(channel?: string): string {
  if (channel === "instagram_dm") return "Instagram";
  if (channel === "facebook_dm") return "Facebook";
  if (channel === "twitter_dm") return "X / Twitter";
  if (channel === "email") return "Email";
  return "WhatsApp";
}

interface RowProps {
  conv: Conversation;
  isHidden?: boolean;
  isSelected?: boolean;
  readSet: Set<string>;
  onOpen: (phone: string) => void;
  onHide: (phone: string) => void;
  onUnhide: (phone: string) => void;
  onMarkRead: (phone: string) => void;
  onMarkUnread: (phone: string) => void;
  onSelect: (phone: string, checked: boolean) => void;
  onDelete?: (phone: string) => void;
}

function ConversationRow({
  conv, isHidden = false, isSelected = false, readSet,
  onOpen, onHide, onUnhide, onMarkRead, onMarkUnread, onSelect, onDelete,
}: RowProps) {
  const isEscalated = conv.status === "escalated";
  const isRead = readSet.has(conv.phone);

  return (
    <div
      className={cn(
        "group relative flex items-center h-[52px] border-b cursor-pointer select-none transition-colors duration-75",
        "border-border/[0.12]",
        isSelected
          ? "bg-primary/[0.07]"
          : isRead
          ? "hover:bg-white/[0.035]"
          : "bg-primary/[0.025] hover:bg-primary/[0.045]",
        isHidden && "opacity-50"
      )}
      onClick={() => onOpen(conv.phone)}
    >
      {/* checkbox column */}
      <div
        className="flex items-center justify-center w-10 h-full shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(conv.phone, e.target.checked)}
          className={cn(
            "w-[15px] h-[15px] rounded cursor-pointer accent-primary transition-opacity",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        />
      </div>

      {/* unread dot */}
      <div className="w-3 shrink-0 flex items-center justify-center">
        {!isRead && !isHidden && (
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        )}
      </div>

      {/* sender name */}
      <span
        className={cn(
          "w-[170px] shrink-0 text-[13px] truncate pr-3",
          isRead ? "font-normal text-foreground/65" : "font-semibold text-foreground"
        )}
      >
        {conv.customer_name}
      </span>

      {/* subject · snippet */}
      <span className="flex-1 min-w-0 text-[13px] truncate">
        <span className={cn(isRead ? "text-foreground/55" : "text-foreground/80 font-medium")}>
          {channelLabel(conv.channel)}
        </span>
        <span className="text-foreground/25 mx-2">—</span>
        <span className={cn("font-normal", isRead ? "text-foreground/38" : "text-foreground/50")}>
          {conv.last_message_role === "assistant" && (
            <span className="text-primary/50 mr-1">AI ·</span>
          )}
          {conv.last_message}
        </span>
      </span>

      {/* inline badges — always visible */}
      <div className="flex items-center gap-2 ml-2 shrink-0">
        {isEscalated && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-rose-400/75">
            <AlertTriangle className="w-2.5 h-2.5" />
            Escalated
          </span>
        )}
        <span className="text-muted-foreground/25">
          <ChannelIcon channel={conv.channel} />
        </span>
        <span className="text-[10px] text-muted-foreground/25 tabular-nums">{conv.message_count}</span>
      </div>

      {/* date + hover actions (overlap) */}
      <div className="relative w-[90px] shrink-0 flex items-center justify-end pr-4">
        {/* date — hidden on hover */}
        <span
          className={cn(
            "absolute right-4 text-[12px] tabular-nums transition-opacity duration-75 group-hover:opacity-0",
            isRead ? "text-muted-foreground/40" : "font-medium text-foreground/60"
          )}
        >
          {gmailDate(conv.last_message_at)}
        </span>

        {/* actions — visible on hover */}
        <div
          className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-75"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => isRead ? onMarkUnread(conv.phone) : onMarkRead(conv.phone)}
            title={isRead ? "Mark as unread" : "Mark as read"}
            className="p-1.5 rounded text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.08] transition-colors"
          >
            {isRead ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
          </button>
          {isHidden ? (
            <button
              onClick={() => onUnhide(conv.phone)}
              title="Restore"
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
          {isHidden && onDelete && (
            <button
              onClick={() => onDelete(conv.phone)}
              title="Delete"
              className="p-1.5 rounded text-muted-foreground/50 hover:text-rose-400 hover:bg-white/[0.08] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
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

  /* ─── DETAIL VIEW ──────────────────────────────────────────────────────── */
  if (view === "detail" && detail) {
    return (
      <div className="flex flex-col h-full overflow-y-auto p-5 md:p-8">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-sm pb-4">
          <button
            onClick={backToList}
            className="flex items-center gap-1 text-foreground/40 hover:text-foreground transition-colors pr-2 border-r border-border mr-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={backToList} className="font-medium text-muted-foreground hover:text-foreground transition-colors">
            {escalationsMode ? "Escalations" : "Inbox"}
          </button>
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-foreground font-medium">
              {detail.booking_state?.fields?.customer_name as string || selectedPhone}
            </span>
          </>
        </div>

        <div className="max-w-3xl flex flex-col flex-1 gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {detail.booking_state?.fields?.customer_name as string || selectedPhone}
              </h2>
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
                    "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-muted/60 border border-border text-foreground"
                      : "bg-primary/15 border border-primary/20 text-foreground"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1.5">
                      {format(new Date(msg.created_at), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              )
            )}
            {detail.messages.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-8">No messages in this conversation.</p>
            )}
          </div>

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
                  {Object.entries(detail.booking_state.fields).map(([key, val]) =>
                    val ? (
                      <span key={key} className="text-xs bg-muted/50 border border-border rounded-lg px-2.5 py-1">
                        <span className="text-muted-foreground/60">{key.replace(/_/g, " ")}:</span>{" "}
                        <span className="text-foreground/80 font-medium">{String(val)}</span>
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

      {/* ── Toolbar ── */}
      <div
        className="flex items-center shrink-0 h-[50px] border-b px-2 gap-1"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {/* master checkbox */}
        <div className="flex items-center justify-center w-10 shrink-0">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
            onChange={toggleMasterSelect}
            className="w-[15px] h-[15px] rounded cursor-pointer accent-primary"
          />
        </div>

        {/* platform filter tabs */}
        <div className="flex-1 h-full overflow-x-auto scrollbar-none">
          <PlatformFilterBar className="h-full" />
        </div>

        {/* search */}
        <div className="relative shrink-0 ml-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-48 pl-8 pr-3 py-1.5 rounded-md border border-border/40 bg-white/[0.04] text-[13px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all"
          />
        </div>
      </div>

      {/* ── Unread count ── */}
      {unreadCount > 0 && (
        <div
          className="flex items-center gap-1.5 px-[52px] py-1.5 text-[11px] text-muted-foreground/45 border-b"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
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
              <div key={i} className="flex items-center h-[52px] px-4 gap-3">
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
            <MessageCircle className="w-7 h-7 text-foreground/15" />
            <p className="text-sm text-foreground/35">
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
          <div className="border-t border-border/[0.08]">
            <button
              onClick={() => setShowHidden((s) => !s)}
              className="flex items-center gap-2 px-[52px] py-2.5 text-[12px] text-muted-foreground/45 hover:text-muted-foreground/70 transition-colors w-full"
            >
              <Archive className="w-3.5 h-3.5" />
              {showHidden ? "Hide" : "Show"} {hiddenCount} archived
              <ChevronDown className={cn("w-3 h-3 ml-auto transition-transform", showHidden && "rotate-180")} />
            </button>
            {showHidden && (
              <>
                <div
                  className="flex items-center justify-end px-4 py-1.5 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <button
                    onClick={() => { unhideAll(); setShowHidden(false); }}
                    className="text-[11px] text-primary/60 hover:text-primary transition-colors"
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
