import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <h1 className="text-3xl font-bold text-earth-primary mb-6">About MSRD</h1>

        <div className="space-y-6 text-earth-text/90 text-sm">
          <p>
            Missick Sustainability Regulation Database LLC (MSRD) is redefining how organizations engage with sustainability regulation.
          </p>
          <p>
            As environmental and ESG disclosure requirements expand across global markets, regulatory intelligence has become a strategic function rather than a reactive one. Companies are expected to monitor, interpret, and operationalize evolving frameworks across multiple jurisdictions, often with limited internal resources and fragmented tools.
          </p>
          <p>
            MSRD was created to provide structure where there is complexity.
          </p>
          <p>
            We deliver a centralized regulatory intelligence platform designed to help organizations:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Monitor sustainability regulatory developments</li>
            <li>Track evolving disclosure expectations</li>
            <li>Improve internal reporting readiness</li>
            <li>Reduce manual research burdens</li>
            <li>Strengthen compliance visibility</li>
          </ol>
          <p>
            Our platform focuses on clarity, accessibility, and usability. Regulatory intelligence should empower decision-making, not overwhelm it.
          </p>
          <p>
            MSRD is building the infrastructure layer for modern sustainability compliance.
          </p>

          <h2 className="text-xl font-semibold text-earth-primary mt-8 mb-2">Our Mission</h2>
          <p>
            To modernize how sustainability regulation is monitored, organized, and operationalized by making regulatory intelligence more accessible, structured, and actionable.
          </p>

          <h2 className="text-xl font-semibold text-earth-primary mt-8 mb-2">Our Vision</h2>
          <p>
            We envision a future where sustainability compliance is supported by intelligent, user-friendly infrastructure that enables organizations of all sizes to navigate regulatory complexity with confidence.
          </p>
          <p>
            As regulatory expectations continue to evolve, MSRD aims to become a trusted platform for structured sustainability intelligence.
          </p>

          <h2 className="text-xl font-semibold text-earth-primary mt-8 mb-2">Who We Serve</h2>
          <p>
            MSRD is built for:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Sustainability and ESG professionals</li>
            <li>Compliance teams</li>
            <li>Consultants and advisory firms</li>
            <li>Mid-sized enterprises</li>
            <li>Growing organizations expanding into regulated markets</li>
            <li>Companies preparing for disclosure frameworks such as climate reporting mandates and international ESG requirements</li>
          </ol>
          <p>
            Our platform is designed to support teams that need clarity without the cost or complexity of large enterprise-only systems.
          </p>

          <h2 className="text-xl font-semibold text-earth-primary mt-8 mb-2">Why We're Different</h2>
          <ol className="list-decimal list-inside space-y-3 ml-2">
            <li>
              <strong className="text-earth-text">Structured Intelligence</strong>
              <br />
              MSRD does not simply provide regulatory updates. We organize and structure information to make it usable.
            </li>
            <li>
              <strong className="text-earth-text">Accessibility</strong>
              <br />
              Many regulatory intelligence tools are designed for large multinational corporations. MSRD is designed to be accessible to growing teams and advisory professionals.
            </li>
            <li>
              <strong className="text-earth-text">Usability First</strong>
              <br />
              MSRD prioritizes clean design, searchable functionality, and intuitive navigation so regulatory tracking becomes operationally manageable.
            </li>
            <li>
              <strong className="text-earth-text">Forward-Looking Infrastructure</strong>
              <br />
              Sustainability regulation is accelerating. MSRD is built to scale alongside evolving frameworks and disclosure requirements.
            </li>
          </ol>

          <h2 className="text-xl font-semibold text-earth-primary mt-8 mb-2">Our Commitment</h2>
          <p>
            MSRD is committed to building a platform that supports responsible corporate transparency while maintaining clarity, integrity, and structured insight.
          </p>
          <p>
            Missick Sustainability Regulation Database LLC is headquartered in Oswego, Illinois and serves organizations navigating the evolving landscape of sustainability and ESG compliance.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
