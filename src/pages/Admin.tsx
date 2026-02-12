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

const Admin = () => {
  const { isAdmin } = useAuth();
  const [regulations, setRegulations] = useState<DatabaseRegulation[]>([]);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin — Regulations Management</h1>
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
      <Footer />
    </div>
  );
};

export default Admin;