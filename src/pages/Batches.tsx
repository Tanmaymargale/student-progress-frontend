import React, { useEffect, useState } from "react";
import { batchesApi } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm = { batch_id: "", start_date: "", end_date: "", meeting_link: "", fees: "", total_students: "" };

const Batches: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await batchesApi.getAll(); setData(Array.isArray(res.data) ? res.data : []); }
    catch { toast({ title: "Error", description: "Failed to load batches", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      batch_id: row.batch_id || "", start_date: row.start_date || "", end_date: row.end_date || "",
      meeting_link: row.meeting_link || "", fees: String(row.fees ?? ""), total_students: String(row.total_students ?? ""),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form };
      if (payload.fees) payload.fees = Number(payload.fees);
      if (payload.total_students) payload.total_students = Number(payload.total_students);
      if (editing) {
        await batchesApi.update(editing.batch_id, payload);
        toast({ title: "Updated batch" });
      } else {
        await batchesApi.create(payload);
        toast({ title: "Created batch" });
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this batch?")) return;
    try { await batchesApi.delete(row.batch_id); toast({ title: "Deleted batch" }); fetchData(); }
    catch { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); }
  };

  const columns = [
    { key: "batch_id", label: "Batch ID" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "meeting_link", label: "Meeting Link" },
    { key: "fees", label: "Fees" },
    { key: "total_students", label: "Total Students" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Batches</h1>
          <p className="text-sm text-muted-foreground">Manage batch details</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Batch
        </Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Batch" : "Add Batch"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label className="text-foreground">Batch ID</Label><Input value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })} required disabled={!!editing} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">End Date</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Meeting Link</Label><Input value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Fees</Label><Input type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Total Students</Label><Input type="number" value={form.total_students} onChange={(e) => setForm({ ...form, total_students: e.target.value })} className="bg-background border-border" /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default Batches;
