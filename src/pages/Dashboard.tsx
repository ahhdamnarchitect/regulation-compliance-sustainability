import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { RegulationCard } from '@/components/regulations/RegulationCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockRegulations } from '@/data/mockRegulations';
import { Regulation } from '@/types/regulation';
import { Download, BookmarkX, FileText, Bookmark } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarkedRegulations, setBookmarkedRegulations] = useState<Regulation[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  useEffect(() => {
    if (user) {
      const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');
      const bookmarkedRegs = mockRegulations.filter(reg => bookmarks.includes(reg.id));
      setBookmarkedRegulations(bookmarkedRegs);
    }
  }, [user]);

  const handleRemoveBookmark = (e: React.MouseEvent, regulationId: string) => {
    e.stopPropagation();
    if (!user) return;
    
    const currentBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');
    const updatedBookmarks = currentBookmarks.filter((id: string) => id !== regulationId);
    localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
    
    setBookmarkedRegulations(prev => prev.filter(reg => reg.id !== regulationId));
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Title', 'Jurisdiction', 'Country', 'Framework', 'Sector', 'Status', 'Compliance Deadline', 'Source URL'],
      ...bookmarkedRegulations.map(reg => [
        reg.title,
        reg.jurisdiction,
        reg.country,
        reg.framework,
        reg.sector,
        reg.status,
        reg.complianceDeadline || '',
        reg.source_url || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookmarked-regulations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(45, 80, 54); // Earth primary color
    doc.text('Bookmarked Regulations', 20, 20);
    
    // Subtitle with count
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total: ${bookmarkedRegulations.length} regulations`, 20, 30);
    doc.text(`Exported: ${new Date().toLocaleDateString()}`, 20, 37);
    
    let y = 50;
    const pageHeight = doc.internal.pageSize.height;
    
    bookmarkedRegulations.forEach((reg, index) => {
      // Check if we need a new page
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      
      // Regulation title
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const titleLines = doc.splitTextToSize(`${index + 1}. ${reg.title}`, 170);
      doc.text(titleLines, 20, y);
      y += titleLines.length * 6 + 2;
      
      // Details
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Jurisdiction: ${reg.jurisdiction} | Country: ${reg.country}`, 25, y);
      y += 5;
      doc.text(`Framework: ${reg.framework} | Sector: ${reg.sector}`, 25, y);
      y += 5;
      doc.text(`Status: ${reg.status}${reg.complianceDeadline ? ` | Deadline: ${new Date(reg.complianceDeadline).toLocaleDateString()}` : ''}`, 25, y);
      y += 5;
      
      // Source URL if available
      if (reg.source_url) {
        doc.setTextColor(0, 102, 204);
        const urlText = reg.source_url.length > 60 ? reg.source_url.substring(0, 60) + '...' : reg.source_url;
        doc.text(`Source: ${urlText}`, 25, y);
        y += 5;
      }
      
      y += 8; // Space between regulations
    });
    
    doc.save('bookmarked-regulations.pdf');
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bookmark className="w-8 h-8 text-earth-primary" />
              Your Bookmarks
            </h1>
            <p className="text-gray-600 mt-2">Manage your saved regulations</p>
          </div>
          
          {bookmarkedRegulations.length > 0 && (
            <div className="flex items-center space-x-4">
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'pdf') => setExportFormat(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
                {exportFormat === 'csv' ? <Download className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                Export {exportFormat.toUpperCase()}
              </Button>
            </div>
          )}
        </div>

        {bookmarkedRegulations.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600">Start exploring regulations and bookmark the ones you want to track.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedRegulations.map((regulation) => (
              <div
                key={regulation.id}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => navigate(`/regulation/${regulation.id}`)}
              >
                <RegulationCard
                  regulation={regulation}
                  isBookmarked={true}
                  onBookmark={(e) => handleRemoveBookmark(e, regulation.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}