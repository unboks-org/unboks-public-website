import { BarChart3, Home, Inbox, LogOut, MessageSquare, Settings, ShieldAlert, FileText } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const sidebarLinks = [
  { to: '/dashboard', label: 'Overview', icon: Home, end: true },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare, end: false },
  { to: '/dashboard/escalations', label: 'Escalations', icon: ShieldAlert, end: false },
  { to: '/dashboard/content', label: 'Content', icon: FileText, end: false },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, end: false },
];

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-50" data-testid="dashboard-layout">
      <aside className="hidden w-60 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-14 items-center border-b border-slate-100 px-5">
          <NavLink to="/" className="text-sm font-semibold text-slate-900 tracking-tight" data-testid="link-dashboard-logo">
            We Take Your Job
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                data-testid={`link-sidebar-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`
                }
              >
                <Icon size={16} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 px-3 py-3">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-600"
            data-testid="link-dashboard-back"
          >
            <LogOut size={16} />
            Back to site
          </NavLink>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 md:hidden">
          <NavLink to="/" className="text-sm font-semibold text-slate-900" data-testid="link-dashboard-logo-mobile">
            WTYJ Dashboard
          </NavLink>
          <NavLink to="/" className="text-xs text-slate-400 hover:text-slate-600" data-testid="link-dashboard-back-mobile">
            Back to site
          </NavLink>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
