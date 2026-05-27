import { Link, NavLink } from "react-router-dom";
import { Sparkles, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl header-bg border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-leaf shadow-glow grid place-items-center">
            <Sparkles className="w-4 h-4 text-[var(--primary-foreground)]" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Rasoi<span className="text-[var(--primary)]">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {[
            { to: "/", label: "Generate" },
            { to: "/saved", label: "Saved" },
            { to: "/pantry", label: "Pantry" },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                isActive
                  ? "px-3.5 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] font-medium text-sm"
                  : "px-3.5 py-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors font-medium text-sm"
              }
            >
              {l.label}
            </NavLink>
          ))}

          <div className="ml-2 pl-2 border-l border-[var(--border)] flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <span className="hidden sm:inline text-xs text-[var(--muted-foreground)] max-w-[140px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="w-9 h-9 rounded-full border border-[var(--border)] grid place-items-center hover:bg-[var(--muted)] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <NavLink
                to="/auth"
                className="px-3.5 py-2 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Sign in
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
