import React, { useEffect, useState } from "react";
import { contestsApi } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm = { contest_id: "", registration_id: "", batch_id: "", contest_name: "", date: "", score: "", rank: "", remark: "" };

const CodingContests: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await contestsApi.getAll(); setData(Array.isArray(res.data) ? res.data : []); }
    catch { toast({ title: "Error", description: "Failed to load contests", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      contest_id: row.contest_id || "", registration_id: String(row.registration_id || ""),
      batch_id: row.batch_id || "", contest_name: row.contest_name || "",
      date: row.date || "", score: String(row.score ?? ""),
      rank: String(row.rank ?? ""), remark: row.remark || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form, registration_id: Number(form.registration_id), score: Number(form.score), rank: form.rank ? Number(form.rank) : undefined };
      if (editing) {
        await contestsApi.update(editing.contest_id, editing.registration_id, payload);
        toast({ title: "Updated contest entry" });
      } else {
        await contestsApi.create(payload);
        toast({ title: "Created contest entry" });
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this contest entry?")) return;
    try { await contestsApi.delete(row.contest_id, row.registration_id); toast({ title: "Deleted" }); fetchData(); }
    catch { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); }
  };

  const columns = [
    { key: "contest_id", label: "Contest ID" },
    { key: "registration_id", label: "Reg ID" },
    { key: "batch_id", label: "Batch ID" },
    { key: "contest_name", label: "Contest Name" },
    { key: "date", label: "Date" },
    { key: "score", label: "Score" },
    { key: "rank", label: "Rank", render: (r: any) => r.rank ? `#${r.rank}` : "—" },
    { key: "remark", label: "Remark" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coding Contests</h1>
          <p className="text-sm text-muted-foreground">Track contest scores and rankings</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Entry
        </Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Contest Entry" : "Add Contest Entry"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label className="text-foreground">Contest ID</Label><Input value={form.contest_id} onChange={(e) => setForm({ ...form, contest_id: e.target.value })} required disabled={!!editing} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Registration ID</Label><Input type="number" value={form.registration_id} onChange={(e) => setForm({ ...form, registration_id: e.target.value })} required disabled={!!editing} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Batch ID</Label><Input value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Contest Name</Label><Input value={form.contest_name} onChange={(e) => setForm({ ...form, contest_name: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Score</Label><Input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Rank</Label><Input type="number" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Remark</Label><Input value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} className="bg-background border-border" /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default CodingContests;
