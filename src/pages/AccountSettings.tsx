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
import { supabase } from '@/lib/supabase';
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
  Globe
} from 'lucide-react';

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    region: user?.region || ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.full_name || '', email: user.email || '', region: user.region || '' });
    }
  }, [user?.id, user?.full_name, user?.email, user?.region]);
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profileData.name, region: profileData.region || null, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
    // Placeholder for payment integration
    setMessage({ type: 'success', text: 'Payment integration coming soon! For now, contact support to upgrade.' });
  };

  const handleLogout = () => {
    logout();
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'enterprise':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Enterprise</Badge>;
      case 'professional':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Professional</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Free</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="mr-4 text-earth-primary border-earth-sand hover:bg-earth-sand"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-heading text-earth-primary">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-earth-sand">
              <CardHeader>
                <CardTitle className="flex items-center text-earth-primary">
                  <User className="w-5 h-5 mr-2" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-earth-text/70">Email</Label>
                  <p className="text-earth-text">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-earth-text/70">Plan</Label>
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
                {user?.region && (
                  <div>
                    <Label className="text-sm font-medium text-earth-text/70">Region</Label>
                    <p className="text-earth-text flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {user.region}
                    </p>
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
          </div>

          {/* Settings Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-earth-sand/50">
                <TabsTrigger value="profile" className="text-earth-text data-[state=active]:bg-earth-primary data-[state=active]:text-white">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="text-earth-text data-[state=active]:bg-earth-primary data-[state=active]:text-white">
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card className="bg-white border-earth-sand">
                  <CardHeader>
                    <CardTitle className="flex items-center text-earth-primary">
                      <User className="w-5 h-5 mr-2" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-earth-text font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-earth-text font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="region" className="text-earth-text font-medium">
                          Region
                        </Label>
                        <Input
                          id="region"
                          type="text"
                          value={profileData.region}
                          onChange={(e) => setProfileData(prev => ({ ...prev, region: e.target.value }))}
                          className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                          placeholder="Your region"
                        />
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
                <Card className="bg-white border-earth-sand">
                  <CardHeader>
                    <CardTitle className="flex items-center text-earth-primary">
                      <Lock className="w-5 h-5 mr-2" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword" className="text-earth-text font-medium">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="newPassword" className="text-earth-text font-medium">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword" className="text-earth-text font-medium">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
                          required
                        />
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
      </div>
      <Footer />
    </div>
  );
}
