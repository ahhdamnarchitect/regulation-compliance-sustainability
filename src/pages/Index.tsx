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
import { MapPin, Search } from 'lucide-react';

export default function Index() {
  const { user, login, register, loading: authLoading } = useAuth();
  const { openUpgrade } = useUpgrade();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(!user);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { regulations } = useRegulations();

  useEffect(() => {
    if (location.hash === '#pricing') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#map-section') {
      document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  useEffect(() => {
    if (!user) setShowLogin(true);
    else setShowLogin(false);
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

  const handleRegulationClick = (regulation: { id: string }) => {
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

  const scrollToMap = () => {
    document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative mobile-full-width prevent-zoom">
      <Header onExploreMap={scrollToMap} />
      <div className="flex-1 flex flex-col">
        {showLogin && !authLoading && (
          <LoginOverlay
            onLogin={handleLogin}
            onRegister={handleRegister}
            error={loginError}
            loading={isLoading}
          />
        )}

        <main className="flex-1 max-w-full overflow-x-hidden">
          {/* Hero: one value line + one primary CTA + one secondary */}
          <section className="relative w-full min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 md:py-24 bg-gradient-to-b from-earth-background to-earth-sand/30">
            <RevealSection delay={0} variant="slide-up" className="text-center max-w-2xl mx-auto">
              <h1 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-earth-text tracking-tight mb-4 md:mb-6">
                Search and track global sustainability regulations.
              </h1>
              <p className="text-lg md:text-xl text-earth-text/80 mb-8 md:mb-10">
                One place for CSRD, TCFD, ISSB and beyond.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                <Button
                  onClick={scrollToMap}
                  className="w-full sm:w-auto h-12 px-8 bg-earth-primary hover:opacity-90 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <MapPin className="w-5 h-5 mr-2 inline-block" />
                  Explore the map
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSearch()}
                  className="w-full sm:w-auto h-12 px-6 border-earth-primary text-earth-primary hover:bg-earth-primary/10 font-medium rounded-lg"
                >
                  <Search className="w-4 h-4 mr-2 inline-block" />
                  Search by topic
                </Button>
              </div>
            </RevealSection>
          </section>

          {/* Map as main experience - full width, minimal chrome */}
          <section
            id="map-section"
            className="relative w-full bg-earth-sand/20 py-8 md:py-12"
          >
            <RevealSection delay={100} variant="slide-up" className="w-full">
              <div className="w-full px-2 sm:px-4 max-w-7xl mx-auto">
                <p className="text-center text-sm text-earth-text/70 mb-4">
                  Click a region to explore regulations
                </p>
                <div className="rounded-xl overflow-hidden border border-earth-sand shadow-lg bg-card min-h-[400px] md:min-h-[500px]">
                  <InteractiveMap
                    regulations={regulations}
                    onRegulationClick={handleRegulationClick}
                  />
                </div>
              </div>
            </RevealSection>
          </section>

          {/* Search by framework - pills only + optional search bar */}
          <section className="w-full py-12 md:py-16 bg-background">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <RevealSection delay={0} variant="slide-up">
                <h2 className="font-title text-xl md:text-2xl font-semibold text-earth-text mb-2">
                  Search by framework
                </h2>
                <p className="text-earth-text/70 text-sm md:text-base mb-6">
                  Jump to CSRD, TCFD, ISSB, and other major frameworks
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
                  {['CSRD', 'TCFD', 'ISSB', 'SEC Climate', 'EU Taxonomy', 'SFDR'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePillSearch(term)}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-earth-sand text-earth-text hover:bg-earth-primary hover:text-white hover:border-earth-primary transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                  <SearchInputWithSuggestions
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                    placeholder="Search regulations, countries..."
                    regulations={regulations}
                    suggestionsEnabled={false}
                    className="flex-1"
                    inputClassName="h-11 rounded-lg border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                  />
                  <Button
                    onClick={() => handleSearch()}
                    className="h-11 px-6 bg-earth-primary hover:opacity-90 text-white font-medium rounded-lg shrink-0"
                  >
                    Search
                  </Button>
                </div>
              </RevealSection>
            </div>
          </section>

          {/* Get full access - one CTA */}
          <section id="pricing" className="w-full py-12 md:py-16 bg-earth-sand/30">
            <div className="max-w-2xl mx-auto px-4 text-center">
              <RevealSection delay={0} variant="fade">
                <h2 className="font-title text-xl md:text-2xl font-semibold text-earth-text mb-2">
                  Unlock search & export
                </h2>
                <p className="text-earth-text/70 text-sm md:text-base mb-6">
                  Search, bookmark, and export regulations. Start with a free trial.
                </p>
                <Button
                  onClick={() => (user ? openUpgrade() : setShowLogin(true))}
                  className="h-12 px-8 bg-earth-primary hover:opacity-90 text-white font-medium rounded-lg shadow-md"
                >
                  {user ? 'Upgrade' : 'Start free trial'}
                </Button>
              </RevealSection>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
