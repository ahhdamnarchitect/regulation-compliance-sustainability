import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="border-b border-earth-sand bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-earth-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-3xl font-bold text-earth-primary brand-text">
            MISSICK
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-earth-text hover:text-earth-primary transition-colors font-medium">
            Search
          </Link>
          {user && (
            <Link to="/dashboard" className="text-earth-text hover:text-earth-primary transition-colors font-medium">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-earth-text hover:text-earth-primary transition-colors flex items-center space-x-1 font-medium">
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center space-x-4">
          {user && (
            <Link to="/dashboard" className="text-earth-text hover:text-earth-primary transition-colors">
              <span className="sr-only">Dashboard</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
              </svg>
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-earth-text hover:text-earth-primary transition-colors">
              <span className="sr-only">Admin</span>
              <Shield className="w-6 h-6" />
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          {user ? (
            <div className="flex items-center space-x-2 md:space-x-3">
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
                className="md:hidden flex items-center hover:bg-earth-sand/50 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <User className="w-5 h-5 text-gray-500" />
              </Link>
              
              <Button variant="outline" size="sm" onClick={logout} className="text-xs md:text-sm">
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="text-xs md:text-sm">
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