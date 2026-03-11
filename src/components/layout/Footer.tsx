import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-150">
            Privacy Policy
          </Link>
          <span className="text-border">|</span>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-150">
            Terms of Use
          </Link>
          <span className="text-border">|</span>
          <Link to="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors duration-150">
            Regulatory Disclaimer
          </Link>
          <span className="text-border">|</span>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-150">
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
