import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUpgrade } from "@/contexts/UpgradeContext";
import { getRecoveryPending, RECOVERY_PENDING_EVENT } from "@/lib/recoveryMode";
import { LogOut, User, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { openUpgrade } = useUpgrade();
  const navigate = useNavigate();
  const [recoveryPending, setRecoveryPending] = useState(() => getRecoveryPending());

  useEffect(() => {
    const handler = () => setRecoveryPending(getRecoveryPending());
    window.addEventListener(RECOVERY_PENDING_EVENT, handler);
    return () => window.removeEventListener(RECOVERY_PENDING_EVENT, handler);
  }, []);

  const navLinkClass = "text-foreground hover:text-primary transition-colors duration-150 font-medium";
  const navButtonClass = "text-foreground hover:text-primary transition-colors duration-150 font-medium cursor-pointer";

  if (recoveryPending) {
    return (
      <header className="sticky top-0 z-50 border-b border-border bg-white/72 backdrop-blur-[12px] shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <span className="font-heading text-lg sm:text-xl font-semibold text-primary">
            Complete password reset
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/72 backdrop-blur-[12px] shadow-sm">
      <div className="container mx-auto px-4 py-3 grid grid-cols-3 items-center gap-4 w-full max-w-6xl">
        <div className="flex justify-start min-w-0">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center shadow-card">
              <span className="text-primary-foreground font-bold text-sm sm:text-base">M</span>
            </div>
            <span className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              MSRD
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex justify-center items-center gap-6">
          {user && user.plan !== 'free' ? (
            <Link to="/search?q=" className={navLinkClass}>Search</Link>
          ) : (
            <button onClick={() => { if (!user) navigate('/'); else openUpgrade(); }} className={navButtonClass}>
              Search
            </button>
          )}
          {user && user.plan !== 'free' ? (
            <Link to="/dashboard" className={navLinkClass}>Bookmarks</Link>
          ) : user ? (
            <button onClick={openUpgrade} className={navButtonClass}>Bookmarks</button>
          ) : null}
          {isAdmin && (
            <Link to="/admin" className={`${navLinkClass} flex items-center gap-1`}>
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        <nav className="md:hidden flex justify-center items-center gap-3">
          <button
            onClick={() => {
              if (!user) navigate('/');
              else if (user.plan === 'free') openUpgrade();
              else navigate('/search?q=');
            }}
            className="p-2 text-foreground hover:text-primary transition-colors duration-150"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {user && user.plan !== 'free' ? (
            <Link to="/dashboard" className="p-2 text-foreground hover:text-primary transition-colors duration-150" aria-label="Bookmarks">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>
          ) : user ? (
            <button onClick={openUpgrade} className="p-2 text-foreground hover:text-primary transition-colors duration-150" aria-label="Bookmarks">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          ) : null}
          {isAdmin && (
            <Link to="/admin" className="p-2 text-foreground hover:text-primary transition-colors duration-150" aria-label="Admin">
              <Shield className="w-5 h-5" />
            </Link>
          )}
        </nav>

        <div className="flex justify-end items-center gap-2 md:gap-4 min-w-0">
          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to="/account"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors duration-150"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </Link>
              <Link to="/account" className="md:hidden flex items-center p-2 rounded-lg hover:bg-muted/80 transition-colors duration-150">
                <User className="w-4 h-4 text-muted-foreground" />
              </Link>
              <button
                onClick={logout}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted/80"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/">
              <span className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity duration-150">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
