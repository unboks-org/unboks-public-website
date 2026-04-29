import { useState } from "react";
import { useAuth } from "@dashboard/hooks/use-bluemarlin";
import { Navigate, useLocation } from "react-router-dom";
import { Input } from "@dashboard/components/ui/input";
import { ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@dashboard/lib/theme";
import { getClient, setClient, type Client } from "@dashboard/lib/api";
import unboksLogo from "@assets/image_1777435198078.png";

interface LocationState {
  from?: string;
}

function getLoginErrorText(error: unknown): string {
  const msg = error instanceof Error ? error.message : "";
  if (msg.includes("Failed to fetch") || msg.toLowerCase().includes("network")) {
    return "Can't reach server — check your connection or contact support";
  }
  return "Invalid access key";
}

export default function Login() {
  const [password, setPassword] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>(getClient());
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
    setClient(selectedClient);
    login.mutate(password);
  };

  const canSubmit = !login.isPending && !!password;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[360px] flex flex-col items-center"
      >
        {/* Logo */}
        <div className="mb-10 text-center select-none">
          <motion.div
            initial={{ scale: 0.90, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center mb-3"
          >
            <img src={unboksLogo} alt="Unboks" className="h-9 w-auto object-contain" />
          </motion.div>
          <p
            className="text-[10px] tracking-[0.28em] uppercase font-semibold"
            style={{ color: isDark ? "rgba(255,255,255,0.35)" : "hsl(214 89% 50%)" }}
          >
            Operator Console
          </p>
        </div>

        {/* Card */}
        <div className="glass-card w-full rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-[0.3em] ml-0.5"
                style={{ color: isDark ? "rgba(255,255,255,0.40)" : "hsl(215 20% 55%)" }}
              >
                Workspace
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: isDark ? "rgba(22,119,242,0.50)" : "hsl(214 89% 52% / 0.55)" }}
                />
                <input
                  type="text"
                  value={selectedClient}
                  onChange={(e) => {
                    const next = e.target.value.toLowerCase().trim();
                    setSelectedClient(next as Client);
                  }}
                  placeholder="e.g. bluemarlin"
                  className="w-full pl-10 h-11 rounded-xl text-sm transition-colors border appearance-none"
                  style={{
                    background: isDark ? "rgba(9,23,38,0.80)" : "#FFFFFF",
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "hsl(215 16% 85%)",
                    color: isDark ? "#DCF1F9" : "hsl(60 6% 5%)",
                  }}
                />
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
                className="h-11 rounded-xl text-sm transition-all text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-primary/20"
                style={{
                  borderColor: isDark ? "rgba(255,255,255,0.09)" : "hsl(215 16% 85%)",
                  background: isDark ? "rgba(9,23,38,0.60)" : "#FFFFFF",
                  outline: "none",
                  boxShadow: "none",
                }}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-11 font-semibold text-sm tracking-tight transition-all duration-200 flex items-center justify-center gap-2 group"
              style={{
                borderRadius: "9999px",
                background: canSubmit
                  ? "#1677F2"
                  : isDark ? "rgba(22,119,242,0.12)" : "hsl(214 89% 95%)",
                color: canSubmit
                  ? "#FFFFFF"
                  : isDark ? "rgba(255,255,255,0.28)" : "hsl(214 50% 70%)",
                cursor: canSubmit ? "pointer" : "not-allowed",
                boxShadow: canSubmit
                  ? "rgba(22, 119, 242, 0.30) 0px 4px 20px 0px"
                  : "none",
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
                className="text-xs text-center py-2.5 rounded-xl text-rose-500 font-medium"
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
