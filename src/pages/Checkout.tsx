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
const YEARLY_SAVINGS = MONTHLY_PER_YEAR - YEARLY_PRICE;

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

  const handleSubmit = () => {
    toast({
      title: 'Coming soon',
      description: 'Payment integration is in progress. You will be able to start your free trial here soon.',
      variant: 'default',
    });
  };

  const priceLabel = interval === 'monthly' ? `$${MONTHLY_PRICE}/month` : `$${YEARLY_PRICE}/year`;

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 text-earth-primary border-earth-sand hover:bg-earth-sand"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-heading text-earth-primary mb-2">Start your free trial</h1>
        <p className="text-earth-text mb-8">
          Get full access to MSRD Professional. No charge until your 7-day trial ends.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card
            className={`cursor-pointer transition-all border-2 ${interval === 'monthly' ? 'border-earth-primary bg-earth-primary/5' : 'border-earth-sand hover:border-earth-primary/50'}`}
            onClick={() => setInterval('monthly')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-earth-primary">Monthly</CardTitle>
              <p className="text-2xl font-bold text-earth-text">${MONTHLY_PRICE}<span className="text-base font-normal text-earth-text/80">/month</span></p>
              <p className="text-sm text-earth-text/80">Billed monthly. Cancel anytime.</p>
            </CardHeader>
          </Card>
          <Card
            className={`cursor-pointer transition-all border-2 relative ${interval === 'yearly' ? 'border-earth-primary bg-earth-primary/5' : 'border-earth-sand hover:border-earth-primary/50'}`}
            onClick={() => setInterval('yearly')}
          >
            <div className="absolute -top-2 right-4 bg-earth-primary text-white text-xs font-semibold px-2 py-0.5 rounded">
              Save ${YEARLY_SAVINGS}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-earth-primary">Yearly</CardTitle>
              <p className="text-2xl font-bold text-earth-text">${YEARLY_PRICE}<span className="text-base font-normal text-earth-text/80">/year</span></p>
              <p className="text-sm text-earth-text/80">${(YEARLY_PRICE / 12).toFixed(2)}/month. Billed annually.</p>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8 border-earth-sand">
          <CardHeader>
            <CardTitle className="text-earth-primary">Professional includes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {PROFESSIONAL_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-center text-earth-text">
                  <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 border-earth-sand">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm text-earth-text/90">
              <Shield className="w-5 h-5 text-earth-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-earth-text">Secure checkout</p>
                <p>Your payment information is encrypted and secure. We never store your full card details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-earth-text/90 mt-4">
              <Lock className="w-5 h-5 text-earth-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-earth-text">7-day free trial</p>
                <p>You will not be charged until the trial ends. Cancel anytime before then.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button
            className="flex-1 bg-earth-primary hover:bg-earth-primary/90 text-white text-lg py-6"
            onClick={handleSubmit}
          >
            Start 7-day free trial — {priceLabel}
          </Button>
          <p className="text-sm text-earth-text/70 text-center sm:text-left">
            Payment integration coming soon. Clicking the button will not charge your card.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
