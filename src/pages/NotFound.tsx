import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
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
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative text-center p-10 md:p-12 rounded-2xl border border-earth-sand bg-white/90 shadow-lg max-w-md w-full">
          <h1 className="font-title text-5xl md:text-6xl font-bold mb-4 text-earth-primary">404</h1>
          <p className="text-xl text-earth-text mb-6">Page not found</p>
          <p className="text-earth-text/70 text-sm mb-8">The page you’re looking for doesn’t exist or has been moved.</p>
          <a
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-earth-primary text-white font-medium hover:bg-earth-primary/90 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
