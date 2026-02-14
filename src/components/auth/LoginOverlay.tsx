import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { isValidEmail } from '@/lib/validation';
import { useAuth } from '@/contexts/AuthContext';

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
  const { resetPasswordForEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!isValidEmail(loginData.email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    onLogin(loginData.email, loginData.password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!isValidEmail(registerData.email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    onRegister(registerData.email, registerData.password, registerData.name);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!isValidEmail(forgotEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotLoading(true);
    try {
      await resetPasswordForEmail(forgotEmail);
      setForgotSuccess(true);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-earth-sand max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-earth-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <CardTitle className="text-2xl font-bold text-earth-primary brand-text">
            Welcome to MSRD
          </CardTitle>
          <p className="text-earth-text text-sm mt-2">
            Sustainability Regulation Database
          </p>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6 pb-6">
          {showForgotPassword ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-earth-primary">Reset password</h3>
              <p className="text-sm text-earth-text">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
              {forgotSuccess ? (
                <>
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      If an account exists for that email, we&apos;ve sent a link to reset your password. Check your inbox and spam folder.
                    </AlertDescription>
                  </Alert>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-earth-sand text-earth-primary"
                    onClick={() => { setShowForgotPassword(false); setForgotSuccess(false); setForgotEmail(''); }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Button>
                </>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="forgot-email" className="text-earth-text font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4" />
                      <Input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                        required
                      />
                    </div>
                  </div>
                  {forgotError && (
                    <Alert variant="destructive">
                      <AlertDescription>{forgotError}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? 'Sending...' : 'Send reset link'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-earth-text"
                    onClick={() => { setShowForgotPassword(false); setForgotError(null); }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Button>
                </form>
              )}
            </div>
          ) : (
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="register">Create Account</TabsTrigger>
              <TabsTrigger value="login">Sign In</TabsTrigger>
            </TabsList>
            
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
                
                {(validationError || error) && (
                  <Alert variant="destructive">
                    <AlertDescription>{validationError || error}</AlertDescription>
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
                
                {(validationError || error) && (
                  <Alert variant="destructive">
                    <AlertDescription>{validationError || error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <p className="text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-earth-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
