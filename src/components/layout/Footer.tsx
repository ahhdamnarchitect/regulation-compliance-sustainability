import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-earth-sand bg-white/80">
      <div className="container mx-auto px-2 sm:px-4 flex flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-earth-primary">
          <Link to="/contact" className="hover:opacity-80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-primary focus-visible:ring-offset-2 rounded transition-colors">
            Contact
          </Link>
          <span className="text-earth-text/50">|</span>
          <Link to="/privacy" className="hover:opacity-80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-primary focus-visible:ring-offset-2 rounded transition-colors">
            Privacy Policy
          </Link>
          <span className="text-earth-text/50">|</span>
          <Link to="/terms" className="hover:opacity-80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-primary focus-visible:ring-offset-2 rounded transition-colors">
            Terms of Use
          </Link>
          <span className="text-earth-text/50">|</span>
          <Link to="/disclaimer" className="hover:opacity-80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-primary focus-visible:ring-offset-2 rounded transition-colors">
            Regulatory Disclaimer
          </Link>
          <span className="text-earth-text/50">|</span>
          <Link to="/about" className="hover:opacity-80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-primary focus-visible:ring-offset-2 rounded transition-colors">
            About
          </Link>
        </div>
        <p className="text-xs text-earth-text/80">
          © 2026 Missick Sustainability Regulation Database LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
