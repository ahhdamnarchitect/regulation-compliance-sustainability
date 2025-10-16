import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
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
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleRegulationClick = (regulation: any) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    navigate(`/regulation/${regulation.id}`);
  };

  return (
    <div className="min-h-screen bg-earth-background relative">
      <Header />
      
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
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-earth-primary brand-text">
            MISSICK
          </h1>
          <p className="text-xl md:text-2xl text-earth-text mb-8">
            Global Sustainability Regulation Intelligence
          </p>
        </div>

        {/* Interactive Map */}
        <div className="mb-8">
          <InteractiveMap
            regulations={regulations}
            onRegulationClick={handleRegulationClick}
          />
        </div>

        {/* Search Section */}
        <Card className="border-earth-sand shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-earth-text mb-2">
                Search Global Regulations
              </h2>
              <p className="text-earth-text/70">
                Find sustainability regulations by country, framework, or keyword
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search regulations, countries, frameworks..."
                    className="pl-10 h-12 text-lg border-earth-sand focus:border-earth-primary focus:ring-earth-primary transition-all duration-200 hover:shadow-md"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="h-12 px-8 bg-earth-primary hover:bg-earth-primary/90 text-white font-medium"
                >
                  Search
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <span className="px-3 py-1 bg-earth-sand text-earth-text rounded-full text-sm">CSRD</span>
                <span className="px-3 py-1 bg-earth-sand text-earth-text rounded-full text-sm">TCFD</span>
                <span className="px-3 py-1 bg-earth-sand text-earth-text rounded-full text-sm">ISSB</span>
                <span className="px-3 py-1 bg-earth-sand text-earth-text rounded-full text-sm">SEC Climate Rules</span>
                <span className="px-3 py-1 bg-earth-sand text-earth-text rounded-full text-sm">EU Taxonomy</span>
                <span className="px-3 py-1 bg-earth-sand text-earth-text rounded-full text-sm">SFDR</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}