import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-navy-700 bg-navy-900">
      <div className="container mx-auto px-2 sm:px-4 flex flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          <Link to="/privacy" className="text-slate-300 hover:text-neon-cyan transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-500">|</span>
          <Link to="/terms" className="text-slate-300 hover:text-neon-cyan transition-colors">
            Terms of Use
          </Link>
          <span className="text-slate-500">|</span>
          <Link to="/disclaimer" className="text-slate-300 hover:text-neon-cyan transition-colors">
            Regulatory Disclaimer
          </Link>
          <span className="text-slate-500">|</span>
          <Link to="/about" className="text-slate-300 hover:text-neon-cyan transition-colors">
            About
          </Link>
        </div>
        <p className="text-xs text-slate-400">
          © 2026 Missick Sustainability Regulation Database LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
