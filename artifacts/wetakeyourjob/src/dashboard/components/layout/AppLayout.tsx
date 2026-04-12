import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@dashboard/components/auth/useAuthContext";
import { useTheme } from "@dashboard/lib/theme";
import {
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  Bell,
  Sun,
  Moon,
  CalendarDays,
  Inbox,
  Share2,
  PenSquare,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@dashboard/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@dashboard/components/ui/sheet";
import { cn } from "@dashboard/lib/utils";
import { motion } from "framer-motion";
import { useConversations, useDryRun } from "@dashboard/hooks/use-bluemarlin";
import { useReadStatus } from "@dashboard/hooks/use-read-status";
import { useBookingsLabel } from "@dashboard/hooks/use-bookings-label";
import { useFeatureToggles } from "@dashboard/lib/feature-toggles";

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
  "/dashboard/bookings": { label: "Bookings", icon: CalendarDays },
  "/dashboard/settings": { label: "Settings", icon: Settings },
  "/dashboard/settings/analytics": { label: "Analytics", icon: Settings },
  "/dashboard/overview": { label: "Overview", icon: Inbox },
  "/dashboard/social": { label: "Social Media", icon: Inbox },
  "/dashboard/create": { label: "Create", icon: Inbox },
  "/dashboard/training": { label: "Brand Training", icon: Settings },
  "/dashboard/published": { label: "Published", icon: Inbox },
  "/dashboard/learnings": { label: "Learnings", icon: Settings },
  "/dashboard/assets": { label: "Assets", icon: Settings },
  "/dashboard/capacity": { label: "Capacity", icon: CalendarDays },
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
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all duration-150"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 rounded-2xl z-50 overflow-hidden"
          style={{
            background: "rgba(10, 18, 35, 0.96)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Clear</span>
          </div>
          <div className="px-4 py-8 text-center">
            <Bell className="w-5 h-5 text-muted-foreground/15 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground/50">No new notifications</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TopBar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { theme, toggle } = useTheme();

  const isEscalationsView = location.pathname === "/dashboard" && searchParams.get("view") === "escalations";
  const baseMatch = PAGE_LABELS[location.pathname] ?? PAGE_LABELS["/dashboard"];
  const match = isEscalationsView
    ? { label: "Escalations", icon: AlertTriangle }
    : baseMatch;
  const Icon = match.icon;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="sticky top-0 z-20 hidden md:flex items-center justify-between px-6 h-12 shrink-0 backdrop-blur-2xl"
      style={{
        background: "var(--surface-overlay)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground/40" />
        <span className="text-sm font-medium text-foreground/80 tracking-tight">{match.label}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-muted-foreground/35 text-xs font-medium tabular-nums mr-2">{dateStr}</span>

        <button
          onClick={toggle}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all duration-150"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        <NotificationBell />

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-all duration-150 text-xs font-medium ml-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function DryRunBanner() {
  const { data, toggle } = useDryRun();
  if (!data?.dry_run) return null;
  return (
    <div className="w-full bg-amber-500/10 text-amber-400 px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-medium border-b border-amber-500/15 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">
          Dry-run mode active — posts are marked "published" but nothing is actually sent to social media.
        </span>
      </div>
      <button
        onClick={() => toggle.mutate()}
        disabled={toggle.isPending}
        className="ml-2 bg-amber-500 text-amber-950 px-3 py-1 rounded-lg font-bold hover:bg-amber-400 disabled:opacity-50 shrink-0 text-xs transition-colors"
      >
        {toggle.isPending ? "Disabling…" : "Disable"}
      </button>
    </div>
  );
}

export function AppLayout() {
  const { logout } = useAuthContext();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { label: bookingsLabel } = useBookingsLabel();
  const { features } = useFeatureToggles();

  const isEscalationsView = location.pathname === "/dashboard" && searchParams.get("view") === "escalations";

  const NAV_ITEMS = [
    {
      path: "/dashboard",
      search: "?view=escalations",
      label: "Escalations",
      icon: AlertTriangle,
      isActive: isEscalationsView,
    },
    {
      path: "/dashboard/bookings",
      search: "",
      label: bookingsLabel,
      icon: CalendarDays,
      isActive: location.pathname === "/dashboard/bookings" || location.pathname.startsWith("/dashboard/bookings/"),
    },
    ...(features.showSocial ? [{
      path: "/dashboard/social",
      search: "",
      label: "Social Media",
      icon: Share2,
      isActive: location.pathname === "/dashboard/social" || location.pathname.startsWith("/dashboard/social/"),
    }] : []),
    ...(features.showCreate ? [{
      path: "/dashboard/create",
      search: "",
      label: "Create",
      icon: PenSquare,
      isActive: location.pathname === "/dashboard/create" || location.pathname.startsWith("/dashboard/create/"),
    }] : []),
  ];

  const isSettingsActive = location.pathname === "/dashboard/settings" || location.pathname.startsWith("/dashboard/settings/");

  const { data: conversations } = useConversations();
  const { readSet } = useReadStatus();
  const unreadCount = (conversations ?? []).filter(
    (c) => !readSet.has(c.phone) && !getHiddenSet().has(c.phone)
  ).length;

  const isHome = (location.pathname === "/dashboard" || location.pathname === "/dashboard/") && !isEscalationsView;

  const SidebarContent = ({ hideActions = false }: { hideActions?: boolean }) => (
    <div className="flex flex-col h-full">
      <Link
        to="/dashboard"
        onClick={() => {
          setMobileOpen(false);
          window.dispatchEvent(new Event("bluemarlin:nav:messages"));
        }}
        className={cn(
          "block px-5 pt-7 pb-5 border-b border-white/[0.08] group transition-colors",
          isHome ? "bg-primary/[0.06]" : "hover:bg-white/[0.03]"
        )}
      >
        <div className="select-none flex items-center justify-between">
          <div>
            <p className="text-[15px] font-bold tracking-tight leading-none text-gradient-ocean">
              Blue Marlin Tours
            </p>
            <p className="text-[10px] font-bold tracking-[0.24em] text-primary/45 uppercase mt-2">
              Dashboard
            </p>
          </div>
          {unreadCount > 0 && (
            <span
              className="text-[11px] font-bold text-primary px-2 py-0.5 rounded-full tabular-nums"
              style={{
                background: "rgba(225,206,157,0.12)",
                boxShadow: "inset 0 0 0 1px rgba(225,206,157,0.25)",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
      </Link>

      <nav className="flex-1 px-3 pt-3 space-y-0.5 overflow-y-auto scrollbar-none">
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
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "rgba(225,206,157,0.10)",
                    boxShadow: "inset 0 0 0 1px rgba(225,206,157,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                  transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-100 group",
                  active
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/[0.07]"
                )}
              >
                <div className="relative flex-shrink-0">
                  <item.icon
                    className={cn(
                      "w-[18px] h-[18px] transition-all duration-200",
                      active ? "text-primary" : "group-hover:text-foreground"
                    )}
                    style={active ? { filter: "drop-shadow(0 0 6px rgba(225,206,157,0.70))" } : undefined}
                  />
                </div>
                <span className={cn(
                  "text-[15px] flex-1 tracking-tight",
                  active ? "font-semibold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-1 pt-2 border-t border-white/[0.08]">
        <Link
          to="/dashboard/settings"
          onClick={() => setMobileOpen(false)}
          className="relative block"
        >
          {isSettingsActive && (
            <motion.div
              layoutId="sidebar-pill"
              className="absolute inset-0 rounded-xl"
              style={{
                background: "rgba(225,206,157,0.10)",
                boxShadow: "inset 0 0 0 1px rgba(225,206,157,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            />
          )}
          <div
            className={cn(
              "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-100 group",
              isSettingsActive
                ? "text-foreground"
                : "text-foreground/70 hover:text-foreground hover:bg-white/[0.07]"
            )}
          >
            <Settings
              className={cn(
                "w-[18px] h-[18px] transition-all duration-200",
                isSettingsActive ? "text-primary" : "group-hover:text-foreground"
              )}
              style={isSettingsActive ? { filter: "drop-shadow(0 0 6px rgba(225,206,157,0.70))" } : undefined}
            />
            <span className={cn(
              "text-[15px] flex-1 tracking-tight",
              isSettingsActive ? "font-semibold" : "font-medium"
            )}>
              Settings
            </span>
          </div>
        </Link>
      </div>

      {!hideActions && (
        <div className="px-3 pb-3 pt-1 border-t border-white/[0.08] space-y-0.5">
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/65 hover:text-foreground hover:bg-white/[0.07] transition-colors w-full text-[14px] tracking-tight"
          >
            {theme === "dark" ? <Sun className="w-[17px] h-[17px]" /> : <Moon className="w-[17px] h-[17px]" />}
            <span className="font-medium">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/65 hover:text-rose-400 hover:bg-rose-500/[0.07] transition-colors w-full text-[14px] tracking-tight"
          >
            <LogOut className="w-[17px] h-[17px]" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:block w-52 glass-panel shrink-0 z-20">
        <SidebarContent hideActions />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DryRunBanner />
        <TopBar onLogout={logout} />

        <header
          className="md:hidden flex items-center justify-between px-4 py-3 backdrop-blur-2xl"
          style={{
            background: "var(--surface-overlay)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2 select-none">
            <span className="text-sm font-bold text-foreground text-gradient-ocean">Blue Marlin Tours</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.07] transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-56 bg-background border-white/[0.06]">
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
