import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface UpgradePopupProps {
  open: boolean;
  onClose: () => void;
}

const PROFESSIONAL_FEATURES = [
  'Unlimited regulation search',
  'Advanced filtering by region, sector & framework',
  'Unlimited bookmarks',
  'PDF & CSV export',
  'Full regulation detail pages & source links',
];

export const UpgradePopup: React.FC<UpgradePopupProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/checkout');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-earth-sand max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-earth-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <CardTitle className="text-2xl font-bold text-earth-primary brand-text">
            Upgrade to Professional
          </CardTitle>
          <p className="text-earth-text text-sm mt-2">
            You're on the Free plan. Unlock full access with a 7-day free trial.
          </p>
          <p className="text-earth-text font-semibold mt-2">
            $39.99/month or $399.99/year — save over $80 with annual billing.
          </p>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6 space-y-6">
          <div>
            <p className="text-earth-text font-medium mb-2">Professional includes:</p>
            <ul className="space-y-2">
              {PROFESSIONAL_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-earth-text">
                  <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-earth-text/80">
            Start your 7-day free trial. No charge until the trial ends.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-earth-primary hover:bg-earth-primary/90"
              onClick={handleUpgrade}
            >
              Upgrade to Professional
            </Button>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Continue with Free
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
