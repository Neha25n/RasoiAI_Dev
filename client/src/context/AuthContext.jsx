import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("rasoiai-token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(r => setUser(r.data.user))
      .catch(() => { setToken(null); localStorage.removeItem("rasoiai-token"); })
      .finally(() => setLoading(false));
  }, [token]);

  const login = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("rasoiai-token", t);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("rasoiai-token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
