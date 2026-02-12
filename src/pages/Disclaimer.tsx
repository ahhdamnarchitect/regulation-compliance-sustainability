import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <h1 className="text-3xl font-bold text-earth-primary mb-2">Regulatory Disclaimer</h1>
        <p className="text-earth-text/80 text-sm mb-8">Missick Sustainability Regulation Database LLC</p>

        <div className="space-y-4 text-earth-text/90 text-sm">
          <p>The information provided through this Platform is for informational purposes only.</p>
          <p>Missick Sustainability Regulation Database LLC does not provide legal, regulatory, or compliance advice.</p>
          <p>Users are solely responsible for evaluating and meeting their regulatory obligations.</p>
          <p>Use of this Platform does not guarantee compliance or regulatory outcomes.</p>
        </div>

        <p className="mt-8 text-earth-text/70 text-xs">
          <Link to="/terms" className="text-earth-primary hover:underline">Terms of Use</Link>
          {' · '}
          <Link to="/privacy" className="text-earth-primary hover:underline">Privacy Policy</Link>
          {' · '}
          <Link to="/about" className="text-earth-primary hover:underline">About</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
