import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginOverlay } from '@/components/auth/LoginOverlay';
import InteractiveMap from '@/components/map/InteractiveMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRegulations } from '@/hooks/useRegulations';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MapPin, Globe, Filter } from 'lucide-react';

export default function Index() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(!user);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { regulations, loading, error } = useRegulations();

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
      setLoginError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, region: string) => {
    setIsLoading(true);
    setLoginError('');
    try {
      await register(email, password, name, region);
      setShowLogin(false);
    } catch (err) {
      setLoginError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    // Check if user is on free plan
    if (user.plan === 'free') {
      alert('Search functionality is only available in the Professional plan. Please upgrade to access advanced search features.');
      return;
    }
    
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleRegulationClick = (regulation: any) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    // Check if user is on free plan
    if (user.plan === 'free') {
      alert('Viewing regulation details is only available in the Professional plan. Please upgrade to access detailed regulation information.');
      return;
    }
    
    navigate(`/regulation/${regulation.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative mobile-full-width prevent-zoom">
      <Header />
      <div className="flex-1 flex flex-col">
      
      {/* Login Overlay */}
      {showLogin && (
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
        <div className="relative w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/MSRB.png)' }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative min-h-[200px] sm:min-h-[260px] md:min-h-[320px] flex flex-col items-center justify-center px-4 py-10 md:py-14">
            <h1
              className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-2 md:mb-3 text-white tracking-tight drop-shadow-lg"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 24px rgba(0,0,0,0.3)' }}
            >
              MSRB
            </h1>
            <p
              className="font-title text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-medium px-4 text-center max-w-2xl"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6), 0 0 16px rgba(0,0,0,0.25)' }}
            >
              Sustainability Regulation Database
            </p>
          </div>
        </div>

        <div className="container mx-auto px-2 sm:px-4 py-8">

        {/* Interactive Map - More contained like earthday.org */}
        <div className="mb-6 md:mb-8 max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-earth-text mb-2">
              Global Regulation Map
            </h2>
            <p className="text-sm md:text-base text-earth-text/70">
              Click on any country to explore sustainability regulations
            </p>
          </div>
          <InteractiveMap
            regulations={regulations}
            onRegulationClick={handleRegulationClick}
          />
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-earth-sand bg-white shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="text-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[rgb(25,89,8)] mb-2">
                  Search Global Regulations
                </h2>
                <p className="text-sm md:text-base text-earth-text/80 px-4">
                  Find sustainability regulations by country, framework, or keyword
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search regulations, countries, frameworks..."
                    className="pl-9 md:pl-10 h-10 md:h-12 text-base md:text-lg border-earth-sand focus:border-earth-primary focus:ring-earth-primary transition-all duration-200 hover:shadow-md"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="h-10 md:h-12 px-6 md:px-8 bg-[rgb(25,89,8)] hover:opacity-90 text-white font-medium text-sm md:text-base"
                >
                  Search
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-6">
                {['CSRD', 'TCFD', 'ISSB', 'SEC Climate', 'EU Taxonomy', 'SFDR'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      if (!user) {
                        setShowLogin(true);
                        return;
                      }
                      if (user.plan === 'free') {
                        alert('Search functionality is only available in the Professional plan. Please upgrade to access advanced search features.');
                        return;
                      }
                      setSearchQuery(term);
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="px-2 md:px-3 py-1 bg-earth-sand text-earth-text rounded-full text-xs md:text-sm hover:bg-[rgb(25,89,8)] hover:text-white transition-colors cursor-pointer"
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
      <Footer />
    </div>
  );
}