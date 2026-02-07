import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Legal() {
  return (
    <div className="min-h-screen bg-earth-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <h1 className="text-3xl font-bold text-earth-primary mb-6">Legal</h1>
        <Card className="border-earth-sand">
          <CardHeader>
            <CardTitle className="text-earth-text">Terms of Use &amp; Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-earth-text/90 text-sm">
            <p>
              This page will contain the terms of use, privacy policy, and other legal information for
              the Missick Sustainability Regulation Database (MSRB). Placeholder content only.
            </p>
            <p>
              Final legal text will be added before launch. Do not rely on this placeholder for any
              legal or compliance purposes.
            </p>
            <p>
              Last updated: [Date to be added]. For questions, contact details will be provided in the
              final version.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
