import React, { useEffect, useState } from "react";
import { studentsApi } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm = {
  registration_id: "", name: "", email: "", contact: "", degree: "",
  specialization: "", batch_id: "", fees: "", fees_paid: "", fees_pending: "",
  placed: "", linkedin: "", github: "", resume: "",
};

const Students: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try { const res = await studentsApi.getAll(); setData(Array.isArray(res.data) ? res.data : []); }
    catch { toast({ title: "Error", description: "Failed to load students", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (row: any) => {
    setEditing(row);
    setForm({
      registration_id: String(row.registration_id || ""), name: row.name || "", email: row.email || "",
      contact: row.contact || "", degree: row.degree || "", specialization: row.specialization || "",
      batch_id: row.batch_id || "", fees: String(row.fees ?? ""), fees_paid: String(row.fees_paid ?? ""),
      fees_pending: String(row.fees_pending ?? ""), placed: String(row.placed ?? ""),
      linkedin: row.linkedin || "", github: row.github || "", resume: row.resume || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form };
      if (payload.registration_id) payload.registration_id = Number(payload.registration_id);
      if (payload.fees) payload.fees = Number(payload.fees);
      if (payload.fees_paid) payload.fees_paid = Number(payload.fees_paid);
      if (payload.fees_pending) payload.fees_pending = Number(payload.fees_pending);
      if (editing) {
        await studentsApi.update(editing.registration_id, payload);
        toast({ title: "Updated student" });
      } else {
        await studentsApi.create(payload);
        toast({ title: "Created student" });
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this student?")) return;
    try { await studentsApi.delete(row.registration_id); toast({ title: "Deleted student" }); fetchData(); }
    catch { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); }
  };

  const columns = [
    { key: "registration_id", label: "Reg ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "contact", label: "Contact" },
    { key: "degree", label: "Degree" },
    { key: "specialization", label: "Specialization" },
    { key: "batch_id", label: "Batch ID" },
    { key: "fees", label: "Fees" },
    { key: "fees_paid", label: "Fees Paid" },
    { key: "fees_pending", label: "Fees Pending" },
    { key: "placed", label: "Placed" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "github", label: "GitHub" },
    { key: "resume", label: "Resume" },
  ];

  const field = (key: keyof typeof form, label: string, type = "text", disabled = false) => (
    <div className="space-y-2" key={key}>
      <Label className="text-foreground">{label}</Label>
      <Input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} disabled={disabled} className="bg-background border-border" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">Manage student records</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Student
        </Button>
      </div>
      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Student" : "Add Student"}>
        <form onSubmit={handleSave} className="space-y-4">
          {field("registration_id", "Registration ID", "number", !!editing)}
          {field("name", "Name")}
          {field("email", "Email", "email")}
          {field("contact", "Contact")}
          {field("degree", "Degree")}
          {field("specialization", "Specialization")}
          {field("batch_id", "Batch ID")}
          {field("fees", "Fees", "number")}
          {field("fees_paid", "Fees Paid", "number")}
          {field("fees_pending", "Fees Pending", "number")}
          {field("placed", "Placed")}
          {field("linkedin", "LinkedIn")}
          {field("github", "GitHub")}
          {field("resume", "Resume")}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default Students;
