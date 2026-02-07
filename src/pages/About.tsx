import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <h1 className="text-3xl font-bold text-earth-primary mb-6">About MSRD</h1>
        <Card className="border-earth-sand">
          <CardHeader>
            <CardTitle className="text-earth-text">Sustainability Regulation Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-earth-text/90 text-sm">
            <p>
              MSRD (Sustainability Regulation Database) is a platform designed to help organizations
              track and understand global sustainability regulations. This is placeholder content and will be
              replaced with full product description, mission, and team information.
            </p>
            <p>
              Our goal is to provide clear, accessible information on environmental, social, and governance
              (ESG) requirements across jurisdictions. More details will be added here.
            </p>
            <p>
              For questions or feedback, please use the contact information that will be provided in the
              final version of this page.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
