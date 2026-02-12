import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <h1 className="text-3xl font-bold text-earth-primary mb-2">Terms of Use</h1>
        <p className="text-earth-text/80 text-sm mb-8">Missick Sustainability Regulation Database LLC · Effective Date: February 11, 2026</p>

        <div className="space-y-6 text-earth-text/90 text-sm">
          <p>
            Welcome to the website and platform operated by Missick Sustainability Regulation Database LLC ("Company," "we," "us," or "our").
          </p>
          <p>
            By accessing or using our website and subscription platform (the "Platform"), you agree to be bound by these Terms of Use.
          </p>
          <ol className="list-decimal list-inside space-y-3 ml-2">
            <li>
              <strong className="text-earth-text">Nature of the Platform</strong>
              <br />
              The Platform provides sustainability and regulatory intelligence tools, data aggregation, and informational resources. The Platform does not provide legal advice and does not guarantee compliance outcomes.
            </li>
            <li>
              <strong className="text-earth-text">Account Registration</strong>
              <br />
              Users must provide accurate information, maintain account security, and not share credentials. We may suspend or terminate accounts at our discretion.
            </li>
            <li>
              <strong className="text-earth-text">Intellectual Property</strong>
              <br />
              All databases, content, platform architecture, branding, and materials are the exclusive property of Missick Sustainability Regulation Database LLC. Users may not copy, reproduce, scrape, reverse engineer, resell, or redistribute any portion of the Platform.
            </li>
            <li>
              <strong className="text-earth-text">Subscription &amp; Billing</strong>
              <br />
              Paid features require subscription. By subscribing, you authorize recurring billing. All fees are non-refundable unless otherwise stated.
            </li>
            <li>
              <strong className="text-earth-text">Limitation of Liability</strong>
              <br />
              To the fullest extent permitted by Illinois law, the Company shall not be liable for indirect damages, loss of profits, business interruption, regulatory penalties, or compliance failures. Total liability shall not exceed the amount paid by the user in the preceding twelve (12) months.
            </li>
            <li>
              <strong className="text-earth-text">Governing Law</strong>
              <br />
              These Terms are governed by the laws of the State of Illinois. Disputes shall be resolved in the appropriate courts serving Oswego, Illinois.
            </li>
          </ol>

          <h2 className="text-xl font-semibold text-earth-primary mt-8 mb-4">Subscription Auto-Renew Terms</h2>
          <div className="space-y-2">
            <p>Subscriptions automatically renew at the end of each billing cycle unless canceled prior to renewal.</p>
            <p>By subscribing, users authorize recurring charges to their payment method.</p>
            <p>Users may cancel at any time through their account dashboard.</p>
            <p>Cancellation prevents future charges but does not result in refunds for prior billing periods.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
