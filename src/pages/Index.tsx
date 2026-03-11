import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginOverlay } from '@/components/auth/LoginOverlay';
import InteractiveMap from '@/components/map/InteractiveMap';
import { Button } from '@/components/ui/button';
import { SearchInputWithSuggestions } from '@/components/search/SearchInputWithSuggestions';
import { useRegulations } from '@/hooks/useRegulations';
import { useAuth } from '@/contexts/AuthContext';
import { useUpgrade } from '@/contexts/UpgradeContext';
import { RevealSection } from '@/components/ui/RevealSection';
import { Search, MapPin, FileText, Sparkles, ArrowRight } from 'lucide-react';

export default function Index() {
  const { user, login, register, loading: authLoading } = useAuth();
  const { openUpgrade } = useUpgrade();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(!user);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { regulations, loading, error } = useRegulations();

  useEffect(() => {
    if (location.hash === '#pricing') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  useEffect(() => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, [user]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError('');
    try {
      await login(email, password);
      setShowLogin(false);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setLoginError('');
    try {
      await register(email, password, name, 'Global');
      setShowLogin(false);
      openUpgrade();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term?: string) => {
    const q = (term ?? searchQuery).trim();
    setSearchQuery(q);
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (user.plan === 'free') {
      openUpgrade();
      return;
    }
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const handleRegulationClick = (regulation: any) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (user.plan === 'free') {
      openUpgrade();
      return;
    }
    navigate(`/regulation/${regulation.id}`);
  };

  const handlePillSearch = (term: string) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (user.plan === 'free') {
      openUpgrade();
      return;
    }
    setSearchQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative mobile-full-width prevent-zoom">
      <Header />
      <div className="flex-1 flex flex-col">
        {showLogin && !authLoading && (
          <LoginOverlay
            onLogin={handleLogin}
            onRegister={handleRegister}
            error={loginError}
            loading={isLoading}
          />
        )}

        <div className="flex-1 max-w-full overflow-x-hidden">
          {/* Hero: one-line value prop */}
          <div className="relative w-full overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/10">
            <div
              className="absolute inset-0 bg-cover bg-no-repeat bg-center"
              style={{
                backgroundImage: 'url(/green-city-solar-panels-header.jpg)',
                backgroundPosition: '50% 30%',
              }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/40" />
            <div className="relative min-h-[200px] sm:min-h-[240px] md:min-h-[280px] flex flex-col items-center justify-center px-4 py-12 md:py-14">
              <h1
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-white tracking-tight drop-shadow-lg"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 24px rgba(0,0,0,0.3)' }}
              >
                MSRD
              </h1>
              <p
                className="font-heading text-lg sm:text-xl md:text-2xl text-white/95 font-medium text-center max-w-2xl"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
              >
                Sustainability regulation database — search, map, and track global frameworks
              </p>
            </div>
          </div>

          {/* Bento grid */}
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-auto">
              {/* Search — large left */}
              <RevealSection delay={0} variant="slide-up-short" className="md:col-span-2 md:row-span-1">
                <div className="h-full min-h-[200px] rounded-2xl border border-border bg-card shadow-card p-5 md:p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Search className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Search regulations</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    By country, framework, or keyword
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    <SearchInputWithSuggestions
                      value={searchQuery}
                      onChange={setSearchQuery}
                      onSearch={handleSearch}
                      placeholder="CSRD, TCFD, country..."
                      regulations={regulations}
                      suggestionsEnabled={false}
                      className="flex-1"
                      inputClassName="h-11 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <Button
                      onClick={() => handleSearch()}
                      className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shrink-0"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </RevealSection>

              {/* Map — large right */}
              <RevealSection delay={80} variant="slide-up-short" className="md:col-span-2 md:row-span-2">
                <div className="h-full min-h-[280px] md:min-h-[340px] rounded-2xl border border-border bg-card shadow-card overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 p-4 pb-0">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Global map</h2>
                      <p className="text-xs text-muted-foreground">Click a country to explore</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-[220px] p-4 pt-3">
                    <InteractiveMap
                      regulations={regulations}
                      onRegulationClick={handleRegulationClick}
                    />
                  </div>
                </div>
              </RevealSection>

              {/* Frameworks — medium */}
              <RevealSection delay={160} variant="slide-up-short" className="md:col-span-2">
                <div className="h-full min-h-[140px] rounded-2xl border border-border bg-card shadow-card p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Quick frameworks</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['CSRD', 'TCFD', 'ISSB', 'SEC Climate', 'EU Taxonomy', 'SFDR'].map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePillSearch(term)}
                        className="px-3 py-1.5 border border-border rounded-full text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-accent/50 transition-all duration-150 cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </RevealSection>

              {/* CTA — medium */}
              <RevealSection delay={240} variant="slide-up-short" className="md:col-span-2">
                <div className="h-full min-h-[140px] rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-card p-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">Unlock full access</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search, bookmark, and export regulations. Start free trial.
                  </p>
                  <Button
                    onClick={() => (user ? openUpgrade() : setShowLogin(true))}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl h-11 px-5 group"
                  >
                    {user ? 'Upgrade' : 'Get started'}
                    <ArrowRight className="w-4 h-4 ml-2 inline-block group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
