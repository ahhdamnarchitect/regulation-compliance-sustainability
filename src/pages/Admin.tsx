import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { DatabaseRegulation } from "@/types/regulation";
import { formatStatus } from "@/lib/utils";

type InquiryStatus = "new" | "in_review" | "resolved";

interface CustomerInquiry {
  id: string;
  inquiry_type: "question" | "suggestion";
  name: string | null;
  email: string;
  message: string;
  topic: string | null;
  location_hint: string | null;
  page_path: string | null;
  status: InquiryStatus;
  created_at: string;
}

const Admin = () => {
  const { isAdmin } = useAuth();
  const [regulations, setRegulations] = useState<DatabaseRegulation[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [inquiryErrorMsg, setInquiryErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegulation, setEditingRegulation] = useState<DatabaseRegulation | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    region: '',
    country: '',
    framework: '',
    sector: '',
    description: '',
    reporting_year: '',
    status: 'proposed',
    source_url: '',
    tags: ''
  });

  const fetchRegulations = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("regulations")
        .select("*")
        .order("id", { ascending: true });
      
      if (error) {
        setErrorMsg(error.message);
        setRegulations([]);
      } else {
        setRegulations(data as DatabaseRegulation[]);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch regulations');
      setRegulations([]);
    }
    setLoading(false);
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    setInquiryErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("customer_inquiries")
        .select("id,inquiry_type,name,email,message,topic,location_hint,page_path,status,created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setInquiryErrorMsg(error.message);
        setInquiries([]);
      } else {
        setInquiries((data || []) as CustomerInquiry[]);
      }
    } catch {
      setInquiryErrorMsg("Failed to fetch inquiries");
      setInquiries([]);
    }
    setInquiriesLoading(false);
  };

  const handleInquiryStatusChange = async (id: string, status: InquiryStatus) => {
    const previous = inquiries;
    setInquiries((current) => current.map((i) => (i.id === id ? { ...i, status } : i)));

    const { error } = await supabase
      .from("customer_inquiries")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      setInquiryErrorMsg("Failed to update inquiry status");
      setInquiries(previous);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRegulation) {
        // Update existing regulation
        const { error } = await supabase
          .from('regulations')
          .update({
            title: formData.title,
            region: formData.region,
            country: formData.country,
            framework: formData.framework,
            sector: formData.sector,
            description: formData.description,
            reporting_year: formData.reporting_year,
            status: formData.status,
            source_url: formData.source_url,
            tags: formData.tags
          })
          .eq('id', editingRegulation.id);

        if (error) throw error;
      } else {
        // Create new regulation
        const { error } = await supabase
          .from('regulations')
          .insert([{
            title: formData.title,
            region: formData.region,
            country: formData.country,
            framework: formData.framework,
            sector: formData.sector,
            description: formData.description,
            reporting_year: formData.reporting_year,
            status: formData.status,
            source_url: formData.source_url,
            tags: formData.tags
          }]);

        if (error) throw error;
      }

      setIsDialogOpen(false);
      setEditingRegulation(null);
      resetForm();
      fetchRegulations();
    } catch (err) {
      setErrorMsg('Failed to save regulation');
    }
  };

  const handleEdit = (regulation: DatabaseRegulation) => {
    setEditingRegulation(regulation);
    const rawStatus = regulation.status || 'proposed';
    const status = rawStatus === 'proposed' ? 'proposed' : 'enacted';
    setFormData({
      title: regulation.title || '',
      region: regulation.region || '',
      country: regulation.country || '',
      framework: regulation.framework || '',
      sector: regulation.sector || '',
      description: regulation.description || '',
      reporting_year: regulation.reporting_year?.toString() || '',
      status,
      source_url: regulation.source_url || '',
      tags: regulation.tags || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this regulation?')) return;
    
    try {
      const { error } = await supabase
        .from('regulations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRegulations();
    } catch (err) {
      setErrorMsg('Failed to delete regulation');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      region: '',
      country: '',
      framework: '',
      sector: '',
      description: '',
      reporting_year: '',
      status: 'proposed',
      source_url: '',
      tags: ''
    });
  };

  useEffect(() => {
    fetchRegulations();
    fetchInquiries();
  }, []);

  if (!isAdmin) {
    return <div className="p-6">You do not have access to this page.</div>;
  }

  if (loading) return <div className="p-6">Loading regulations…</div>;
  
  if (errorMsg) {
    return (
      <div className="p-6 text-red-600">
        Failed to load regulations: {errorMsg}
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Admin — Regulations Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingRegulation(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Regulation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRegulation ? 'Edit Regulation' : 'Add New Regulation'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Region</label>
                  <Input
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Framework</label>
                  <Input
                    value={formData.framework}
                    onChange={(e) => setFormData({...formData, framework: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sector</label>
                  <Input
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reporting Year</label>
                  <Input
                    type="number"
                    value={formData.reporting_year}
                    onChange={(e) => setFormData({...formData, reporting_year: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proposed">Proposed</SelectItem>
                      <SelectItem value="enacted">Enacted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Source URL</label>
                  <Input
                    type="url"
                    value={formData.source_url}
                    onChange={(e) => setFormData({...formData, source_url: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="sustainability, ESG, climate"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRegulation ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-auto border rounded">
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Region</th>
              <th className="text-left p-3">Country</th>
              <th className="text-left p-3">Framework</th>
              <th className="text-left p-3">Sector</th>
              <th className="text-left p-3">Year</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Source</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {regulations.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{r.id}</td>
                <td className="p-3 max-w-xs truncate">{r.title || "—"}</td>
                <td className="p-3">{r.region || "—"}</td>
                <td className="p-3">{r.country || "—"}</td>
                <td className="p-3">{r.framework || "—"}</td>
                <td className="p-3">{r.sector || "—"}</td>
                <td className="p-3">{r.reporting_year || "—"}</td>
                <td className="p-3">
                  <Badge variant={r.status === 'proposed' ? 'secondary' : 'default'}>
                    {formatStatus(r.status || '') || "—"}
                  </Badge>
                </td>
                <td className="p-3">
                  {r.source_url ? (
                    <a
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                      href={r.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(r)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(r.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-foreground">Customer Inquiries</h2>
          <Button variant="outline" onClick={fetchInquiries}>
            Refresh
          </Button>
        </div>

        {inquiriesLoading ? (
          <div className="p-4 border rounded bg-white">Loading inquiries…</div>
        ) : inquiryErrorMsg ? (
          <div className="p-4 border rounded text-red-600 bg-white">Failed to load inquiries: {inquiryErrorMsg}</div>
        ) : inquiries.length === 0 ? (
          <div className="p-4 border rounded bg-white text-muted-foreground">No inquiries yet.</div>
        ) : (
          <div className="overflow-auto border rounded bg-white">
            <table className="min-w-[1200px] w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Topic / Location</th>
                  <th className="text-left p-3">Message</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((q) => (
                  <tr key={q.id} className="border-t align-top hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap">{new Date(q.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <Badge variant={q.inquiry_type === "question" ? "default" : "secondary"}>
                        {q.inquiry_type === "question" ? "Question" : "Suggestion"}
                      </Badge>
                    </td>
                    <td className="p-3">{q.name || "—"}</td>
                    <td className="p-3">
                      <a className="text-blue-600 hover:text-blue-800 underline" href={`mailto:${q.email}`}>
                        {q.email}
                      </a>
                    </td>
                    <td className="p-3 max-w-[220px]">
                      <div className="text-xs text-muted-foreground space-y-1">
                        {q.topic ? <p><strong>Topic:</strong> {q.topic}</p> : null}
                        {q.location_hint ? <p><strong>Location:</strong> {q.location_hint}</p> : null}
                        {!q.topic && !q.location_hint ? "—" : null}
                      </div>
                    </td>
                    <td className="p-3 max-w-md whitespace-pre-wrap">{q.message}</td>
                    <td className="p-3">
                      <Select
                        value={q.status}
                        onValueChange={(value) => handleInquiryStatusChange(q.id, value as InquiryStatus)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_review">In Review</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Admin;