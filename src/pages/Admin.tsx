import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, ExternalLink, Home, Eye, EyeOff } from "lucide-react";
import { DatabaseRegulation } from "@/types/regulation";
import { formatStatus } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

type ProfilePlan = "free" | "professional" | "enterprise";
type ProfileRole = "user" | "admin";

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: ProfileRole;
  plan: ProfilePlan;
  region: string | null;
  created_at: string | null;
}

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length <= 1) return `*@${domain}`;
  return `${local[0]}${"*".repeat(Math.min(6, local.length - 1))}@${domain}`;
}

const Admin = () => {
  const { isAdmin, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("regulations");

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

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [inquiryErrorMsg, setInquiryErrorMsg] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);
  const [revealedEmails, setRevealedEmails] = useState<Record<string, boolean>>({});
  const [profileEdits, setProfileEdits] = useState<Record<string, Partial<Pick<ProfileRow, "role" | "plan" | "full_name">>>>({});

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
    } catch {
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

  const fetchProfiles = useCallback(async () => {
    setProfilesLoading(true);
    setProfilesError(null);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,full_name,role,plan,region,created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setProfilesError(error.message);
        setProfiles([]);
      } else {
        const rows = (data || []).map((r) => ({
          id: r.id as string,
          email: r.email as string,
          full_name: r.full_name as string | null,
          role: (r.role === "admin" ? "admin" : "user") as ProfileRole,
          plan: (["free", "professional", "enterprise"].includes(r.plan as string)
            ? r.plan
            : "free") as ProfilePlan,
          region: r.region as string | null,
          created_at: r.created_at as string | null,
        }));
        setProfiles(rows);
        setProfileEdits({});
      }
    } catch {
      setProfilesError("Failed to load users");
      setProfiles([]);
    }
    setProfilesLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchRegulations();
    fetchInquiries();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || activeTab !== "users") return;
    fetchProfiles();
  }, [isAdmin, activeTab, fetchProfiles]);

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

  const setEdit = (id: string, patch: Partial<Pick<ProfileRow, "role" | "plan" | "full_name">>) => {
    setProfileEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const getEffective = (p: ProfileRow): Pick<ProfileRow, "role" | "plan" | "full_name"> => {
    const e = profileEdits[p.id];
    return {
      role: e?.role ?? p.role,
      plan: e?.plan ?? p.plan,
      full_name: e?.full_name !== undefined ? e.full_name : p.full_name ?? "",
    };
  };

  const handleSaveProfile = async (p: ProfileRow) => {
    const eff = getEffective(p);
    const { error } = await supabase
      .from("profiles")
      .update({
        role: eff.role,
        plan: eff.plan,
        full_name: eff.full_name?.trim() || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", p.id);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProfiles((list) =>
      list.map((row) =>
        row.id === p.id
          ? { ...row, role: eff.role, plan: eff.plan, full_name: eff.full_name || null }
          : row
      )
    );
    setProfileEdits((prev) => {
      const next = { ...prev };
      delete next[p.id];
      return next;
    });
    toast({ title: "User updated", description: "Profile saved." });
  };

  const hasProfileChanges = (p: ProfileRow) => {
    const e = profileEdits[p.id];
    if (!e) return false;
    const eff = getEffective(p);
    return (
      eff.role !== p.role ||
      eff.plan !== p.plan ||
      (eff.full_name || "") !== (p.full_name || "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRegulation) {
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
    } catch {
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
    } catch {
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen page-gradient p-6">
        <p className="text-foreground">You do not have access to this page.</p>
        <Link to="/" className="text-earth-primary underline mt-4 inline-block">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient flex flex-col">
      <div className="p-4 md:p-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Regulations, inquiries, and user accounts</p>
          </div>
          <Button variant="outline" asChild className="w-fit">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to homepage
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1 mb-4">
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
            <TabsTrigger value="inquiries">Customer inquiries</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="regulations" className="mt-0 space-y-4">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingRegulation(null); resetForm(); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Regulation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Region</label>
                        <Input
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Country</label>
                        <Input
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Framework</label>
                        <Input
                          value={formData.framework}
                          onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Sector</label>
                        <Input
                          value={formData.sector}
                          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Reporting Year</label>
                        <Input
                          type="number"
                          value={formData.reporting_year}
                          onChange={(e) => setFormData({ ...formData, reporting_year: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
                          onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tags (comma-separated)</label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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

            {loading ? (
              <div className="p-6 border rounded bg-card text-muted-foreground">Loading regulations…</div>
            ) : errorMsg ? (
              <div className="p-6 border rounded text-red-600 bg-card">Failed to load regulations: {errorMsg}</div>
            ) : (
              <div className="overflow-auto border rounded bg-card">
                <table className="min-w-[1200px] w-full text-sm">
                  <thead className="bg-muted/50">
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
                      <tr key={r.id} className="border-t hover:bg-muted/30">
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
                              className="text-primary hover:underline flex items-center"
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
                            <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>
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
            )}
          </TabsContent>

          <TabsContent value="inquiries" className="mt-0 space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" onClick={fetchInquiries}>
                Refresh
              </Button>
            </div>
            {inquiriesLoading ? (
              <div className="p-4 border rounded bg-card">Loading inquiries…</div>
            ) : inquiryErrorMsg ? (
              <div className="p-4 border rounded text-red-600 bg-card">Failed to load inquiries: {inquiryErrorMsg}</div>
            ) : inquiries.length === 0 ? (
              <div className="p-4 border rounded bg-card text-muted-foreground">No inquiries yet.</div>
            ) : (
              <div className="overflow-auto border rounded bg-card">
                <table className="min-w-[1200px] w-full text-sm">
                  <thead className="bg-muted/50">
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
                      <tr key={q.id} className="border-t align-top hover:bg-muted/30">
                        <td className="p-3 whitespace-nowrap">{new Date(q.created_at).toLocaleString()}</td>
                        <td className="p-3">
                          <Badge variant={q.inquiry_type === "question" ? "default" : "secondary"}>
                            {q.inquiry_type === "question" ? "Question" : "Suggestion"}
                          </Badge>
                        </td>
                        <td className="p-3">{q.name || "—"}</td>
                        <td className="p-3">
                          <a className="text-primary hover:underline" href={`mailto:${q.email}`}>
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
          </TabsContent>

          <TabsContent value="users" className="mt-0 space-y-4">
            <div className="rounded-lg border border-earth-sand/80 bg-card/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Privacy</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Emails are masked by default. Reveal only when needed for support.</li>
                <li>Passwords and payment details are not stored in this table — use Supabase Auth and Stripe dashboards for those.</li>
                <li>Adjust <strong>plan</strong> and <strong>role</strong> for access and billing alignment; avoid unnecessary changes.</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={fetchProfiles} disabled={profilesLoading}>
                Refresh
              </Button>
            </div>
            {profilesLoading ? (
              <div className="p-4 border rounded bg-card">Loading users…</div>
            ) : profilesError ? (
              <div className="p-4 border rounded text-red-600 bg-card">
                <p>{profilesError}</p>
                <p className="text-sm mt-2 text-muted-foreground">
                  If this persists, apply the migration <code className="text-xs bg-muted px-1 rounded">20260320000500_profiles_admin_read_update_policies.sql</code> in Supabase so admins can list profiles.
                </p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="p-4 border rounded bg-card text-muted-foreground">No profiles found.</div>
            ) : (
              <div className="overflow-auto border rounded bg-card">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Display name</th>
                      <th className="text-left p-3">Region</th>
                      <th className="text-left p-3">Role</th>
                      <th className="text-left p-3">Plan</th>
                      <th className="text-left p-3">Joined</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => {
                      const eff = getEffective(p);
                      const showEmail = revealedEmails[p.id];
                      const isSelf = currentUser?.id === p.id;
                      return (
                        <tr key={p.id} className="border-t align-top hover:bg-muted/30">
                          <td className="p-3">
                            <div className="flex flex-col gap-1 max-w-[240px]">
                              <span className="font-mono text-xs break-all">
                                {showEmail ? p.email : maskEmail(p.email)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-fit px-2 text-xs"
                                onClick={() =>
                                  setRevealedEmails((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                                }
                              >
                                {showEmail ? (
                                  <>
                                    <EyeOff className="w-3 h-3 mr-1" /> Hide
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3 mr-1" /> Reveal
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                          <td className="p-3">
                            <Input
                              className="h-8 text-xs max-w-[180px]"
                              value={eff.full_name ?? ""}
                              onChange={(e) => setEdit(p.id, { full_name: e.target.value })}
                              placeholder="Name"
                            />
                          </td>
                          <td className="p-3 text-muted-foreground text-xs max-w-[120px] truncate" title={p.region || undefined}>
                            {p.region || "—"}
                          </td>
                          <td className="p-3">
                            <Select
                              value={eff.role}
                              onValueChange={(v) => setEdit(p.id, { role: v as ProfileRole })}
                            >
                              <SelectTrigger className="w-[110px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            {isSelf ? (
                              <p className="text-[10px] text-muted-foreground mt-1">Your account</p>
                            ) : null}
                          </td>
                          <td className="p-3">
                            <Select
                              value={eff.plan}
                              onValueChange={(v) => setEdit(p.id, { plan: v as ProfilePlan })}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                          </td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              disabled={!hasProfileChanges(p)}
                              onClick={() => handleSaveProfile(p)}
                            >
                              Save
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
