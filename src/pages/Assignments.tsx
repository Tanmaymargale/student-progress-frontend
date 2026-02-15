import React, { useEffect, useState } from "react";
import { assignmentsApi } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm = {
  registration_id: "", student_name: "", assignment_title: "", assignment_no: "",
  assigned_date: "", due_date: "", submission_link: "", status: "", marks: "",
};

const Assignments: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await assignmentsApi.getAll(); setData(Array.isArray(res.data) ? res.data : []); }
    catch { toast({ title: "Error", description: "Failed to load assignments", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      registration_id: String(row.registration_id || ""), student_name: row.student_name || "",
      assignment_title: row.assignment_title || "", assignment_no: String(row.assignment_no || ""),
      assigned_date: row.assigned_date || "", due_date: row.due_date || "",
      submission_link: row.submission_link || "", status: row.status || "", marks: String(row.marks ?? ""),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form, registration_id: Number(form.registration_id), assignment_no: Number(form.assignment_no), marks: form.marks ? Number(form.marks) : undefined };
      if (editing) {
        await assignmentsApi.update(editing.registration_id, editing.assignment_no, payload);
        toast({ title: "Updated assignment" });
      } else {
        await assignmentsApi.create(payload);
        toast({ title: "Created assignment" });
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this assignment?")) return;
    try { await assignmentsApi.delete(row.registration_id, row.assignment_no); toast({ title: "Deleted" }); fetchData(); }
    catch { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); }
  };

  const columns = [
    { key: "registration_id", label: "Reg ID" },
    { key: "student_name", label: "Student Name" },
    { key: "assignment_title", label: "Title" },
    { key: "assignment_no", label: "Assignment #" },
    { key: "assigned_date", label: "Assigned Date" },
    { key: "due_date", label: "Due Date" },
    { key: "submission_link", label: "Submission Link" },
    { key: "status", label: "Status", render: (r: any) => (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${r.status === "completed" || r.status === "graded" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
        {r.status || "pending"}
      </span>
    )},
    { key: "marks", label: "Marks" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground">Manage assignments and marks</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Assignment
        </Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Assignment" : "Add Assignment"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label className="text-foreground">Registration ID</Label><Input type="number" value={form.registration_id} onChange={(e) => setForm({ ...form, registration_id: e.target.value })} required disabled={!!editing} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Student Name</Label><Input value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Assignment Title</Label><Input value={form.assignment_title} onChange={(e) => setForm({ ...form, assignment_title: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Assignment No</Label><Input type="number" value={form.assignment_no} onChange={(e) => setForm({ ...form, assignment_no: e.target.value })} required disabled={!!editing} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Assigned Date</Label><Input type="date" value={form.assigned_date} onChange={(e) => setForm({ ...form, assigned_date: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Due Date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Submission Link</Label><Input value={form.submission_link} onChange={(e) => setForm({ ...form, submission_link: e.target.value })} className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Status</Label><Input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="pending / completed / graded" className="bg-background border-border" /></div>
          <div className="space-y-2"><Label className="text-foreground">Marks</Label><Input type="number" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} className="bg-background border-border" /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default Assignments;
