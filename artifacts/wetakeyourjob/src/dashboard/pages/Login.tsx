import { useState } from "react";
import { useAuth } from "@dashboard/hooks/use-client-api";
import { Navigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getClient, setClient, type Client } from "@dashboard/lib/api";

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
      <div className="w-full max-w-[400px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 select-none">
          <p className="text-[14px] font-semibold text-[#24292f]">Unboks</p>
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#57606a] mt-0.5">
            Operator Console
          </p>
        </div>

        {/* Form */}
        <div className="border border-[#d0d7de] bg-white px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#57606a]">
                Workspace
              </label>
              <input
                type="text"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value.toLowerCase().trim())}
                placeholder="e.g. bluemarlin"
                className="w-full h-[44px] px-3 border border-[#d0d7de] bg-white text-[14px] text-[#24292f] placeholder:text-[#6e7781] focus:outline-none focus:border-[#0969da] focus:ring-1 focus:ring-[#0969da] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#57606a]">
                Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key"
                autoFocus
                className="w-full h-[44px] px-3 border border-[#d0d7de] bg-white text-[14px] text-[#24292f] placeholder:text-[#6e7781] focus:outline-none focus:border-[#0969da] focus:ring-1 focus:ring-[#0969da] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-[44px] flex items-center justify-center gap-2 text-[14px] font-medium border transition-colors"
              style={{
                background: canSubmit ? "#0969da" : "#f6f8fa",
                color: canSubmit ? "#ffffff" : "#6e7781",
                borderColor: canSubmit ? "#0969da" : "#d0d7de",
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

            {login.isError && (
              <p className="text-[13px] text-center py-2 text-[#cf222e] bg-[#ffebe9] border border-[#ffcecb]">
                {getLoginErrorText(login.error)}
              </p>
            )}
          </form>
        </div>

        <p className="text-[11px] text-center mt-5 tracking-[0.2em] uppercase text-[#6e7781]">
          Secure · Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
