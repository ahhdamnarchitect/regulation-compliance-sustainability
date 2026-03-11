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

  const priceLabel = interval === 'monthly' ? `$${MONTHLY_PRICE}/month` : `$${YEARLY_PRICE}/year`;

  return (
    <div className="min-h-screen page-gradient flex flex-col">
      <Header />
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 text-neon-cyan border-navy-600 hover:bg-navy-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-heading text-neon-cyan mb-2">Start your free trial</h1>
        <p className="text-slate-200 mb-8">
          Get full access to MSRD Professional. No charge until your 7-day trial ends.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card
            className={`cursor-pointer transition-all border-2 ${interval === 'monthly' ? 'border-neon-cyan bg-neon-cyan/10' : 'border-navy-600 hover:border-neon-cyan/50'}`}
            onClick={() => setInterval('monthly')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-neon-cyan">Monthly</CardTitle>
              <p className="text-2xl font-bold text-slate-200">${MONTHLY_PRICE}<span className="text-base font-normal text-slate-200/80">/month</span></p>
              <p className="text-sm text-slate-200/80">Billed monthly. Cancel anytime.</p>
            </CardHeader>
          </Card>
          <Card
            className={`cursor-pointer transition-all border-2 relative ${interval === 'yearly' ? 'border-neon-cyan bg-neon-cyan/10' : 'border-navy-600 hover:border-neon-cyan/50'}`}
            onClick={() => setInterval('yearly')}
          >
            <div className="absolute -top-2 right-4 bg-neon-cyan text-white text-xs font-semibold px-2 py-0.5 rounded">
              Save {YEARLY_SAVINGS_PERCENT}%
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-neon-cyan">Yearly</CardTitle>
              <p className="text-2xl font-bold text-slate-200">${YEARLY_PRICE}<span className="text-base font-normal text-slate-200/80">/year</span></p>
              <p className="text-sm text-slate-200/80">${(YEARLY_PRICE / 12).toFixed(2)}/month. Billed annually.</p>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8 border-navy-600">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Professional includes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {PROFESSIONAL_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-center text-slate-200">
                  <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 border-navy-600">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm text-slate-200/90">
              <Shield className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-200">Secure checkout</p>
                <p>Your payment information is encrypted and secure. We never store your full card details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-200/90 mt-4">
              <Lock className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-200">7-day free trial</p>
                <p>You will not be charged until the trial ends. Cancel anytime before then.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button
            className="flex-1 bg-neon-cyan hover:bg-neon-cyan/90 text-white text-lg py-6"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Redirecting to checkout…' : `Start 7-day free trial — ${priceLabel}`}
          </Button>
          <p className="text-sm text-slate-200/70 text-center sm:text-left">
            You will not be charged until after your 7-day trial. Cancel anytime.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
