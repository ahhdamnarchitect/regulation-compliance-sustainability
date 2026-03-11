import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-2 sm:px-4 flex flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-primary">
          <Link to="/privacy" className="hover:text-neon-green-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-colors">
            Privacy Policy
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/terms" className="hover:text-neon-green-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-colors">
            Terms of Use
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/disclaimer" className="hover:text-neon-green-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-colors">
            Regulatory Disclaimer
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/about" className="hover:text-neon-green-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-colors">
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
