import { useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { setOnUnauthorized, getClient } from "@dashboard/lib/api";
import { AuthContext } from "./useAuthContext";

// Brief 177 — namespace the token key by client so switching clients
// doesn't bleed one client's session into another's. Each client gets
// its own localStorage slot (`wtyj_token_bluemarlin`, `wtyj_token_adamus`,
// `wtyj_token_consultadespertares`).
function getTokenKey(): string {
  return `wtyj_token_${getClient()}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(getTokenKey()));
  const navigate = useNavigate();

  const clearAuth = useCallback(() => {
    // Brief 177 — clear BOTH the namespaced token AND the client selection
    // on logout, so the login page reliably resets to the default client
    // (bluemarlin) instead of pre-selecting the last-used one. Matches the
    // brief's Step 3.3 requirement.
    localStorage.removeItem(getTokenKey());
    localStorage.removeItem("wtyj_client");
    setToken(null);
  }, []);

  const login = useCallback((newToken: string) => {
    localStorage.setItem(getTokenKey(), newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    navigate("/login", { replace: true });
  }, [clearAuth, navigate]);

  useEffect(() => {
    setOnUnauthorized(() => {
      clearAuth();
      navigate("/login", { replace: true });
    });
  }, [clearAuth, navigate]);

  const value = useMemo(
    () => ({ isAuthenticated: !!token, token, login, logout }),
    [token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
