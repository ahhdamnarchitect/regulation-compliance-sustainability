import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Calendar, MapPin, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Regulation } from "@/types/regulation";
import { useAuth } from "@/contexts/AuthContext";
import { formatStatus } from "@/lib/utils";
import { useState } from "react";

// Helper to check if deadline has passed
const isDeadlinePassed = (deadline?: string): boolean => {
  if (!deadline) return false;
  try {
    return new Date(deadline) < new Date();
  } catch {
    return false;
  }
};

// Helper to get deadline status
const getDeadlineStatus = (deadline?: string): 'passed' | 'upcoming' | 'none' => {
  if (!deadline) return 'none';
  try {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (deadlineDate < now) return 'passed';
    if (deadlineDate <= thirtyDaysFromNow) return 'upcoming';
    return 'none';
  } catch {
    return 'none';
  }
};

interface RegulationCardProps {
  regulation: Regulation;
  isBookmarked?: boolean;
  onBookmark?: (e: React.MouseEvent, id: string) => void;
}

export const RegulationCard = ({ regulation, isBookmarked, onBookmark }: RegulationCardProps) => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  
  // Display only Proposed or Enacted; active → Enacted
  const displayStatus = regulation.status === 'proposed' ? 'proposed' : 'enacted';
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enacted': return 'bg-earth-primary/15 text-earth-primary border-earth-primary/40';
      case 'proposed': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-earth-sand/50 text-earth-text border-earth-sand';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enacted': return '🟢';
      case 'proposed': return '🟡';
      default: return '⚪';
    }
  };

  const handleSourceClick = (e: React.MouseEvent) => {
    if (!regulation.source_url) {
      e.preventDefault();
      alert('No source URL available for this regulation');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Not specified';
    try {
      return date.toLocaleDateString();
    } catch {
      return 'Not specified';
    }
  };

  const deadlineStatus = getDeadlineStatus(regulation.complianceDeadline || regulation.reporting_date);
  
  const getDeadlineIndicator = () => {
    switch (deadlineStatus) {
      case 'passed':
        return (
          <span className="flex items-center text-amber-600" title="Compliance deadline has passed">
            <CheckCircle className="w-3 h-3 mr-1" />
            <span className="text-xs">Effective</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center text-orange-600" title="Deadline approaching">
            <Clock className="w-3 h-3 mr-1" />
            <span className="text-xs">Due Soon</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="card-hover-lift border-l-4 border-l-earth-primary bg-white border-earth-sand rounded-lg shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-title text-lg font-semibold text-foreground mb-2 line-clamp-2">
              {regulation.title}
            </h3>
            <div className="flex items-center flex-wrap gap-2 text-sm text-foreground/60 mb-2">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {regulation.jurisdiction || regulation.region || 'Unknown'}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(regulation.complianceDeadline || regulation.reporting_date)}
              </span>
              {getDeadlineIndicator()}
            </div>
            <div className="text-xs text-foreground/60">
              {regulation.country} • {regulation.sector}
            </div>
          </div>
          {user && onBookmark && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(e, regulation.id);
              }}
              className={`${isBookmarked ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-600`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-earth-text/90 text-sm mb-4 line-clamp-3">
          {regulation.summary || regulation.description || 'No description available'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getStatusColor(displayStatus)}>
            {getStatusIcon(displayStatus)} {formatStatus(regulation.status)}
          </Badge>
          <Badge variant="outline" className="border-earth-primary/50 text-earth-primary">
            {regulation.framework}
          </Badge>
          {regulation.tags && regulation.tags.length > 0 &&
            regulation.tags.map((tag, tagIndex) => (
              <Link
                key={`${regulation.id}-${tag}-${tagIndex}`}
                to={`/search?tag=${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-block"
              >
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-earth-primary/15 hover:border-earth-primary/40 border border-transparent transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            disabled={!regulation.source_url}
            onClick={handleSourceClick}
            className="flex-1 mr-2"
          >
            <a 
              href={regulation.source_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {regulation.source_url ? 'View Source' : 'No Source'}
            </a>
          </Button>
          
          {!regulation.source_url && (
            <div className="flex items-center text-xs text-earth-text/70">
              <AlertCircle className="w-3 h-3 mr-1" />
              No source
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};