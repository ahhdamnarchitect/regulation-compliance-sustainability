import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto py-4 border-t border-[rgb(25,89,8)]">
      <div className="container mx-auto px-2 sm:px-4 flex justify-center gap-6 text-xs text-[rgb(25,89,8)]">
        <Link to="/about" className="hover:opacity-80 transition-colors">
          About
        </Link>
        <Link to="/legal" className="hover:opacity-80 transition-colors">
          Legal
        </Link>
      </div>
    </footer>
  );
};
