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

export default function Classes() {
  const [classes, setClasses] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("English");

  const load = () => api.getClasses().then(setClasses);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.createClass({ name, subject });
    setName("");
    setSubject("English");
    load();
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Classes</h2>
      <form onSubmit={handleCreate} style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>Class Name</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Year 10 English" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>Subject</label>
          <input style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <button type="submit" style={btnStyle}>Add Class</button>
      </form>
      <div style={{ display: "grid", gap: "12px" }}>
        {classes.map((c: any) => (
          <div
            key={c.id}
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
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{c.name}</h3>
              <p style={{ fontSize: "13px", color: "#64748b" }}>{c.subject}</p>
            </div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              {new Date(c.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
        {classes.length === 0 && (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>
            No classes yet. Create one above.
          </p>
        )}
      </div>
    </div>
  );
}
