import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <div className="flex-1 container max-w-lg mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <CheckCircle className="w-16 h-16 text-primary mb-6" />
        <h1 className="text-3xl font-heading text-primary mb-2">You're all set</h1>
        <p className="text-foreground mb-8">
          Your 7-day free trial has started. You now have full access to MSRD Professional.
        </p>
        {sessionId && (
          <p className="text-sm text-foreground/70 mb-6">
            Session ID: <code className="bg-muted px-1 rounded">{sessionId.slice(0, 24)}…</code>
          </p>
        )}
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </div>
      <Footer />
    </div>
  );
}
