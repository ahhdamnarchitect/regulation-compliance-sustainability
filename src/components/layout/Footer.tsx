import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto py-4 border-t border-earth-sand/50">
      <div className="container mx-auto px-2 sm:px-4 flex justify-center gap-6 text-xs text-earth-text/70">
        <Link to="/about" className="hover:text-earth-primary transition-colors">
          About
        </Link>
        <Link to="/legal" className="hover:text-earth-primary transition-colors">
          Legal
        </Link>
      </div>
    </footer>
  );
};
