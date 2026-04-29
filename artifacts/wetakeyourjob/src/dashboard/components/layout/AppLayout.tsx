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
  Inbox,
  Wifi,
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
      className="sticky top-0 z-20 hidden md:flex items-center justify-between px-8 h-[72px] shrink-0 bg-background/90 backdrop-blur-xl border-b border-border/60"
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-[18px] h-[18px] text-muted-foreground/50" />
        <span className="text-[16px] font-semibold text-foreground tracking-tight">{match.label}</span>
      </div>

      <div className="flex items-center gap-0.5">
        <span className="text-muted-foreground/45 text-[13px] font-medium tabular-nums mr-3">{dateStr}</span>

        <button
          onClick={toggle}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-150"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <NotificationBell />

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-150 text-[13px] font-medium ml-1"
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
  const { theme, toggle } = useTheme();
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
        className="flex items-center h-[72px] px-5 border-b border-border/60 shrink-0"
      >
        <div className="select-none flex items-center justify-between w-full">
          <img src={unboksLogo} alt="Unboks" className="h-7 w-auto object-contain" />
          {unreadCount > 0 && (
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full tabular-nums">
              {unreadCount}
            </span>
          )}
        </div>
      </Link>

      <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto scrollbar-none">
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
                  className="absolute inset-0 rounded-xl bg-primary/[0.10]"
                  transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-100 group",
                  active
                    ? "text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted/70"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] shrink-0 transition-colors duration-150",
                    active ? "text-primary" : "text-foreground/40 group-hover:text-foreground/70"
                  )}
                />
                <span className={cn(
                  "text-[14px] flex-1 tracking-tight",
                  active ? "font-semibold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {!hideActions && (
        <div className="px-3 pb-4 pt-2 border-t border-border/50 space-y-0.5">
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/55 hover:text-foreground hover:bg-muted/70 transition-colors w-full text-[14px] tracking-tight"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="font-medium">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/55 hover:text-destructive hover:bg-destructive/[0.07] transition-colors w-full text-[14px] tracking-tight"
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
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
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
