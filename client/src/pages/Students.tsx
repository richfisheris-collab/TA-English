import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  outline: "none",
  width: "100%",
};

const btnStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#4361ee",
  color: "#fff",
  fontWeight: 600,
  fontSize: "14px",
};

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState<number | undefined>();

  const load = () => {
    api.getStudents().then(setStudents);
    api.getClasses().then(setClasses);
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.createStudent({ name, email: email || undefined, classId });
    setName("");
    setEmail("");
    load();
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Students</h2>
      <form onSubmit={handleCreate} style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "end", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>Student Name</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Smith" />
        </div>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>Email</label>
          <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional" />
        </div>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>Class</label>
          <select
            style={inputStyle}
            value={classId || ""}
            onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Select class...</option>
            {classes.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={btnStyle}>Add Student</button>
      </form>
      <div style={{ display: "grid", gap: "12px" }}>
        {students.map((s: any) => (
          <div
            key={s.id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{s.name}</h3>
              <p style={{ fontSize: "13px", color: "#64748b" }}>{s.email || "No email"}</p>
            </div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Class: {classes.find((c: any) => c.id === s.classId)?.name || "Unassigned"}
            </span>
          </div>
        ))}
        {students.length === 0 && (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>
            No students yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
