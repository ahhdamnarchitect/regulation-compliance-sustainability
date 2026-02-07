import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRegulations } from '@/hooks/useRegulations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
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
  const { toast } = useToast();
  const [regulation, setRegulation] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleExportPDF = () => {
    if (!regulation) return;
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(45, 80, 54); // Earth primary color
    const titleLines = doc.splitTextToSize(regulation.title, 170);
    doc.text(titleLines, 20, 20);
    let y = 20 + titleLines.length * 8;
    
    // Status and Framework badges
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Status: ${regulation.status} | Framework: ${regulation.framework}`, 20, y + 5);
    y += 15;
    
    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 10;
    
    // Description section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Description', 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const descLines = doc.splitTextToSize(regulation.summary || regulation.description || 'No description available', 170);
    doc.text(descLines, 20, y);
    y += descLines.length * 5 + 10;
    
    // Key Information section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Key Information', 20, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    const keyInfo = [
      { label: 'Jurisdiction', value: regulation.jurisdiction },
      { label: 'Country', value: regulation.country },
      { label: 'Sector', value: regulation.sector },
      { label: 'Compliance Deadline', value: regulation.complianceDeadline ? formatDate(regulation.complianceDeadline) : 'Not specified' }
    ];
    
    keyInfo.forEach(item => {
      doc.setTextColor(100, 100, 100);
      doc.text(`${item.label}:`, 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(item.value || 'N/A', 70, y);
      y += 7;
    });
    
    y += 5;
    
    // Tags section
    if (regulation.tags && regulation.tags.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Tags', 20, y);
      y += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(regulation.tags.join(', '), 20, y);
      y += 10;
    }
    
    // Source URL
    if (regulation.source_url) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Official Source', 20, y);
      y += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 102, 204);
      const urlLines = doc.splitTextToSize(regulation.source_url, 170);
      doc.text(urlLines, 20, y);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Exported from MSRB on ${new Date().toLocaleDateString()}`, 20, 285);
    
    // Save the PDF
    const filename = regulation.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    doc.save(`${filename}.pdf`);
    
    toast({
      title: 'PDF Exported',
      description: 'The regulation details have been exported to PDF.',
    });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: regulation?.title,
          text: `Check out this regulation: ${regulation?.title}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Link Copied',
      description: 'The regulation link has been copied to your clipboard.',
    });
  };

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
      <div className="min-h-screen bg-transparent">
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
    <div className="min-h-screen bg-transparent">
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-earth-text">{formatDate(regulation.complianceDeadline)}</p>
                            {new Date(regulation.complianceDeadline) < new Date() ? (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Effective
                              </Badge>
                            ) : new Date(regulation.complianceDeadline) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Due Soon
                              </Badge>
                            ) : null}
                          </div>
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
                    <Button 
                      onClick={handleExportPDF}
                      className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleShare}
                      className="w-full border-earth-sand"
                    >
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
      <Footer />
    </div>
  );
}
