import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevealSection } from '@/components/ui/RevealSection';
import { useAuth } from '@/contexts/AuthContext';
import { useUpgrade } from '@/contexts/UpgradeContext';
import {
  ArrowRight,
  Check,
  LineChart,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

const MONTHLY = 39.99;
const YEARLY = 399.99;
const YEARLY_SAVE = Math.round(100 - (YEARLY / (MONTHLY * 12)) * 100);

export default function Pricing() {
  const { user, loading } = useAuth();
  const { openUpgrade } = useUpgrade();
  const navigate = useNavigate();
  const plan = user?.plan ?? 'free';

  const goCheckout = () => {
    if (!user) {
      navigate('/');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col page-gradient">
      <Header />
      <main className="flex-1">
        {/* Hero — clear outcome + specificity */}
        <section className="relative w-full border-b border-earth-sand/60 bg-white/80">
          <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl text-center">
            <RevealSection delay={0} variant="slide-up">
              <p className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-earth-primary/80 mb-3">
                Simple pricing
              </p>
              <h1 className="font-title text-3xl md:text-4xl font-semibold text-earth-text mb-4">
                Pay for clarity—not chaos.
              </h1>
              <p className="text-earth-text/80 text-base md:text-lg max-w-2xl mx-auto">
                Start free on the map, then unlock search, filters, bookmarks, and export when you&apos;re ready to move
                faster than spreadsheets and scattered PDFs.
              </p>
            </RevealSection>
          </div>
        </section>

        {/* Plans */}
        <section className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
            {/* Free */}
            <RevealSection delay={60} variant="slide-up" className="h-full">
              <Card className="h-full border-earth-sand bg-white/95 shadow-sm flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="font-title text-xl">Free</CardTitle>
                    {plan === 'free' && user ? (
                      <Badge variant="secondary" className="text-xs">
                        Current plan
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-3xl font-semibold text-earth-text mt-2">
                    $0<span className="text-base font-normal text-earth-text/70">/mo</span>
                  </p>
                  <p className="text-sm text-earth-text/80 mt-2">
                    Explore coverage visually and validate MSRD is a fit before you upgrade.
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 text-sm text-earth-text/90 flex-1">
                    <li className="flex gap-2">
                      <MapPin className="w-4 h-4 text-earth-primary shrink-0 mt-0.5" />
                      Interactive global regulation map & pins
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-earth-primary shrink-0 mt-0.5" />
                      Regulation summaries from map popups
                    </li>
                    <li className="flex gap-2">
                      <Users className="w-4 h-4 text-earth-primary shrink-0 mt-0.5" />
                      Create an account to save progress
                    </li>
                  </ul>
                  <p className="text-xs text-earth-text/60 mt-6 mb-3">
                    Search, advanced filters, bookmarks, and export require Professional.
                  </p>
                  {!user && !loading ? (
                    <Button asChild variant="outline" className="w-full border-earth-sand mt-auto">
                      <Link to="/">Create free account</Link>
                    </Button>
                  ) : plan === 'free' ? (
                    <Button
                      className="w-full bg-earth-primary hover:opacity-90 text-white mt-auto"
                      onClick={() => openUpgrade()}
                    >
                      Upgrade to Professional
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <p className="text-sm text-earth-text/70 mt-auto text-center">You have a paid plan.</p>
                  )}
                </CardContent>
              </Card>
            </RevealSection>

            {/* Professional — anchor */}
            <RevealSection delay={100} variant="slide-up" className="h-full">
              <Card className="h-full border-earth-primary/50 bg-white shadow-lg ring-2 ring-earth-primary/20 flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-earth-primary text-white px-3 py-1 text-xs font-medium shadow-sm">
                    Most teams start here
                  </Badge>
                </div>
                <CardHeader className="pt-6">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="font-title text-xl">Professional</CardTitle>
                    {plan === 'professional' ? (
                      <Badge variant="secondary" className="text-xs">
                        Current plan
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-3xl font-semibold text-earth-text mt-2">
                    ${MONTHLY}
                    <span className="text-base font-normal text-earth-text/70">/mo</span>
                  </p>
                  <p className="text-sm text-earth-text/70">
                    or <span className="font-medium text-earth-text">${YEARLY}/yr</span>
                    <span className="text-green-700 font-medium"> · save ~{YEARLY_SAVE}%</span>
                  </p>
                  <p className="text-sm text-earth-text/80 mt-2">
                    Full research workflow: find, filter, save, and export—built for compliance and sustainability teams.
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 text-sm text-earth-text/90 flex-1">
                    <li className="flex gap-2">
                      <Search className="w-4 h-4 text-earth-primary shrink-0 mt-0.5" />
                      Unlimited regulation search
                    </li>
                    <li className="flex gap-2">
                      <LineChart className="w-4 h-4 text-earth-primary shrink-0 mt-0.5" />
                      Advanced filters (region, sector, framework, status)
                    </li>
                    <li className="flex gap-2">
                      <Sparkles className="w-4 h-4 text-earth-primary shrink-0 mt-0.5" />
                      Unlimited bookmarks &amp; synced profile
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-earth-primary shrink-0 mt-0.5" />
                      PDF &amp; CSV export
                    </li>
                    <li className="flex gap-2">
                      <Shield className="w-4 h-4 text-earth-primary shrink-0 mt-0.5" />
                      Full detail pages &amp; official source links
                    </li>
                  </ul>
                  {plan === 'free' && user ? (
                    <Button
                      className="w-full bg-earth-primary hover:opacity-90 text-white mt-6"
                      onClick={() => goCheckout()}
                    >
                      Start checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : !user && !loading ? (
                    <Button asChild className="w-full bg-earth-primary hover:opacity-90 text-white mt-6">
                      <Link to="/">Sign in to upgrade</Link>
                    </Button>
                  ) : plan === 'professional' ? (
                    <Button asChild variant="outline" className="w-full mt-6 border-earth-sand">
                      <Link to="/account">Manage subscription</Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-earth-primary hover:opacity-90 text-white mt-6" onClick={() => goCheckout()}>
                      Upgrade to Professional
                    </Button>
                  )}
                  <p className="text-xs text-center text-earth-text/60 mt-3">7-day trial available at checkout where offered.</p>
                </CardContent>
              </Card>
            </RevealSection>

          </div>
        </section>

        {/* Trust + objection handling */}
        <section className="border-t border-earth-sand/60 bg-white/60">
          <div className="container mx-auto px-4 py-12 md:py-14 max-w-4xl">
            <RevealSection delay={0} variant="fade" className="text-center mb-10">
              <h2 className="font-title text-xl md:text-2xl font-semibold text-earth-text mb-2">
                Why teams upgrade
              </h2>
              <p className="text-earth-text/80 text-sm md:text-base">
                When deadlines hit, you need one place to answer: <em>what applies</em>, <em>where</em>, and <em>what changed</em>—without losing hours to search tabs.
              </p>
            </RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-earth-text/85">
              <RevealSection delay={80} variant="slide-up" className="rounded-xl border border-earth-sand bg-white/90 p-5">
                <p className="font-semibold text-earth-text mb-2">Clarity beats volume</p>
                <p>Structured filters beat keyword roulette—especially across CSRD, ISSB, SEC climate, and regional rules.</p>
              </RevealSection>
              <RevealSection delay={120} variant="slide-up" className="rounded-xl border border-earth-sand bg-white/90 p-5">
                <p className="font-semibold text-earth-text mb-2">Built for workflow</p>
                <p>Bookmarks and exports exist because your work doesn&apos;t end at “found it.”</p>
              </RevealSection>
              <RevealSection delay={160} variant="slide-up" className="rounded-xl border border-earth-sand bg-white/90 p-5">
                <p className="font-semibold text-earth-text mb-2">Room to grow</p>
                <p>Start free, prove value, and scale to Professional when your team needs search, bookmarks, and export at speed.</p>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* Sticky CTA for free tier */}
        {user?.plan === 'free' && (
          <section className="sticky bottom-0 z-20 border-t border-earth-sand bg-earth-primary/95 text-white backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-center sm:text-left">
                <span className="font-semibold">Ready to search without limits?</span> Start Professional with secure checkout.
              </p>
              <Button
                variant="secondary"
                className="bg-white text-earth-primary hover:bg-white/90 shrink-0"
                onClick={() => goCheckout()}
              >
                Go to checkout
              </Button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
