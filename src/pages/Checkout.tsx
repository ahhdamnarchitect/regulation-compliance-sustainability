import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lock, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PROFESSIONAL_FEATURES = [
  'Unlimited regulation search',
  'Advanced filtering by region, sector & framework',
  'Unlimited bookmarks',
  'PDF & CSV export',
  'Full regulation detail pages & source links',
];

const MONTHLY_PRICE = 39.99;
const YEARLY_PRICE = 399.99;
const MONTHLY_PER_YEAR = MONTHLY_PRICE * 12;
const YEARLY_SAVINGS_PERCENT = Math.round(((MONTHLY_PER_YEAR - YEARLY_PRICE) / MONTHLY_PER_YEAR) * 100);

type BillingInterval = 'monthly' | 'yearly';

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interval, setInterval] = useState<BillingInterval>('yearly');

  if (!authLoading && !user) {
    navigate('/', { replace: true });
    return null;
  }

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interval,
          userId: user.id,
          userEmail: user.email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: 'Checkout error',
          description: data.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast({
        title: 'Checkout error',
        description: 'No checkout URL received.',
        variant: 'destructive',
      });
    } catch {
      toast({
        title: 'Checkout error',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const microcopy =
    interval === 'monthly'
      ? `7 days free, then $${MONTHLY_PRICE}/mo`
      : `7 days free, then $${YEARLY_PRICE}/yr`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-primary hover:text-primary/90 hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">Start your free trial</h1>
        <p className="text-muted-foreground mb-8">
          Get full access to MSRD Professional. No charge until your 7-day trial ends.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card
            className={`cursor-pointer transition-all duration-200 border-2 rounded-xl ${interval === 'monthly' ? 'border-primary bg-accent/30' : 'border-border hover:border-primary/50'}`}
            onClick={() => setInterval('monthly')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">Monthly</CardTitle>
              <p className="text-2xl font-bold text-foreground">
                ${MONTHLY_PRICE}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground">Billed monthly. Cancel anytime.</p>
            </CardHeader>
          </Card>
          <Card
            className={`cursor-pointer transition-all duration-200 border-2 rounded-xl relative ${interval === 'yearly' ? 'border-primary bg-accent/30' : 'border-border hover:border-primary/50'}`}
            onClick={() => setInterval('yearly')}
          >
            <div className="absolute -top-2 right-4 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded">
              Save {YEARLY_SAVINGS_PERCENT}%
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">Yearly</CardTitle>
              <p className="text-2xl font-bold text-foreground">
                ${YEARLY_PRICE}
                <span className="text-base font-normal text-muted-foreground">/year</span>
              </p>
              <p className="text-sm text-muted-foreground">
                ${(YEARLY_PRICE / 12).toFixed(2)}/month. Billed annually.
              </p>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8 border border-border rounded-xl shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Professional includes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {PROFESSIONAL_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-center text-foreground">
                  <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 border border-border rounded-xl shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Secure checkout</p>
                <p>Your payment information is encrypted and secure. We never store your full card details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground mt-4">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">7-day free trial</p>
                <p>You will not be charged until the trial ends. Cancel anytime before then.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="hidden sm:block">
          <Button
            className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-xl transition-all duration-150 active:scale-[0.98]"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Redirecting…' : 'Start free trial'}
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            {microcopy}. Cancel anytime. No charge today.
          </p>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 py-3 px-4 safe-area-pb">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-medium"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Redirecting…' : 'Start free trial'}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-1.5">{microcopy}</p>
      </div>

      <Footer />
    </div>
  );
}
