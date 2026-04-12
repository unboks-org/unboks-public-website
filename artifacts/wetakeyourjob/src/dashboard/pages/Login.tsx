import { useState } from "react";
import { useAuth } from "@dashboard/hooks/use-bluemarlin";
import { Navigate, useLocation } from "react-router-dom";
import { Input } from "@dashboard/components/ui/input";
import { Lock, ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@dashboard/lib/theme";
import { getClient, setClient, type Client } from "@dashboard/lib/api";

interface LocationState {
  from?: string;
}

const CLIENT_LABELS: Record<Client, string> = {
  bluemarlin: "BlueMarlin Charters",
  adamus: "Restaurant Adamus",
  roberto: "Roberto",
};

// Distinguish network failures (CORS, DNS, backend down) from real auth errors.
// fetch() throws TypeError("Failed to fetch") on network problems; api.login
// throws Error("Invalid password") on a non-OK HTTP response. Without this
// distinction a CORS rejection or unreachable backend looks identical to a
// wrong password — wasted ~30 min debugging on 2026-04-11.
function getLoginErrorText(error: unknown): string {
  const msg = error instanceof Error ? error.message : "";
  if (msg.includes("Failed to fetch") || msg.toLowerCase().includes("network")) {
    return "Can't reach server — check your connection or contact support";
  }
  return "Invalid access key";
}

export default function Login() {
  const [password, setPassword] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client>(getClient());
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const returnTo = (location.state as LocationState)?.from || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    // Brief 177 — commit client selection before firing the login mutation
    // so the password check hits the right backend.
    setClient(selectedClient);
    login.mutate(password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[360px] flex flex-col items-center"
      >
        {/* Logo / Brand */}
        <div className="mb-10 text-center select-none">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{
              background: "rgba(225,206,157,0.07)",
              border: "1px solid rgba(225,206,157,0.22)",
              boxShadow: "0 0 0 4px rgba(225,206,157,0.04), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <Lock
              className="w-6 h-6"
              style={{
                color: "#E1CE9D",
                filter: "drop-shadow(0 0 8px rgba(225,206,157,0.70))",
              }}
            />
          </motion.div>
          <h1
            className="text-xl font-bold tracking-tight text-foreground"
            style={{ letterSpacing: "-0.03em" }}
          >
            Blue Marlin Tours
          </h1>
          <p className="text-[10px] mt-1.5 tracking-[0.28em] uppercase font-bold text-primary/30">
            Operator Console
          </p>
        </div>

        {/* Card */}
        <div className="glass-card w-full rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Brief 177 — tenant selector. Writes to localStorage via setClient()
                so every subsequent API call from api.ts hits the correct backend. */}
            <div className="space-y-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-[0.3em] ml-0.5"
                style={{ color: isDark ? "rgba(255,255,255,0.40)" : "hsl(210 28% 48%)" }}
              >
                Client
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: isDark ? "rgba(6,178,220,0.45)" : "hsl(196 90% 36% / 0.6)" }}
                />
                <select
                  value={selectedClient}
                  onChange={(e) => {
                    const next = e.target.value as Client;
                    setSelectedClient(next);
                    setClient(next);
                  }}
                  className="w-full pl-10 h-11 rounded-xl text-sm transition-colors border appearance-none cursor-pointer"
                  style={{
                    background: isDark ? "rgba(9,23,38,0.80)" : "#FFFFFF",
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "hsl(210 28% 82%)",
                    color: isDark ? "#DCF1F9" : "hsl(214 65% 12%)",
                  }}
                >
                  {(Object.keys(CLIENT_LABELS) as Client[]).map((c) => (
                    <option key={c} value={c}>
                      {CLIENT_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground/50">
                Access Key
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key"
                className="h-11 rounded-xl text-sm transition-all border-white/[0.09] bg-white/[0.04] text-foreground placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-primary/20"
                style={{ outline: "none", boxShadow: "none" }}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending || !password}
              className="w-full h-11 rounded-xl font-semibold text-sm tracking-tight transition-all duration-200 flex items-center justify-center gap-2 group"
              style={{
                background: login.isPending || !password
                  ? "rgba(225,206,157,0.14)"
                  : "linear-gradient(135deg, #F0E4C0 0%, #E1CE9D 50%, #C8A96E 100%)",
                color: login.isPending || !password
                  ? "rgba(255,255,255,0.30)"
                  : "#534727",
                cursor: login.isPending || !password ? "not-allowed" : "pointer",
                borderRadius: "9999px",
                boxShadow: login.isPending || !password
                  ? "none"
                  : "0 1px 0 rgba(255,255,255,0.30) inset, 0 2px 10px rgba(225,206,157,0.20), 0 6px 24px rgba(225,206,157,0.12)",
              }}
            >
              {login.isPending ? (
                <span>Authenticating…</span>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                </>
              )}
            </button>

            {login.isError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-center py-2.5 rounded-xl text-rose-400 font-medium"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.14)",
                }}
              >
                {getLoginErrorText(login.error)}
              </motion.p>
            )}
          </form>
        </div>

        <p className="text-[9px] mt-7 tracking-[0.26em] uppercase font-bold text-foreground/15">
          Secure · Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
}
