import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@dashboard/components/auth/useAuthContext";
import {
  AlertTriangle, Settings, LogOut, Menu, Inbox, Wifi, Search, BookOpen,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@dashboard/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@dashboard/components/ui/sheet";
import { cn } from "@dashboard/lib/utils";
import { useConversations } from "@dashboard/hooks/use-client-api";
import { useReadStatus } from "@dashboard/hooks/use-read-status";

const HIDDEN_KEY = "unboks_hidden_conversations";
function getHiddenSet(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function TopBar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isInboxPage = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
  const searchQ = isInboxPage ? (searchParams.get("q") ?? "") : "";

  const handleSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value); else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <header className="hidden md:flex items-center gap-3 px-4 h-[64px] shrink-0 bg-white border-b border-[#d0d7de]">
      {isInboxPage && (
        <div className="relative flex items-center flex-1 max-w-[480px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#6e7781] pointer-events-none z-10" />
          <input
            value={searchQ}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search conversations…"
            style={{ paddingLeft: '34px' }}
            className="w-full h-[32px] pr-3 rounded-md bg-white border border-[#d0d7de] text-[14px] text-[#24292f] placeholder:text-[#6e7781] focus:outline-none focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/20 transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-[#6e7781] text-[12px] tabular-nums shrink-0 hidden lg:block">{dateStr}</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 h-[30px] px-3 rounded-md text-[#57606a] hover:text-[#24292f] hover:bg-[#f3f4f6] transition-colors text-[13px] border border-[#d0d7de]"
        >
          <LogOut className="w-[13px] h-[13px]" />
          Sign out
        </button>
      </div>
    </header>
  );
}

export function AppLayout() {
  const { logout } = useAuthContext();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isEscalationsView = location.pathname === "/dashboard" && searchParams.get("view") === "escalations";
  const isHome = (location.pathname === "/dashboard" || location.pathname === "/dashboard/") && !isEscalationsView;
  const isBookings = location.pathname === "/dashboard/bookings";

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
      path: "/dashboard/bookings",
      search: "",
      label: "Bookings",
      icon: BookOpen,
      isActive: isBookings,
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

  const { data: conversations } = useConversations();
  const { readSet } = useReadStatus();
  const unreadCount = (conversations ?? []).filter(
    (c) => !readSet.has(c.phone) && !getHiddenSet().has(c.phone)
  ).length;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#f6f8fa]">
      <Link
        to="/dashboard"
        onClick={() => {
          setMobileOpen(false);
          window.dispatchEvent(new Event("unboks:nav:messages"));
        }}
        className="flex items-center h-[64px] px-4 border-b border-[#d0d7de] shrink-0"
      >
        <span className="text-[15px] font-semibold text-[#24292f]">Dashboard</span>
      </Link>

      <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive;
          return (
            <Link
              key={item.label}
              to={active && item.search ? item.path : item.path + item.search}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 px-2 py-[6px] rounded-md text-[14px] transition-colors select-none",
                active
                  ? "bg-[#dde1e7] text-[#24292f] font-semibold"
                  : "text-[#24292f] hover:bg-[#d0d7de]/50 font-normal"
              )}
            >
              <item.icon
                className={cn(
                  "w-[16px] h-[16px] shrink-0",
                  active ? "text-[#24292f]" : "text-[#57606a]"
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.label === "Inbox" && unreadCount > 0 && (
                <span className="text-[11px] font-semibold text-[#57606a] bg-[#d0d7de] px-[6px] py-[1px] rounded-full tabular-nums min-w-[20px] text-center leading-5">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-[#d0d7de]">
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-2 py-[6px] w-full rounded-md text-[14px] text-[#24292f] hover:bg-[#d0d7de]/50 transition-colors"
        >
          <LogOut className="w-[16px] h-[16px] text-[#57606a] shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  const isInbox = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8fa]">
      <aside className="hidden md:block w-[280px] bg-[#f6f8fa] border-r border-[#d0d7de] shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onLogout={logout} />

        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#d0d7de]">
          <span className="text-[15px] font-semibold text-[#24292f]">Dashboard</span>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#57606a]">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] bg-[#f6f8fa] border-r border-[#d0d7de]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {isInbox ? (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-white">
            <Outlet />
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto bg-[#f6f8fa]">
            <div className="px-6 py-6 max-w-5xl">
              <Outlet />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
