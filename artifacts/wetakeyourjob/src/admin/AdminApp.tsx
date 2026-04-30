import { useState } from "react";
import { Routes, Route, Navigate, NavLink, useNavigate } from "react-router-dom";
import unboksLogo from "@assets/image_1777435198078.png";
import { Users, Settings, LayoutDashboard, LogOut, ChevronRight, Wifi, BookOpen, BarChart2 } from "lucide-react";

const ADMIN_PASS_KEY = "unboks_admin_token";
const ADMIN_SECRET = "unboks2025";

const CLIENTS = [
  { id: "bluemarlin",          name: "Blue Marlin Tours",       country: "Curaçao",  channels: ["WhatsApp", "Instagram"], status: "active" },
  { id: "adamus",              name: "Adamus",                  country: "—",         channels: ["WhatsApp"],               status: "active" },
  { id: "consultadespertares", name: "Consulta Despertares",    country: "—",         channels: ["WhatsApp"],               status: "active" },
  { id: "unboks",              name: "Unboks (internal)",       country: "—",         channels: ["WhatsApp"],               status: "active" },
];

function AdminLogin() {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_SECRET) {
      localStorage.setItem(ADMIN_PASS_KEY, "1");
      window.location.reload();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center mb-10">
          <img src={unboksLogo} alt="Unboks" className="h-9 w-auto mb-2" />
          <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-[#DC2626]">
            Internal Admin
          </p>
        </div>
        <div className="border border-[#DADCE0] px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5F6368]">
                Admin Password
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => { setPass(e.target.value); setError(false); }}
                placeholder="Enter admin password"
                autoFocus
                className="w-full h-[44px] px-3 border border-[#DADCE0] bg-white text-[14px] text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] transition-colors"
              />
              {error && (
                <p className="text-[12px] text-red-600">Incorrect password</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full h-[44px] flex items-center justify-center gap-2 text-[14px] font-medium bg-[#DC2626] text-white transition-colors hover:bg-[#B91C1C]"
            >
              Enter Admin
            </button>
          </form>
        </div>
        <p className="text-[10px] text-center mt-5 tracking-[0.2em] uppercase text-[#9AA0A6]">
          Unboks Internal · Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}

const NAV = [
  { to: "/admin",          label: "Overview",       icon: LayoutDashboard, end: true },
  { to: "/admin/clients",  label: "Clients",        icon: Users           },
  { to: "/admin/channels", label: "Channels",       icon: Wifi            },
  { to: "/admin/training", label: "Knowledge Base", icon: BookOpen        },
  { to: "/admin/reports",  label: "Reports",        icon: BarChart2       },
  { to: "/admin/settings", label: "Settings",       icon: Settings        },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_PASS_KEY);
    navigate("/admin");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <div className="w-[220px] bg-white border-r border-[#E5E7EB] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="h-[64px] flex items-center px-5 border-b border-[#E5E7EB] gap-3">
          <img src={unboksLogo} alt="Unboks" className="h-6 w-auto" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#DC2626]">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 h-[40px] px-4 text-[13px] transition-colors ${
                  isActive
                    ? "bg-[#FEF2F2] text-[#DC2626] font-medium"
                    : "text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]"
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 h-[40px] px-4 text-[13px] text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124] transition-colors border-t border-[#E5E7EB]"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}

function AdminOverview() {
  return (
    <div>
      <div className="h-[56px] border-b border-[#E5E7EB] bg-white flex items-center px-8">
        <h1 className="text-[15px] font-semibold text-[#202124]">Overview</h1>
      </div>
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Clients",   value: CLIENTS.length },
            { label: "Total Channels",   value: 6 },
            { label: "Messages Today",   value: "—" },
            { label: "Open Escalations", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-[#E5E7EB] px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9AA0A6] mb-1">{stat.label}</p>
              <p className="text-[28px] font-semibold text-[#202124]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Client list */}
        <div className="bg-white border border-[#E5E7EB]">
          <div className="h-[44px] border-b border-[#E5E7EB] flex items-center px-5">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#5F6368]">Clients</span>
          </div>
          {CLIENTS.map((client) => (
            <div key={client.id} className="h-[52px] border-b border-[#E5E7EB] last:border-b-0 flex items-center px-5 hover:bg-[#F8F9FA] transition-colors cursor-pointer group">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#202124]">{client.name}</p>
                <p className="text-[12px] text-[#9AA0A6]">{client.id} · {client.country}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {client.channels.map((ch) => (
                    <span key={ch} className="text-[11px] text-[#5F6368] border border-[#E5E7EB] px-2 py-0.5">{ch}</span>
                  ))}
                </div>
                <span className="w-2 h-2 bg-green-500 rounded-full" title="Active" />
                <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#5F6368] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <div className="h-[56px] border-b border-[#E5E7EB] bg-white flex items-center px-8">
        <h1 className="text-[15px] font-semibold text-[#202124]">{title}</h1>
      </div>
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-[14px] text-[#9AA0A6]">This section is not built yet.</p>
        <p className="text-[13px] text-[#C4C7CB] mt-1">It will be added in a future session.</p>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const isAuthed = !!localStorage.getItem(ADMIN_PASS_KEY);

  if (!isAuthed) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="clients"  element={<ComingSoon title="Clients" />} />
        <Route path="channels" element={<ComingSoon title="Channels" />} />
        <Route path="training" element={<ComingSoon title="Knowledge Base" />} />
        <Route path="reports"  element={<ComingSoon title="Reports" />} />
        <Route path="settings" element={<ComingSoon title="Settings" />} />
        <Route path="*"        element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
