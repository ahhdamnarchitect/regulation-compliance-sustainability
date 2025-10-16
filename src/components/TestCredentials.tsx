import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const TestCredentials = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const credentials = [
    {
      type: 'Admin',
      plan: 'Enterprise',
      email: 'admin@missick.com',
      password: 'admin123',
      features: ['Full access', 'Admin dashboard', 'All regions', 'Unlimited exports']
    },
    {
      type: 'Premium User',
      plan: 'Professional',
      email: 'premium@missick.com',
      password: 'premium123',
      features: ['All regions', 'Advanced filtering', 'Bookmarks', 'PDF/CSV exports', 'Email alerts']
    },
    {
      type: 'Free User (Europe)',
      plan: 'Free',
      email: 'free@missick.com',
      password: 'free123',
      features: ['Europe region only', 'Map view', 'Limited results', 'No exports']
    },
    {
      type: 'Free User (North America)',
      plan: 'Free',
      email: 'user@missick.com',
      password: 'user123',
      features: ['North America region only', 'Map view', 'Limited results', 'No exports']
    }
  ];

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="border-earth-sand shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-earth-primary">Test Credentials</CardTitle>
        <p className="text-earth-text/70 text-sm">
          Use these credentials to test different user types and subscription tiers
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {credentials.map((cred, index) => (
          <div key={index} className="border border-earth-sand rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-earth-text">{cred.type}</h3>
                <Badge className={`mt-1 ${
                  cred.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                  cred.plan === 'Professional' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {cred.plan}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-sm text-earth-text/60">Email</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-earth-background px-2 py-1 rounded text-sm">
                    {cred.email}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(cred.email, `email-${index}`)}
                    className="border-earth-sand"
                  >
                    {copied === `email-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-earth-text/60">Password</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-earth-background px-2 py-1 rounded text-sm">
                    {cred.password}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(cred.password, `password-${index}`)}
                    className="border-earth-sand"
                  >
                    {copied === `password-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-earth-text/60">Features</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {cred.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-earth-sand text-earth-text">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-earth-background rounded-lg">
          <p className="text-sm text-earth-text/70">
            <strong>Note:</strong> These are test credentials for development purposes. 
            In production, users would create their own accounts and select their region during registration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
