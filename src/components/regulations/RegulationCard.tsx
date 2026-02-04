import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Calendar, MapPin, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { Regulation } from "@/types/regulation";
import { useAuth } from "@/contexts/AuthContext";
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'repealed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'proposed': return '🟡';
      case 'repealed': return '🔴';
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
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
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
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-earth-primary bg-white border-earth-sand rounded-lg shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-earth-text mb-2 line-clamp-2">
              {regulation.title}
            </h3>
            <div className="flex items-center flex-wrap gap-2 text-sm text-earth-text/70 mb-2">
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
            <div className="text-xs text-earth-text/60">
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
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {regulation.summary || regulation.description || 'No description available'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getStatusColor(regulation.status)}>
            {getStatusIcon(regulation.status)} {regulation.status}
          </Badge>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            {regulation.framework}
          </Badge>
          {regulation.tags && regulation.tags.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {regulation.tags.slice(0, 2).join(', ')}
              {regulation.tags.length > 2 && ` +${regulation.tags.length - 2} more`}
            </Badge>
          )}
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
            <div className="flex items-center text-xs text-gray-500">
              <AlertCircle className="w-3 h-3 mr-1" />
              No source
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};