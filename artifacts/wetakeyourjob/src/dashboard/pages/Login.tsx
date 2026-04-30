import { useState } from "react";
import { useAuth } from "@dashboard/hooks/use-client-api";
import { Navigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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
  const location = useLocation();
  const returnTo = (location.state as LocationState)?.from || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setClient(selectedClient as Client);
    login.mutate(password);
  };

  const canSubmit = !login.isPending && !!password;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 select-none">
          <img src={unboksLogo} alt="Unboks" className="h-10 w-auto object-contain mb-2" />
          <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-[#1677F2]">
            Operator Console
          </p>
        </div>

        {/* Form card */}
        <div className="border border-[#DADCE0] bg-white px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Workspace */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5F6368]">
                Workspace
              </label>
              <input
                type="text"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value.toLowerCase().trim())}
                placeholder="e.g. bluemarlin"
                className="w-full h-[44px] px-3 border border-[#DADCE0] bg-white text-[14px] text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#1677F2] focus:ring-1 focus:ring-[#1677F2] transition-colors"
              />
            </div>

            {/* Access Key */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5F6368]">
                Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key"
                autoFocus
                className="w-full h-[44px] px-3 border border-[#DADCE0] bg-white text-[14px] text-[#202124] placeholder:text-[#9AA0A6] focus:outline-none focus:border-[#1677F2] focus:ring-1 focus:ring-[#1677F2] transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-[44px] flex items-center justify-center gap-2 text-[14px] font-medium transition-colors"
              style={{
                background: canSubmit ? "#1677F2" : "#E8EAED",
                color: canSubmit ? "#FFFFFF" : "#9AA0A6",
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              {login.isPending ? (
                <span>Authenticating…</span>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Error */}
            {login.isError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[13px] text-center py-2 text-rose-600 bg-rose-50 border border-rose-100"
              >
                {getLoginErrorText(login.error)}
              </motion.p>
            )}
          </form>
        </div>

        <p className="text-[10px] text-center mt-5 tracking-[0.2em] uppercase text-[#9AA0A6]">
          Secure · Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
}
