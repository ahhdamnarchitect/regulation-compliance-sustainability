import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUpgrade } from "@/contexts/UpgradeContext";
import { getRecoveryPending, RECOVERY_PENDING_EVENT } from "@/lib/recoveryMode";
import { LogOut, User, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  /** When on homepage, scroll to map instead of navigating */
  onExploreMap?: () => void;
}

export const Header = ({ onExploreMap }: HeaderProps) => {
  const { user, logout, isAdmin } = useAuth();
  const { openUpgrade } = useUpgrade();
  const navigate = useNavigate();
  const [recoveryPending, setRecoveryPending] = useState(() => getRecoveryPending());

  useEffect(() => {
    const handler = () => setRecoveryPending(getRecoveryPending());
    window.addEventListener(RECOVERY_PENDING_EVENT, handler);
    return () => window.removeEventListener(RECOVERY_PENDING_EVENT, handler);
  }, []);

  if (recoveryPending) {
    return (
      <header className="border-b border-[rgb(25,89,8)] bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <span className="font-title text-lg sm:text-xl font-semibold text-[rgb(25,89,8)]">
            Complete password reset
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-[rgb(25,89,8)] bg-white shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-3 gap-y-3">
          {/* Logo */}
          <div className="flex shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[rgb(25,89,8)] rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">M</span>
              </div>
              <span className="font-title text-lg sm:text-2xl md:text-3xl font-semibold text-[rgb(25,89,8)] whitespace-nowrap">
                MSRD
              </span>
            </Link>
          </div>

          {/* Desktop nav — lg+ avoids overlap with email at md widths (Safari / narrow windows) */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-3 xl:gap-6 min-w-0 px-1">
            {onExploreMap ? (
              <button
                type="button"
                onClick={onExploreMap}
                className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium text-sm xl:text-base whitespace-nowrap shrink-0"
              >
                Explore the map
              </button>
            ) : (
              <Link
                to="/#map-section"
                className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium text-sm xl:text-base whitespace-nowrap shrink-0"
              >
                Explore the map
              </Link>
            )}
            {user && user.plan !== "free" ? (
              <Link
                to="/search?q="
                className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium text-sm xl:text-base whitespace-nowrap shrink-0"
              >
                Search
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    navigate("/");
                  } else {
                    openUpgrade();
                  }
                }}
                className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium text-sm xl:text-base whitespace-nowrap shrink-0 cursor-pointer"
              >
                Search
              </button>
            )}
            {user && user.plan !== "free" ? (
              <Link
                to="/dashboard"
                className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium text-sm xl:text-base whitespace-nowrap shrink-0"
              >
                Bookmarks
              </Link>
            ) : user ? (
              <button
                type="button"
                onClick={openUpgrade}
                className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium text-sm xl:text-base whitespace-nowrap shrink-0 cursor-pointer"
              >
                Bookmarks
              </button>
            ) : null}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors flex items-center space-x-1 font-medium text-sm xl:text-base whitespace-nowrap shrink-0"
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Compact nav for &lt; lg */}
          <nav className="flex lg:hidden items-center justify-end gap-2 sm:gap-3 ml-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  navigate("/");
                } else if (user.plan === "free") {
                  openUpgrade();
                } else {
                  navigate("/search?q=");
                }
              }}
              className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors p-1.5"
            >
              <span className="sr-only">Search</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {user && user.plan !== "free" ? (
              <Link to="/dashboard" className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors p-1.5">
                <span className="sr-only">Bookmarks</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </Link>
            ) : user ? (
              <button type="button" onClick={openUpgrade} className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors p-1.5">
                <span className="sr-only">Bookmarks</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            ) : null}
            {isAdmin && (
              <Link to="/admin" className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors p-1.5">
                <span className="sr-only">Admin</span>
                <Shield className="w-5 h-5" />
              </Link>
            )}
          </nav>

          {/* User / login */}
          <div className="flex justify-end items-center gap-2 sm:gap-3 shrink-0 min-w-0 w-full sm:w-auto sm:ml-auto lg:ml-0 lg:w-auto">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-full">
                <Link
                  to="/account"
                  className="hidden lg:flex items-center gap-2 hover:bg-earth-sand/50 px-2 xl:px-3 py-2 rounded-lg transition-colors cursor-pointer min-w-0 max-w-[min(100%,14rem)] xl:max-w-[18rem]"
                >
                  <User className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{user.email}</span>
                </Link>

                <Link
                  to="/account"
                  className="lg:hidden flex items-center hover:bg-earth-sand/50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <User className="w-5 h-5 text-gray-500" />
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-xs sm:text-sm px-2 sm:px-3 border-earth-sand text-earth-text hover:bg-earth-sand/50 shrink-0"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/" className="shrink-0">
                <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3 bg-[rgb(25,89,8)] text-white hover:opacity-90 font-medium">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
