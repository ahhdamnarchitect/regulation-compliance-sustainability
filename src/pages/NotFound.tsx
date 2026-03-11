import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col page-gradient">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 rounded-lg border border-navy-600 bg-navy-800 shadow-md animate-slide-in">
          <h1 className="text-5xl font-bold mb-6 text-neon-cyan">404</h1>
          <p className="text-xl text-slate-200 mb-6">Page not found</p>
          <a href="/" className="text-neon-cyan hover:text-neon-cyan/80 underline transition-colors">
            Return to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
