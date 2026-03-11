import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border bg-card">
      <div className="container mx-auto px-2 sm:px-4 flex flex-col items-center gap-3 text-center">
        <p className="text-xs text-muted-foreground">
          Secure access • Structured data • Built for compliance teams
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <span className="text-muted-foreground/60">|</span>
          <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
            Terms of Use
          </Link>
          <span className="text-muted-foreground/60">|</span>
          <Link to="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">
            Regulatory Disclaimer
          </Link>
          <span className="text-muted-foreground/60">|</span>
          <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 Missick Sustainability Regulation Database LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
