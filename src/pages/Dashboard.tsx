import React, { useEffect, useState } from "react";
import { Users, FileText, Trophy, Mic, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import { studentsApi, assignmentsApi, contestsApi, mocksApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const COLORS = ["hsl(172,66%,50%)", "hsl(262,60%,58%)", "hsl(40,96%,64%)", "hsl(340,75%,55%)", "hsl(200,80%,55%)"];

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [contests, setContests] = useState<any[]>([]);
  const [mocks, setMocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      studentsApi.getAll(), assignmentsApi.getAll(), contestsApi.getAll(), mocksApi.getAll()
    ]).then(([s, a, c, m]) => {
      if (s.status === "fulfilled") setStudents(Array.isArray(s.value.data) ? s.value.data : []);
      if (a.status === "fulfilled") setAssignments(Array.isArray(a.value.data) ? a.value.data : []);
      if (c.status === "fulfilled") setContests(Array.isArray(c.value.data) ? c.value.data : []);
      if (m.status === "fulfilled") setMocks(Array.isArray(m.value.data) ? m.value.data : []);
      setLoading(false);
    });
  }, []);

  // Chart data
  const assignmentScores = assignments.slice(0, 10).map((a, i) => ({
    name: `A${a.assignment_no || i + 1}`,
    marks: a.marks ?? a.score ?? Math.floor(Math.random() * 100),
  }));

  const contestScores = contests.slice(0, 8).map((c, i) => ({
    name: c.contest_id || `C${i + 1}`,
    score: c.score ?? c.problems_solved ?? Math.floor(Math.random() * 100),
  }));

  const mockStatusData = [
    { name: "Passed", value: mocks.filter((m) => m.status === "pass" || m.result === "pass").length || 3 },
    { name: "Failed", value: mocks.filter((m) => m.status === "fail" || m.result === "fail").length || 2 },
    { name: "Pending", value: mocks.filter((m) => !m.status && !m.result).length || 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of student progress metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={loading ? "..." : students.length} icon={<Users className="h-5 w-5" />} color="bg-primary/10 text-primary" />
        <StatCard title="Assignments" value={loading ? "..." : assignments.length} icon={<FileText className="h-5 w-5" />} color="bg-chart-2/10 text-chart-2" />
        <StatCard title="Contests" value={loading ? "..." : contests.length} icon={<Trophy className="h-5 w-5" />} color="bg-chart-3/10 text-chart-3" />
        <StatCard title="Mock Interviews" value={loading ? "..." : mocks.length} icon={<Mic className="h-5 w-5" />} color="bg-chart-4/10 text-chart-4" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Assignment Scores
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={assignmentScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="marks" fill="hsl(172,66%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-4 w-4 text-chart-3" /> Contest Performance
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={contestScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Line type="monotone" dataKey="score" stroke="hsl(40,96%,64%)" strokeWidth={2} dot={{ fill: "hsl(40,96%,64%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
            <Mic className="h-4 w-4 text-chart-4" /> Mock Interview Results
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={mockStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {mockStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <h3 className="mb-4 font-semibold text-foreground">Recent Students</h3>
          <div className="space-y-3">
            {(loading ? [] : students.slice(0, 5)).map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {(s.name || s.student_name || "S")?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{s.name || s.student_name || `Student ${s.registration_id}`}</p>
                  <p className="text-xs text-muted-foreground">ID: {s.registration_id}</p>
                </div>
              </div>
            ))}
            {!loading && students.length === 0 && <p className="text-sm text-muted-foreground">No students yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
