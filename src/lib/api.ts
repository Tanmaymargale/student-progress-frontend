import axios from "axios";

const API_BASE = "https://student-progress-backend-3.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Students
export const studentsApi = {
  getAll: () => api.get("/students/"),
  get: (id: number) => api.get(`/students/${id}`),
  create: (data: any) => api.post("/students/", data),
  update: (id: number, data: any) => api.patch(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// Batches
export const batchesApi = {
  getAll: () => api.get("/batches/"),
  get: (id: string) => api.get(`/batches/${id}`),
  create: (data: any) => api.post("/batches/", data),
  update: (id: string, data: any) => api.patch(`/batches/${id}`, data),
  delete: (id: string) => api.delete(`/batches/${id}`),
};

// Assignments
export const assignmentsApi = {
  getAll: () => api.get("/assignments/"),
  get: (regId: number, assignNo: number) => api.get(`/assignments/${regId}/${assignNo}`),
  create: (data: any) => api.post("/assignments/", data),
  update: (regId: number, assignNo: number, data: any) => api.patch(`/assignments/${regId}/${assignNo}`, data),
  delete: (regId: number, assignNo: number) => api.delete(`/assignments/${regId}/${assignNo}`),
};

// Coding Contests
export const contestsApi = {
  getAll: () => api.get("/contests/"),
  get: (contestId: string, regId: number) => api.get(`/contests/${contestId}/${regId}`),
  create: (data: any) => api.post("/contests/", data),
  update: (contestId: string, regId: number, data: any) => api.patch(`/contests/${contestId}/${regId}`, data),
  delete: (contestId: string, regId: number) => api.delete(`/contests/${contestId}/${regId}`),
};

// Mock Interviews
export const mocksApi = {
  getAll: () => api.get("/mocks/"),
  get: (mockId: string, regId: number) => api.get(`/mocks/${mockId}/${regId}`),
  create: (data: any) => api.post("/mocks/", data),
  update: (mockId: string, regId: number, data: any) => api.patch(`/mocks/${mockId}/${regId}`, data),
  delete: (mockId: string, regId: number) => api.delete(`/mocks/${mockId}/${regId}`),
};

// Placement
export const placementApi = {
  getStatus: (regId: number) => api.get(`/placement/${regId}`),
};

export default api;
