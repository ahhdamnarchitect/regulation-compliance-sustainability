import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRegulations } from '@/hooks/useRegulations';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Building, 
  Tag, 
  Bookmark,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function RegulationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { regulations } = useRegulations();
  const [regulation, setRegulation] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id && regulations.length > 0) {
      const found = regulations.find(r => r.id === id);
      setRegulation(found);
    }
  }, [id, regulations]);

  useEffect(() => {
    if (user && regulation) {
      const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');
      setIsBookmarked(bookmarks.includes(regulation.id));
    }
  }, [user, regulation]);

  const handleBookmark = () => {
    if (!user || !regulation) return;

    const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');
    const updatedBookmarks = isBookmarked
      ? bookmarks.filter((b: string) => b !== regulation.id)
      : [...bookmarks, regulation.id];
    
    localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'proposed': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'repealed': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'repealed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (!regulation) {
    return (
      <div className="min-h-screen bg-earth-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-primary mx-auto"></div>
            <p className="text-earth-text mt-4">Loading regulation details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-earth-primary hover:text-earth-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-earth-sand shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-earth-text mb-4">
                      {regulation.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={`${getStatusColor(regulation.status)} flex items-center gap-2`}>
                        {getStatusIcon(regulation.status)}
                        {regulation.status}
                      </Badge>
                      <Badge variant="outline" className="border-earth-primary text-earth-primary">
                        {regulation.framework}
                      </Badge>
                    </div>
                  </div>
                  
                  {user && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className={`${isBookmarked ? 'text-yellow-600 border-yellow-300' : 'text-earth-text border-earth-sand'} hover:text-yellow-600`}
                    >
                      <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-earth-text mb-3">Description</h3>
                  <p className="text-earth-text/80 leading-relaxed">
                    {regulation.summary || regulation.description || 'No description available for this regulation.'}
                  </p>
                </div>

                <Separator className="bg-earth-sand" />

                {/* Key Information */}
                <div>
                  <h3 className="text-lg font-semibold text-earth-text mb-4">Key Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-earth-primary" />
                      <div>
                        <p className="text-sm text-earth-text/60">Jurisdiction</p>
                        <p className="font-medium text-earth-text">{regulation.jurisdiction}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-earth-primary" />
                      <div>
                        <p className="text-sm text-earth-text/60">Sector</p>
                        <p className="font-medium text-earth-text">{regulation.sector}</p>
                      </div>
                    </div>
                    
                    {regulation.complianceDeadline && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-earth-primary" />
                        <div>
                          <p className="text-sm text-earth-text/60">Compliance Deadline</p>
                          <p className="font-medium text-earth-text">{formatDate(regulation.complianceDeadline)}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-earth-primary" />
                      <div>
                        <p className="text-sm text-earth-text/60">Country</p>
                        <p className="font-medium text-earth-text">{regulation.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {regulation.tags && regulation.tags.length > 0 && (
                  <>
                    <Separator className="bg-earth-sand" />
                    <div>
                      <h3 className="text-lg font-semibold text-earth-text mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {regulation.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-earth-sand text-earth-text">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Source Link */}
                {regulation.source_url && (
                  <>
                    <Separator className="bg-earth-sand" />
                    <div>
                      <h3 className="text-lg font-semibold text-earth-text mb-3">Official Source</h3>
                      <Button
                        asChild
                        className="bg-earth-primary hover:bg-earth-primary/90 text-white"
                      >
                        <a
                          href={regulation.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Official Source
                        </a>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="border-earth-sand">
              <CardHeader>
                <CardTitle className="text-lg text-earth-text">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user ? (
                  <>
                    <Button className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" className="w-full border-earth-sand">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-earth-text/70 mb-3">
                      Sign in to access export and sharing features
                    </p>
                    <Button asChild className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Information */}
            <Card className="border-earth-sand">
              <CardHeader>
                <CardTitle className="text-lg text-earth-text">Related Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-earth-text/60">Framework</p>
                    <p className="font-medium text-earth-text">{regulation.framework}</p>
                  </div>
                  <div>
                    <p className="text-earth-text/60">Last Updated</p>
                    <p className="font-medium text-earth-text">
                      {regulation.updated_at ? formatDate(regulation.updated_at) : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-earth-text/60">Date Added</p>
                    <p className="font-medium text-earth-text">
                      {regulation.dateAdded ? formatDate(regulation.dateAdded) : 'Not available'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
