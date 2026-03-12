import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { isValidEmail } from '@/lib/validation';
import { 
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Crown,
  Eye,
  EyeOff,
  XCircle
} from 'lucide-react';
import { RevealSection } from '@/components/ui/RevealSection';

export default function AccountSettings() {
  const { user, session, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancellationScheduled, setCancellationScheduled] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.full_name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.full_name || '', email: user.email || '' });
    }
  }, [user?.id, user?.full_name, user?.email]);
  
  // Profile re-auth (confirm password to save profile)
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [showProfilePassword, setShowProfilePassword] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMessage(null);
    if (!isValidEmail(profileData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (!profileConfirmPassword.trim()) {
      setMessage({ type: 'error', text: 'Please enter your password to confirm changes.' });
      return;
    }
    setLoading(true);
    try {
      const { error: reAuthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: profileConfirmPassword,
      });
      if (reAuthError) {
        setMessage({ type: 'error', text: 'Incorrect password. Please try again.' });
        setLoading(false);
        return;
      }
      const emailChanged = profileData.email.trim() !== (user.email ?? '');
      if (emailChanged) {
        const { error: updateAuthError } = await supabase.auth.updateUser({ email: profileData.email.trim() });
        if (updateAuthError) {
          setMessage({ type: 'error', text: updateAuthError.message || 'Failed to update email. Please try again.' });
          setLoading(false);
          return;
        }
      }
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.name.trim(),
          email: profileData.email.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setProfileConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      setLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/checkout');
  };

  const handleLogout = () => {
    logout();
  };

  const handleCancelSubscription = async () => {
    if (!session?.access_token) {
      toast({ title: 'Session expired', description: 'Please sign in again.', variant: 'destructive' });
      return;
    }
    setCancelLoading(true);
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: 'Could not cancel',
          description: data.error ?? 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      setCancellationScheduled(true);
      toast({
        title: 'Cancellation scheduled',
        description: data.message ?? 'You will keep access until the end of your billing period.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'enterprise':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Enterprise</Badge>;
      case 'professional':
        return <Badge className="bg-earth-primary/15 text-earth-primary border-earth-primary/40">Professional</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Free</Badge>;
    }
  };

  return (
    <div className="min-h-screen page-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <RevealSection delay={0} variant="slide-up" className="mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              className="mr-4 text-earth-primary border-earth-sand hover:bg-earth-sand/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-title text-2xl md:text-3xl font-semibold text-earth-text">Account Settings</h1>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevealSection delay={50} variant="slide-up" className="lg:col-span-1">
          <Card className="bg-white/90 border-earth-sand">
              <CardHeader>
                <CardTitle className="flex items-center text-earth-text font-semibold">
                  <User className="w-5 h-5 mr-2" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground/60">Email</Label>
                  <p className="text-foreground">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground/60">Plan</Label>
                  <div className="flex items-center mt-1">
                    {getPlanBadge(user?.plan)}
                    {user?.plan === 'free' && (
                      <Button 
                        size="sm" 
                        className="ml-2 bg-earth-primary hover:bg-earth-primary/90 text-white"
                        onClick={handleUpgrade}
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
                {user?.plan !== 'free' && (
                  <div className="pt-3 border-t border-earth-sand">
                    <Label className="text-sm font-medium text-foreground/60">Subscription</Label>
                    {cancellationScheduled ? (
                      <p className="text-sm text-earth-text/80 mt-1">
                        Cancellation scheduled. You will keep access until the end of your billing period.
                      </p>
                    ) : (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-earth-text border-earth-sand hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                          onClick={handleCancelSubscription}
                          disabled={cancelLoading}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {cancelLoading ? 'Cancelling…' : 'Cancel subscription'}
                        </Button>
                        <p className="text-xs text-earth-text/70">
                          You will be downgraded to Free at the end of the current period.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className="pt-4 border-t border-earth-sand">
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </RevealSection>

          <RevealSection delay={100} variant="slide-up" className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-earth-sand/50 border border-earth-sand">
                <TabsTrigger value="profile" className="text-earth-text data-[state=active]:bg-earth-primary data-[state=active]:text-white">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="text-earth-text data-[state=active]:bg-earth-primary data-[state=active]:text-white">
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card className="bg-white/90 border-earth-sand">
                  <CardHeader>
                    <CardTitle className="flex items-center text-earth-text font-semibold">
                      <User className="w-5 h-5 mr-2" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-foreground font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary/50"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="profileConfirmPassword" className="text-foreground font-medium">
                          Confirm your password
                        </Label>
                        <div className="relative">
                          <Input
                            id="profileConfirmPassword"
                            type={showProfilePassword ? 'text' : 'password'}
                            value={profileConfirmPassword}
                            onChange={(e) => setProfileConfirmPassword(e.target.value)}
                            placeholder="Enter your password to save changes"
                            className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary/50 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowProfilePassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground p-1 rounded"
                            aria-label={showProfilePassword ? 'Hide password' : 'Show password'}
                          >
                            {showProfilePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card className="bg-white/90 border-earth-sand">
                  <CardHeader>
                    <CardTitle className="flex items-center text-earth-text font-semibold">
                      <Lock className="w-5 h-5 mr-2" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword" className="text-foreground font-medium">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary/50 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground p-1 rounded"
                            aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="newPassword" className="text-foreground font-medium">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary/50 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground p-1 rounded"
                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary/50 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground p-1 rounded"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white"
                        disabled={loading}
                      >
                        {loading ? 'Changing Password...' : 'Change Password'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </RevealSection>

            {/* Messages */}
            {message && (
              <Alert className={`mt-4 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
