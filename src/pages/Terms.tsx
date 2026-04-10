import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const panelClass =
  'rounded-2xl bg-white border border-earth-sand shadow-sm p-6 md:p-8 lg:p-10';

export default function Terms() {
  return (
    <div className="min-h-screen page-gradient flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 md:py-12 flex-1 max-w-3xl">
        <div className={panelClass}>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Terms of Use</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Missick Sustainability Regulation Database LLC · Effective Date: February 11, 2026
          </p>

          <div className="space-y-6 text-foreground/90 text-sm">
            <p>
              Welcome to the website and platform operated by Missick Sustainability Regulation Database LLC ("Company," "we," "us," or "our").
            </p>
            <p>
              By accessing or using our website and subscription platform (the "Platform"), you agree to be bound by these Terms of Use.
            </p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                <strong className="text-foreground">Nature of the Platform</strong>
                <br />
                The Platform provides sustainability and regulatory intelligence tools, data aggregation, and informational resources. The Platform does not provide legal advice and does not guarantee compliance outcomes.
              </li>
              <li>
                <strong className="text-foreground">Account Registration</strong>
                <br />
                Users must provide accurate information, maintain account security, and not share credentials. We may suspend or terminate accounts at our discretion.
              </li>
              <li>
                <strong className="text-foreground">Intellectual Property</strong>
                <br />
                All databases, content, platform architecture, branding, and materials are the exclusive property of Missick Sustainability Regulation Database LLC. Users may not copy, reproduce, scrape, reverse engineer, resell, or redistribute any portion of the Platform.
              </li>
              <li>
                <strong className="text-foreground">Subscription &amp; Billing</strong>
                <br />
                Paid features require subscription. By subscribing, you authorize recurring billing. All fees are non-refundable unless otherwise stated.
              </li>
              <li>
                <strong className="text-foreground">Limitation of Liability</strong>
                <br />
                To the fullest extent permitted by Illinois law, the Company shall not be liable for indirect damages, loss of profits, business interruption, regulatory penalties, or compliance failures. Total liability shall not exceed the amount paid by the user in the preceding twelve (12) months.
              </li>
              <li>
                <strong className="text-foreground">Governing Law</strong>
                <br />
                These Terms are governed by the laws of the State of Illinois. Disputes shall be resolved in the appropriate courts serving Oswego, Illinois.
              </li>
            </ol>

            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">Subscription Auto-Renew Terms</h2>
            <div className="space-y-2">
              <p>Subscriptions automatically renew at the end of each billing cycle unless canceled prior to renewal.</p>
              <p>By subscribing, users authorize recurring charges to their payment method.</p>
              <p>Users may cancel at any time through their account dashboard.</p>
              <p>Cancellation prevents future charges but does not result in refunds for prior billing periods.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
