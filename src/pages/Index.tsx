import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginOverlay } from '@/components/auth/LoginOverlay';
import InteractiveMap from '@/components/map/InteractiveMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInputWithSuggestions } from '@/components/search/SearchInputWithSuggestions';
import { useRegulations } from '@/hooks/useRegulations';
import { useAuth } from '@/contexts/AuthContext';
import { useUpgrade } from '@/contexts/UpgradeContext';

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

  // Show login overlay when user logs out
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

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative mobile-full-width prevent-zoom">
      <Header />
      <div className="flex-1 flex flex-col">
      
      {/* Login Overlay - hide while checking session to avoid flash */}
      {showLogin && !authLoading && (
        <LoginOverlay
          onLogin={handleLogin}
          onRegister={handleRegister}
          error={loginError}
          loading={isLoading}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-full overflow-x-hidden">
        {/* Hero Section - full-width background image with floating text */}
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
          <div className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[360px] lg:min-h-[400px] flex flex-col items-center justify-center px-4 py-10 md:py-16">
            <h1
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 text-white tracking-tight drop-shadow-lg"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 24px rgba(0,0,0,0.3)' }}
            >
              MSRD
            </h1>
            <p
              className="font-heading text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-medium px-4 text-center max-w-2xl"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6), 0 0 16px rgba(0,0,0,0.25)' }}
            >
              Sustainability Regulation Database
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Interactive Map */}
        <div className="mb-8 md:mb-10">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              Global Regulation Map
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Click any country to explore regulations
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <InteractiveMap
              regulations={regulations}
              onRegulationClick={handleRegulationClick}
            />
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto">
          <Card className="border border-border bg-card rounded-xl shadow-card">
            <CardContent className="p-5 md:p-6">
              <div className="text-center mb-5 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Search Global Regulations
                </h2>
                <p className="text-sm md:text-base text-muted-foreground px-4">
                  Find sustainability regulations by country, framework, or keyword
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <SearchInputWithSuggestions
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                    placeholder="Search regulations, countries, frameworks..."
                    regulations={regulations}
                    suggestionsEnabled={false}
                    className="flex-1"
                    inputClassName="h-11 md:h-12 text-base border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <Button
                    onClick={() => handleSearch()}
                    className="h-11 md:h-12 px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-lg transition-all duration-150 active:scale-[0.98]"
                  >
                    Search
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-5">
                  {['CSRD', 'TCFD', 'ISSB', 'SEC Climate', 'EU Taxonomy', 'SFDR'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        if (!user) { setShowLogin(true); return; }
                        if (user.plan === 'free') { openUpgrade(); return; }
                        setSearchQuery(term);
                        navigate(`/search?q=${encodeURIComponent(term)}`);
                      }}
                      className="px-3 py-1.5 border border-border rounded-full text-xs md:text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-accent/50 transition-colors duration-150 cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}