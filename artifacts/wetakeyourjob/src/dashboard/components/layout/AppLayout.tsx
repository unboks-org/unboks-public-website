import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@dashboard/components/auth/useAuthContext";
import { useTheme } from "@dashboard/lib/theme";
import {
  LayoutDashboard,
  MessageCircle,
  Share2,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@dashboard/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@dashboard/components/ui/sheet";
import { cn } from "@dashboard/lib/utils";
import { motion } from "framer-motion";
import { useConversations, useDryRun } from "@dashboard/hooks/use-bluemarlin";
import { useReadStatus } from "@dashboard/hooks/use-read-status";
import { useFeatureToggles } from "@dashboard/lib/feature-toggles";
import { PenSquare } from "lucide-react";

const HIDDEN_KEY = "bluemarlin_hidden_conversations";
function getHiddenSet(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

const BASE_NAV = [
  { path: "/dashboard", label: "Home", icon: LayoutDashboard, featureKey: null },
  { path: "/dashboard/messages", label: "Messages", icon: MessageCircle, featureKey: null },
  { path: "/dashboard/escalations", label: "Escalations", icon: AlertTriangle, featureKey: null },
  { path: "/dashboard/social", label: "Social Media", icon: Share2, featureKey: "showSocial" as const },
  { path: "/dashboard/create", label: "Create", icon: PenSquare, featureKey: "showCreate" as const },
  { path: "/dashboard/settings", label: "Settings", icon: Settings, featureKey: null },
];

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
  const { theme, toggle } = useTheme();

  const current =
    BASE_NAV.find(
      (item) =>
        location.pathname === item.path ||
        (item.path !== "/dashboard" && location.pathname.startsWith(item.path))
    ) || BASE_NAV[0];
  const Icon = current.icon;

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
        <span className="text-sm font-medium text-foreground/60 tracking-tight">{current.label}</span>
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { features } = useFeatureToggles();

  const navItems = BASE_NAV.filter((item) => {
    if (item.featureKey === "showSocial") return features.showSocial;
    if (item.featureKey === "showCreate") return features.showCreate;
    return true;
  });

  const { data: conversations } = useConversations();
  const { readSet } = useReadStatus();
  const unreadCount = (conversations ?? []).filter(
    (c) => !readSet.has(c.phone) && !getHiddenSet().has(c.phone)
  ).length;

  const SidebarContent = ({ hideActions = false }: { hideActions?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 pt-7 pb-5 border-b border-white/[0.08]">
        <div className="select-none">
          <p className="text-[15px] font-bold tracking-tight leading-none text-gradient-ocean">
            Blue Marlin Tours
          </p>
          <p className="text-[10px] font-bold tracking-[0.24em] text-primary/45 uppercase mt-2">
            Dashboard
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-3 space-y-0.5 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                setMobileOpen(false);
                if (item.path === "/dashboard/messages") {
                  window.dispatchEvent(new Event("bluemarlin:nav:messages"));
                }
                if (item.path === "/dashboard/escalations") {
                  window.dispatchEvent(new Event("bluemarlin:nav:escalations"));
                }
              }}
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
                    : "text-foreground/55 hover:text-foreground/85 hover:bg-white/[0.05]"
                )}
              >
                <div className="relative flex-shrink-0">
                  <item.icon
                    className={cn(
                      "w-[18px] h-[18px] transition-all duration-200",
                      active ? "text-primary" : "group-hover:text-foreground/80"
                    )}
                    style={active ? { filter: "drop-shadow(0 0 6px rgba(225,206,157,0.70))" } : undefined}
                  />
                  {item.path === "/dashboard/messages" && unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] rounded-full bg-primary shadow-[0_0_6px_rgba(225,206,157,0.9)]" />
                  )}
                </div>
                <span className={cn(
                  "text-[15px] flex-1 tracking-tight",
                  active ? "font-semibold" : "font-medium"
                )}>
                  {item.label}
                </span>
                {item.path === "/dashboard/messages" && unreadCount > 0 && (
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
          );
        })}
      </nav>

      {/* Bottom actions */}
      {!hideActions && (
        <div className="px-3 pb-3 pt-2 border-t border-white/[0.08] space-y-0.5">
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/45 hover:text-foreground/80 hover:bg-white/[0.05] transition-colors w-full text-[14px] tracking-tight"
          >
            {theme === "dark" ? <Sun className="w-[17px] h-[17px]" /> : <Moon className="w-[17px] h-[17px]" />}
            <span className="font-medium">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/45 hover:text-rose-400 hover:bg-rose-500/[0.07] transition-colors w-full text-[14px] tracking-tight"
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
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-52 glass-panel shrink-0 z-20">
        <SidebarContent hideActions />
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DryRunBanner />
        <TopBar onLogout={logout} />

        {/* Mobile Header */}
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

        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
