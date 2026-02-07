import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUpgrade } from "@/contexts/UpgradeContext";
import { LogOut, User, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { openUpgrade } = useUpgrade();
  const navigate = useNavigate();

  return (
    <header className="border-b border-[rgb(25,89,8)] bg-white shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-4 grid grid-cols-3 items-center gap-4 w-full max-w-full">
        {/* Left: logo */}
        <div className="flex justify-start min-w-0">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[rgb(25,89,8)] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm sm:text-lg">M</span>
            </div>
            <span className="font-title text-xl sm:text-2xl md:text-3xl font-semibold text-[rgb(25,89,8)]">
              MSRD
            </span>
          </Link>
        </div>

        {/* Center: Search, Bookmarks, Admin – true page center */}
        <nav className="hidden md:flex justify-center items-center space-x-6">
          {user && user.plan !== 'free' ? (
            <Link to="/search?q=" className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium">
              Search
            </Link>
          ) : (
            <button 
              onClick={() => {
                if (!user) {
                  window.location.href = '/login';
                } else {
                  openUpgrade();
                }
              }}
              className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium cursor-pointer"
            >
              Search
            </button>
          )}
          {user && user.plan !== 'free' ? (
            <Link to="/dashboard" className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium">
              Bookmarks
            </Link>
          ) : user ? (
            <button 
              onClick={openUpgrade}
              className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors font-medium cursor-pointer"
            >
              Bookmarks
            </button>
          ) : null}
          {isAdmin && (
            <Link to="/admin" className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors flex items-center space-x-1 font-medium">
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Mobile: center nav icons */}
        <nav className="md:hidden flex justify-center items-center space-x-4">
          <button 
            onClick={() => {
              if (!user) {
                window.location.href = '/login';
              } else if (user.plan === 'free') {
                openUpgrade();
              } else {
                navigate('/search?q=');
              }
            }}
            className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors p-1"
          >
            <span className="sr-only">Search</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {user && user.plan !== 'free' ? (
            <Link to="/dashboard" className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors p-1">
              <span className="sr-only">Bookmarks</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>
          ) : user ? (
            <button onClick={openUpgrade} className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors p-1">
              <span className="sr-only">Bookmarks</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          ) : null}
          {isAdmin && (
            <Link to="/admin" className="text-[rgb(25,89,8)] hover:opacity-80 transition-colors p-1">
              <span className="sr-only">Admin</span>
              <Shield className="w-4 h-4" />
            </Link>
          )}
        </nav>

        {/* Right: user / login – symmetrical with left */}
        <div className="flex justify-end items-center space-x-1 md:space-x-4 min-w-0">
          {user ? (
            <div className="flex items-center space-x-1 md:space-x-3">
              {/* Desktop: Full email display */}
              <Link 
                to="/account" 
                className="hidden md:flex items-center space-x-2 hover:bg-earth-sand/50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </Link>
              
              {/* Mobile: Just avatar */}
              <Link 
                to="/account" 
                className="md:hidden flex items-center hover:bg-earth-sand/50 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-gray-500" />
              </Link>
              
              <Button variant="outline" size="sm" onClick={logout} className="text-xs md:text-sm px-1 md:px-3">
                <LogOut className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="text-xs md:text-sm px-1 md:px-3">
                <span className="hidden md:inline">Login</span>
                <span className="md:hidden">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};