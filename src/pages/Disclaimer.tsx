import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const panelClass =
  'rounded-2xl bg-white border border-earth-sand shadow-sm p-6 md:p-8 lg:p-10';

export default function Disclaimer() {
  return (
    <div className="min-h-screen page-gradient flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-12 flex-1 max-w-3xl">
        <div className={panelClass}>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Regulatory Disclaimer</h1>
          <p className="text-muted-foreground text-sm mb-8">Missick Sustainability Regulation Database LLC</p>

          <div className="space-y-4 text-foreground/90 text-sm">
            <p>The information provided through this Platform is for informational purposes only.</p>
            <p>Missick Sustainability Regulation Database LLC does not provide legal, regulatory, or compliance advice.</p>
            <p>Users are solely responsible for evaluating and meeting their regulatory obligations.</p>
            <p>Use of this Platform does not guarantee compliance or regulatory outcomes.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
