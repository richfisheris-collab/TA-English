import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState<number | undefined>();
  const [dueDate, setDueDate] = useState("");

  const load = () => {
    api.getAssignments().then(setAssignments);
    api.getClasses().then(setClasses);
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.createAssignment({
      title,
      description: description || undefined,
      classId,
      dueDate: dueDate || undefined,
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    load();
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Assignments</h2>
      <form onSubmit={handleCreate} style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "end" }}>
        <div style={{ flex: 2, minWidth: "200px" }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>Title</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Essay on Shakespeare" />
        </div>
        <div style={{ flex: 1, minWidth: "160px" }}>
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
        <div style={{ flex: 1, minWidth: "160px" }}>
          <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>Due Date</label>
          <input style={inputStyle} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <button type="submit" style={btnStyle}>Create</button>
      </form>
      <div style={{ marginBottom: "16px" }}>
        <textarea
          style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Assignment description (optional)"
        />
      </div>
      <div style={{ display: "grid", gap: "12px" }}>
        {assignments.map((a: any) => (
          <Link
            key={a.id}
            to={`/assignments/${a.id}`}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "box-shadow 0.2s",
            }}
          >
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{a.title}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                {a.description ? a.description.substring(0, 80) + (a.description.length > 80 ? "..." : "") : "No description"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                {classes.find((c: any) => c.id === a.classId)?.name || "No class"}
              </p>
              {a.dueDate && (
                <p style={{ fontSize: "12px", color: "#f72585", marginTop: "4px" }}>
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </Link>
        ))}
        {assignments.length === 0 && (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>
            No assignments yet. Create one above.
          </p>
        )}
      </div>
    </div>
  );
}
