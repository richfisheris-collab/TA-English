const BASE = "";

async function request(url: string, options?: RequestInit) {
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json();
}

export const api = {
  getStats: () => request("/api/dashboard/stats"),
  getClasses: () => request("/api/classes"),
  createClass: (data: { name: string; subject?: string }) =>
    request("/api/classes", { method: "POST", body: JSON.stringify(data) }),
  getStudents: (classId?: number) =>
    request(`/api/students${classId ? `?classId=${classId}` : ""}`),
  createStudent: (data: { name: string; email?: string; classId?: number }) =>
    request("/api/students", { method: "POST", body: JSON.stringify(data) }),
  getAssignments: (classId?: number) =>
    request(`/api/assignments${classId ? `?classId=${classId}` : ""}`),
  getAssignment: (id: number) => request(`/api/assignments/${id}`),
  createAssignment: (data: { title: string; description?: string; classId?: number; dueDate?: string }) =>
    request("/api/assignments", { method: "POST", body: JSON.stringify(data) }),
  getSubmissions: (params?: { assignmentId?: number; studentId?: number }) => {
    const query = new URLSearchParams();
    if (params?.assignmentId) query.set("assignmentId", String(params.assignmentId));
    if (params?.studentId) query.set("studentId", String(params.studentId));
    const qs = query.toString();
    return request(`/api/submissions${qs ? `?${qs}` : ""}`);
  },
  createSubmission: (data: { assignmentId: number; studentId: number; fileName: string; fileContent: string }) =>
    request("/api/submissions", { method: "POST", body: JSON.stringify(data) }),
  getSubmission: (id: number) => request(`/api/submissions/${id}`),
  gradeSubmission: (id: number, data: { grade: number; feedback?: string; annotations?: string }) =>
    request(`/api/submissions/${id}/grade`, { method: "PATCH", body: JSON.stringify(data) }),
  getClassReport: (classId: number) => request(`/api/reports/class/${classId}`),
};
