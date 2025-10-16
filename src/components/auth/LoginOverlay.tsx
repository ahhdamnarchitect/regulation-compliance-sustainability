import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface LoginOverlayProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
  error?: string;
  loading?: boolean;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({ 
  onLogin, 
  onRegister, 
  error, 
  loading = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginData.email, loginData.password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(registerData.email, registerData.password, registerData.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 bg-white shadow-2xl border-earth-sand">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-earth-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <CardTitle className="text-2xl font-bold text-earth-primary brand-text">
            Welcome to MISSICK
          </CardTitle>
          <p className="text-earth-text text-sm mt-2">
            Global Sustainability Regulation Intelligence
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-earth-text font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      className="pl-10 border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="login-password" className="text-earth-text font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 hover:text-earth-text"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="text-earth-text font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4" />
                    <Input
                      id="register-name"
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="pl-10 border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="register-email" className="text-earth-text font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4" />
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      className="pl-10 border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="register-password" className="text-earth-text font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4" />
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      className="pl-10 pr-10 border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 hover:text-earth-text"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 p-4 bg-earth-background rounded-lg text-sm text-earth-text">
            <p className="font-medium mb-2">Free Plan - "Explore"</p>
            <p className="text-xs">
              Access to 1 region • Map view only • Limited results • No exports
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
