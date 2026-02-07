import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function AssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [studentId, setStudentId] = useState<number | undefined>();
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!id) return;
    api.getAssignment(Number(id)).then(setAssignment);
    api.getSubmissions({ assignmentId: Number(id) }).then(setSubmissions);
    api.getStudents().then(setStudents);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !fileContent.trim()) return;
    await api.createSubmission({
      assignmentId: Number(id),
      studentId,
      fileName: fileName || "submission.txt",
      fileContent,
    });
    setFileContent("");
    setFileName("");
    api.getSubmissions({ assignmentId: Number(id) }).then(setSubmissions);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFileContent(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  if (!assignment) return <p>Loading...</p>;

  const getStudentName = (sid: number) => students.find((s: any) => s.id === sid)?.name || "Unknown";

  return (
    <div>
      <Link to="/assignments" style={{ fontSize: "13px", color: "#4361ee", marginBottom: "16px", display: "inline-block" }}>
        &larr; Back to Assignments
      </Link>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>{assignment.title}</h2>
      {assignment.description && (
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>{assignment.description}</p>
      )}

      <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Upload Student Work</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "end" }}>
          <div style={{ flex: 1, minWidth: "180px" }}>
            <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>Student</label>
            <select
              style={inputStyle}
              value={studentId || ""}
              onChange={(e) => setStudentId(Number(e.target.value))}
            >
              <option value="">Select student...</option>
              {students.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 2, minWidth: "200px" }}>
            <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>File or Text</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="file" onChange={handleFileUpload} accept=".txt,.doc,.docx,.pdf" style={{ fontSize: "13px" }} />
            </div>
          </div>
          <button type="submit" style={btnStyle}>Submit</button>
        </form>
        {fileContent && (
          <div style={{ marginTop: "12px" }}>
            <textarea
              style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Or paste student work here..."
            />
          </div>
        )}
        {!fileContent && (
          <div style={{ marginTop: "12px" }}>
            <textarea
              style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Or paste student work here..."
            />
          </div>
        )}
      </div>

      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>
        Submissions ({submissions.length})
      </h3>
      <div style={{ display: "grid", gap: "12px" }}>
        {submissions.map((s: any) => (
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
              <h4 style={{ fontSize: "15px", fontWeight: 600 }}>{getStudentName(s.studentId)}</h4>
              <p style={{ fontSize: "13px", color: "#64748b" }}>{s.fileName}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span
                style={{
                  fontSize: "12px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: s.status === "graded" ? "#d1fae5" : "#fef3c7",
                  color: s.status === "graded" ? "#065f46" : "#92400e",
                  fontWeight: 600,
                }}
              >
                {s.status === "graded" ? `Grade: ${s.grade}%` : "Pending"}
              </span>
              <Link
                to={`/submissions/${s.id}/grade`}
                style={{
                  ...btnStyle,
                  background: s.status === "graded" ? "#06d6a0" : "#4361ee",
                  fontSize: "13px",
                  padding: "8px 16px",
                }}
              >
                {s.status === "graded" ? "Review" : "Grade"}
              </Link>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>
            No submissions yet.
          </p>
        )}
      </div>
    </div>
  );
}
