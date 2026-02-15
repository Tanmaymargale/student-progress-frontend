import React, { useState } from "react";
import { placementApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PlacementReadiness: React.FC = () => {
  const [regId, setRegId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regId) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await placementApi.getStatus(Number(regId));
      setResult(res.data);
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Failed to fetch placement status", variant: "destructive" });
    }
    setLoading(false);
  };

  const isReady = result?.placement_ready || result?.is_ready || result?.ready;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Placement Readiness</h1>
        <p className="text-sm text-muted-foreground">Check if a student is ready for placement</p>
      </div>

      <div className="glass-card max-w-xl rounded-xl p-6">
        <form onSubmit={handleCheck} className="flex gap-3">
          <div className="flex-1 space-y-2">
            <Label className="text-foreground">Registration ID</Label>
            <Input
              type="number"
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
              placeholder="Enter registration ID"
              className="bg-background border-border"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={loading} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Check
            </Button>
          </div>
        </form>
      </div>

      {result && (
        <div className={`glass-card max-w-xl rounded-xl p-6 animate-scale-in ${isReady ? "border-success/30" : "border-destructive/30"}`}>
          <div className="flex items-center gap-3 mb-4">
            {isReady ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {isReady ? "Placement Ready! 🎉" : "Not Ready Yet"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Student ID: {result.registration_id ?? regId}
              </p>
            </div>
          </div>

          {/* Display all returned data */}
          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium capitalize text-muted-foreground">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-foreground text-right max-w-xs">
                  {typeof value === "boolean" ? (value ? "✅ Yes" : "❌ No") :
                   typeof value === "object" ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementReadiness;
