import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { setRecoveryPending } from '@/lib/recoveryMode';
import { Lock, Eye, EyeOff, CheckCircle, X } from 'lucide-react';

export default function ResetPassword() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recoveryChecked, setRecoveryChecked] = useState(false);

  // Mark recovery pending as soon as we see type=recovery in the URL (from reset link)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setRecoveryPending(true);
    }
    const timer = setTimeout(() => setRecoveryChecked(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setRecoveryPending(false);
      setSuccess(true);
      setTimeout(() => navigate('/', { replace: true }), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showForm = user && recoveryChecked;
  const showInvalid = !authLoading && recoveryChecked && !user;

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white border-earth-sand">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-earth-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-earth-primary">
              {success ? 'Password updated' : showInvalid ? 'Invalid or expired link' : 'Set new password'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!recoveryChecked || authLoading ? (
              <p className="text-earth-text text-sm text-center">Loading...</p>
            ) : showInvalid ? (
              <>
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">
                    This link is invalid or has expired. Please request a new password reset link from the sign-in page.
                  </AlertDescription>
                </Alert>
                <Button
                  type="button"
                  className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white"
                  onClick={() => {
                    setRecoveryPending(false);
                    navigate('/', { replace: true });
                  }}
                >
                  Back to home
                </Button>
              </>
            ) : success ? (
              <>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your password has been updated. Redirecting you to the home page...
                  </AlertDescription>
                </Alert>
              </>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="new-password" className="text-earth-text font-medium">New password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-earth-text/60 hover:text-earth-text p-1 rounded"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="text-earth-text font-medium">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="border-earth-sand focus:border-earth-primary focus:ring-earth-primary pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-earth-text/60 hover:text-earth-text p-1 rounded"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update password'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-earth-sand text-earth-text"
                  disabled={submitting}
                  onClick={async () => {
                    setRecoveryPending(false);
                    await logout();
                    navigate('/', { replace: true });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </form>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
