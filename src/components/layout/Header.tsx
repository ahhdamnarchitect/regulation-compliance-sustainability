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

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link 
                to="/account" 
                className="flex items-center space-x-2 hover:bg-earth-sand/50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};