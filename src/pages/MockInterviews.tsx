import React, { useEffect, useState } from "react";
import { mocksApi } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm = { mock_id: "", registration_id: "", batch_id: "", interviewer: "", score: "", feedback: "", status: "" };

const MockInterviews: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await mocksApi.getAll(); setData(Array.isArray(res.data) ? res.data : []); }
    catch { toast({ title: "Error", description: "Failed to load mock interviews", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      mock_id: row.mock_id || "", registration_id: String(row.registration_id || ""),
      batch_id: row.batch_id || "", interviewer: row.interviewer || "",
      score: String(row.score ?? ""), feedback: row.feedback || "", status: row.status || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form, registration_id: Number(form.registration_id), score: Number(form.score) };
      if (editing) {
        await mocksApi.update(editing.mock_id, editing.registration_id, payload);
        toast({ title: "Updated mock interview" });
      } else {
        await mocksApi.create(payload);
        toast({ title: "Created mock interview" });
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this mock interview?")) return;
    try { await mocksApi.delete(row.mock_id, row.registration_id); toast({ title: "Deleted" }); fetchData(); }
    catch { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); }
  };

  const columns = [
    { key: "mock_id", label: "Mock ID" },
    { key: "registration_id", label: "Reg ID" },
    { key: "batch_id", label: "Batch ID" },
    { key: "interviewer", label: "Interviewer" },
    { key: "score", label: "Score" },
    { key: "feedback", label: "Feedback" },
    { key: "status", label: "Status", render: (r: any) => {
      const s = r.status || "pending";
      return (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${s === "pass" ? "bg-success/10 text-success" : s === "fail" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
          {s}
        </span>
      );
    }},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mock Interviews</h1>
          <p className="text-sm text-muted-foreground">Track mock interview scores and feedback</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Mock
        </Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Mock Interview" : "Add Mock Interview"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label className="text-foreground">Mock ID</Label><Input value={form.mock_id} onChange={(e) => setForm({ ...form, mock_id: e.target.value })} required disabled={!!editing} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Registration ID</Label><Input type="number" value={form.registration_id} onChange={(e) => setForm({ ...form, registration_id: e.target.value })} required disabled={!!editing} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Batch ID</Label><Input value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Interviewer</Label><Input value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Score</Label><Input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Feedback</Label><Input value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Status</Label><Input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="pass / fail / pending" className="bg-background border-border" /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default MockInterviews;
