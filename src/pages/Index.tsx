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
import { MapPin, Search, Eye, GitBranch, FileText, Download } from 'lucide-react';

export default function Index() {
  const { user, login, register, loading: authLoading } = useAuth();
  const { openUpgrade } = useUpgrade();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(!user);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
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
          {/* Hero: video background with solid fallback (no old image flash), fade-in when ready */}
          <section className="relative w-full min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-earth-primary" aria-hidden />
            <video
              className={`hero-video-bg absolute inset-0 w-full h-full object-cover hero-bg-animate transition-opacity duration-500 ${heroVideoReady ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              disablePictureInPicture
              disableRemotePlayback
              onCanPlay={() => setHeroVideoReady(true)}
              onPlaying={() => setHeroVideoReady(true)}
            >
              <source src={`${import.meta.env.BASE_URL}Valleymist.mp4`} type="video/mp4" media="(max-width: 767px)" />
              <source src={`${import.meta.env.BASE_URL}ValleymistLo.mp4`} type="video/mp4" media="(min-width: 768px)" />
            </video>
            <div className="absolute inset-0 bg-earth-primary/30" aria-hidden />
            <RevealSection delay={0} variant="slide-up" className="relative z-10 text-center max-w-2xl mx-auto">
              <h1 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-4 md:mb-6 drop-shadow-lg">
                Search and Track Global Sustainability Regulations.
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 drop-shadow-sm">
                One place for CSRD, TCFD, ISSB and beyond.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                <Button
                  onClick={scrollToMap}
                  className="w-full sm:w-auto h-12 px-8 bg-white text-earth-primary hover:bg-white/90 font-medium rounded-lg transition-all shadow-lg border-0"
                >
                  <MapPin className="w-5 h-5 mr-2 inline-block" />
                  Explore the map
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSearch()}
                  className="w-full sm:w-auto h-12 px-6 border-2 border-white text-white bg-white/10 hover:bg-white/20 font-medium rounded-lg backdrop-blur-sm"
                >
                  <Search className="w-4 h-4 mr-2 inline-block" />
                  Search by topic
                </Button>
              </div>
            </RevealSection>
            <RevealSection delay={150} variant="fade" className="relative z-10 mt-8 md:mt-10 w-full">
              <div className="mx-auto flex flex-col items-center gap-3 md:gap-4">
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/70">
                  Built for teams in
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-[10px] md:text-xs">
                  {[
                    'ESG & sustainability',
                    'Regulatory affairs',
                    'Risk & compliance',
                    'Corporate reporting',
                    'Advisory & consulting',
                  ].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-white/80 backdrop-blur-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </RevealSection>
          </section>

          {/* Value props: Monitor, Track, Report, Export */}
          <section className="w-full py-14 md:py-20 bg-white/60 border-y border-earth-sand/60">
            <div className="max-w-5xl mx-auto px-4">
              <RevealSection delay={0} variant="slide-up" className="text-center mb-10 md:mb-12">
                <p className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-earth-primary/80 mb-2">
                  How it works
                </p>
                <h2 className="font-title text-2xl md:text-3xl font-semibold text-earth-text mb-3">
                  One platform for the full compliance workflow
                </h2>
                <p className="text-earth-text/80 text-sm md:text-base max-w-2xl mx-auto">
                  From discovery to export — search, map, bookmark, and share regulations in one place.
                </p>
              </RevealSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  { icon: Eye, label: 'Monitor', desc: 'Stay on top of global sustainability regulations and updates.' },
                  { icon: GitBranch, label: 'Track', desc: 'Filter by region, sector, and framework. Find what applies to you.' },
                  { icon: FileText, label: 'Report', desc: 'Access clear summaries, deadlines, and official sources.' },
                  { icon: Download, label: 'Export', desc: 'Export to PDF or CSV for reporting and internal use.' },
                ].map((item, i) => (
                  <RevealSection key={item.label} delay={80 * (i + 1)} variant="slide-up" className="group">
                    <div className="rounded-xl border border-earth-sand bg-white/90 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-earth-primary/30 h-full flex flex-col">
                      <div className="w-12 h-12 rounded-lg bg-earth-primary/10 text-earth-primary flex items-center justify-center mb-4 group-hover:bg-earth-primary/20 transition-colors">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-title text-lg font-semibold text-earth-text mb-2">{item.label}</h3>
                      <p className="text-earth-text/80 text-sm flex-1">{item.desc}</p>
                    </div>
                  </RevealSection>
                ))}
              </div>
            </div>
          </section>

          {/* Atmosphere video strip: landscape clip (hidden when prefers-reduced-motion) */}
          <section className="relative w-full h-[220px] md:h-[280px] overflow-hidden bg-earth-primary">
            <video
              className="absolute inset-0 w-full h-full object-cover hero-video-bg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
              disablePictureInPicture
              disableRemotePlayback
            >
              <source src={`${import.meta.env.BASE_URL}TurbineSunlight.mp4`} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-earth-primary/50" aria-hidden />
            <div className="relative z-10 h-full flex items-center justify-center px-4">
              <RevealSection delay={0} variant="fade" className="text-center">
                <p className="font-title text-xl md:text-2xl lg:text-3xl font-semibold text-white drop-shadow-lg">
                  One platform. Every framework.
                </p>
                <p className="text-white/90 text-sm md:text-base mt-2">
                  CSRD · TCFD · ISSB · SEC · EU Taxonomy · SFDR and more
                </p>
              </RevealSection>
            </div>
          </section>

          {/* Map: same gradient green as other pages */}
          <section
            id="map-section"
            className="relative w-full py-8 md:py-12 section-gradient"
          >
            <RevealSection delay={100} variant="slide-up" className="w-full">
              <div className="w-full px-2 sm:px-4 max-w-7xl mx-auto">
                <p className="text-center text-sm text-earth-text mb-4">
                  Click a region to explore regulations.
                </p>
                <div className="rounded-xl overflow-hidden min-h-[400px] md:min-h-[500px] bg-earth-sand border border-earth-sand shadow-lg">
                  <InteractiveMap
                    regulations={regulations}
                    onRegulationClick={handleRegulationClick}
                  />
                </div>
              </div>
            </RevealSection>
          </section>

          {/* Search by framework */}
          <section className="w-full py-12 md:py-16 bg-background">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <RevealSection delay={0} variant="slide-up">
                <h2 className="font-title text-xl md:text-2xl font-semibold text-earth-text mb-2">
                  Search by framework
                </h2>
                <p className="text-earth-text/80 text-sm md:text-base mb-6">
                  Jump to CSRD, TCFD, ISSB, and other major frameworks
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
                  {['CSRD', 'TCFD', 'ISSB', 'SEC Climate', 'EU Taxonomy', 'SFDR'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePillSearch(term)}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-earth-sand bg-white text-earth-text hover:bg-earth-sand/50 hover:text-earth-primary hover:border-earth-primary/50 transition-colors"
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
                    inputClassName="h-11 rounded-lg border-earth-sand bg-white text-earth-text placeholder:text-earth-text/60 focus:border-earth-primary focus:ring-earth-primary/50"
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

          {/* Pricing CTA — only for free or logged-out users */}
          {(!user || user?.plan === 'free') && (
            <section id="pricing" className="w-full py-12 md:py-16 bg-white/80 border-t border-earth-sand">
              <div className="max-w-2xl mx-auto px-4 text-center">
                <RevealSection delay={0} variant="fade">
                  <h2 className="font-title text-xl md:text-2xl font-semibold text-earth-text mb-2">
                    Unlock search & export
                  </h2>
                  <p className="text-earth-text/80 text-sm md:text-base mb-6">
                    Search, bookmark, and export regulations. Start with a free trial.
                  </p>
                  <Button
                    onClick={() => (user ? openUpgrade() : setShowLogin(true))}
                    className="h-12 px-8 bg-earth-primary hover:opacity-90 text-white font-medium rounded-lg shadow-lg"
                  >
                    {user ? 'Upgrade' : 'Start free trial'}
                  </Button>
                </RevealSection>
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
