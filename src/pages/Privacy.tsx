import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <h1 className="text-3xl font-bold text-earth-primary mb-2">Privacy Policy</h1>
        <p className="text-earth-text/80 text-sm mb-8">Missick Sustainability Regulation Database LLC · Effective Date: February 11, 2026</p>

        <div className="space-y-6 text-earth-text/90 text-sm">
          <p>
            Missick Sustainability Regulation Database LLC is committed to protecting personal data in accordance with applicable U.S. and Illinois laws.
          </p>
          <ol className="list-decimal list-inside space-y-3 ml-2">
            <li>
              <strong className="text-earth-text">Information Collected</strong>
              <br />
              We may collect name, email, IP address, company affiliation, billing information, subscription history, usage analytics, and device information.
            </li>
            <li>
              <strong className="text-earth-text">Use of Information</strong>
              <br />
              Information is processed to provide services, process payments, maintain security, improve the platform, and comply with legal obligations.
            </li>
            <li>
              <strong className="text-earth-text">Data Sharing</strong>
              <br />
              We may share data with payment processors, cloud hosting providers, analytics services, and legal authorities when required. We do not sell personal data.
            </li>
            <li>
              <strong className="text-earth-text">Data Retention</strong>
              <br />
              We retain personal data only as long as necessary for business and legal purposes.
            </li>
            <li>
              <strong className="text-earth-text">Security</strong>
              <br />
              We implement commercially reasonable safeguards. No system is completely secure.
            </li>
            <li>
              <strong className="text-earth-text">User Rights</strong>
              <br />
              Users may request access, correction, or deletion of personal data by contacting the Company.
            </li>
            <li>
              <strong className="text-earth-text">Governing Law</strong>
              <br />
              This Privacy Policy is governed by the laws of the State of Illinois.
            </li>
          </ol>
        </div>

        <p className="mt-8 text-earth-text/70 text-xs">
          <Link to="/terms" className="text-earth-primary hover:underline">Terms of Use</Link>
          {' · '}
          <Link to="/disclaimer" className="text-earth-primary hover:underline">Regulatory Disclaimer</Link>
          {' · '}
          <Link to="/about" className="text-earth-primary hover:underline">About</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
