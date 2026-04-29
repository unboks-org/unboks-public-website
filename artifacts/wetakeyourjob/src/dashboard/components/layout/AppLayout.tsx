import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@dashboard/components/auth/useAuthContext";
import {
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  Bell,
  Inbox,
  Wifi,
  Search,
} from "lucide-react";
import unboksLogo from "@assets/image_1777435198078.png";
import { useState, useRef, useEffect } from "react";
import { Button } from "@dashboard/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@dashboard/components/ui/sheet";
import { cn } from "@dashboard/lib/utils";
import { motion } from "framer-motion";
import { useConversations } from "@dashboard/hooks/use-bluemarlin";
import { useReadStatus } from "@dashboard/hooks/use-read-status";
import { PRODUCT_NAME } from "@dashboard/lib/tenant";

const HIDDEN_KEY = "bluemarlin_hidden_conversations";
function getHiddenSet(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

const PAGE_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  "/dashboard": { label: "Inbox", icon: Inbox },
  "/dashboard/escalations": { label: "Escalations", icon: AlertTriangle },
  "/dashboard/channels": { label: "Channels", icon: Wifi },
  "/dashboard/settings": { label: "Settings", icon: Settings },
  "/dashboard/settings/analytics": { label: "Analytics", icon: Settings },
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-150"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 rounded-2xl z-50 overflow-hidden bg-popover border border-border shadow-xl"
        >
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
            <span className="text-[15px] font-semibold text-foreground">Notifications</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/55">Clear</span>
          </div>
          <div className="px-4 py-8 text-center">
            <Bell className="w-5 h-5 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground/60">No new notifications</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TopBar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isInboxPage = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
  const isEscalationsView = isInboxPage && searchParams.get("view") === "escalations";
  const baseMatch = PAGE_LABELS[location.pathname] ?? PAGE_LABELS["/dashboard"];
  const match = isEscalationsView
    ? { label: "Escalations", icon: AlertTriangle }
    : baseMatch;
  const Icon = match.icon;

  const searchQ = isInboxPage ? (searchParams.get("q") ?? "") : "";

  const handleSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value); else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="sticky top-0 z-20 hidden md:flex items-center justify-between px-7 h-[76px] shrink-0 bg-card border-b border-border gap-4"
    >
      <div className="flex items-center gap-3 shrink-0">
        <Icon className="w-5 h-5 text-[#94A3B8]" />
        <span className="text-[18px] font-semibold text-[#0F172A]">{match.label}</span>
      </div>

      <div className="flex items-center gap-3 ml-auto pr-1">
        {isInboxPage && (
          <div className="relative flex items-center" style={{ width: 'clamp(260px, 26vw, 360px)' }}>
            <Search className="absolute left-[15px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none z-10" />
            <input
              value={searchQ}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search conversations…"
              style={{ paddingLeft: '42px' }}
              className="w-full h-[42px] pr-4 rounded-full bg-[#F5F7FA] border border-[#E2E8F0] text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
        )}

        <span className="text-[#94A3B8] text-[13px] font-medium tabular-nums shrink-0">{dateStr}</span>

        <NotificationBell />

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 h-[36px] px-3 rounded-[10px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F5F7FA] transition-all duration-150 text-[13px] font-medium shrink-0"
        >
          <LogOut className="w-[15px] h-[15px]" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// DryRunBanner: intentionally not shown in the main Unboks customer nav.
// It is preserved here for legacy BlueMarlin clients who use social publishing.
// TODO: render conditionally when tenant has social publishing enabled.

export function AppLayout() {
  const { logout } = useAuthContext();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isEscalationsView = location.pathname === "/dashboard" && searchParams.get("view") === "escalations";
  const isHome = (location.pathname === "/dashboard" || location.pathname === "/dashboard/") && !isEscalationsView;

  const NAV_ITEMS = [
    {
      path: "/dashboard",
      search: "",
      label: "Inbox",
      icon: Inbox,
      isActive: isHome,
    },
    {
      path: "/dashboard",
      search: "?view=escalations",
      label: "Escalations",
      icon: AlertTriangle,
      isActive: isEscalationsView,
    },
    {
      path: "/dashboard/channels",
      search: "",
      label: "Channels",
      icon: Wifi,
      isActive: location.pathname === "/dashboard/channels",
    },
    {
      path: "/dashboard/settings",
      search: "",
      label: "Settings",
      icon: Settings,
      isActive: location.pathname === "/dashboard/settings" || location.pathname.startsWith("/dashboard/settings/"),
    },
  ];

  const isSettingsActive = location.pathname === "/dashboard/settings" || location.pathname.startsWith("/dashboard/settings/");

  const { data: conversations } = useConversations();
  const { readSet } = useReadStatus();
  const unreadCount = (conversations ?? []).filter(
    (c) => !readSet.has(c.phone) && !getHiddenSet().has(c.phone)
  ).length;

  const SidebarContent = ({ hideActions = false }: { hideActions?: boolean }) => (
    <div className="flex flex-col h-full">
      <Link
        to="/dashboard"
        onClick={() => {
          setMobileOpen(false);
          window.dispatchEvent(new Event("bluemarlin:nav:messages"));
        }}
        className="flex items-center h-[96px] px-6 border-b border-border shrink-0"
      >
        <div className="select-none flex items-center justify-between w-full">
          <img src={unboksLogo} alt="Unboks" className="w-[148px] h-auto object-contain" />
          {unreadCount > 0 && (
            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full tabular-nums border border-primary/15">
              {unreadCount}
            </span>
          )}
        </div>
      </Link>

      <nav className="flex-1 px-[14px] pt-4 flex flex-col gap-[6px] overflow-y-auto scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              to={active && item.search ? item.path : item.path + item.search}
              onClick={() => setMobileOpen(false)}
              className="relative block"
            >
              {active && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-[14px] bg-[#EAF3FF] border border-[rgba(22,119,242,0.10)]"
                  transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 px-[14px] min-h-[44px] rounded-[14px] transition-colors duration-100 group",
                  active
                    ? "text-[#1677F2]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F5F8FC]"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] shrink-0 transition-colors duration-150",
                    active ? "text-[#1677F2]" : "text-[#94A3B8] group-hover:text-[#64748B]"
                  )}
                />
                <span className={cn(
                  "text-[14px] flex-1 font-medium",
                  active ? "text-[#1677F2]" : ""
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {!hideActions && (
        <div className="px-3 pb-4 pt-2 border-t border-border/50">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-[14px] py-2.5 rounded-[14px] text-[#64748B] hover:text-destructive hover:bg-destructive/[0.07] transition-colors w-full text-[14px]"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:block w-[260px] glass-panel shrink-0 z-20">
        <SidebarContent hideActions />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onLogout={logout} />

        <header
          className="md:hidden flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-xl border-b border-border/60"
        >
          <div className="flex items-center gap-2 select-none">
            <img src={unboksLogo} alt="Unboks" className="h-6 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-1">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px] bg-background border-border/50">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* inbox is full-bleed and handles its own scroll; other pages get padded wrapper */}
        {(location.pathname === "/dashboard" || location.pathname === "/dashboard/") ? (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <Outlet />
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto p-5 md:p-8">
            <div className="max-w-6xl mx-auto">
              <Outlet />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
