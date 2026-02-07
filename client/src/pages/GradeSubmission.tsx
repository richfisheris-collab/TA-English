import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function GradeSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [annotations, setAnnotations] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getSubmission(Number(id)).then((s) => {
      setSubmission(s);
      setGrade(s.grade?.toString() || "");
      setFeedback(s.feedback || "");
      setAnnotations(s.annotations || "");
      api.getStudents().then((students) => {
        const st = students.find((st: any) => st.id === s.studentId);
        setStudent(st);
      });
    });
  }, [id]);

  const handleSave = async () => {
    if (!grade) return;
    setSaving(true);
    await api.gradeSubmission(Number(id), {
      grade: Number(grade),
      feedback,
      annotations,
    });
    setSaving(false);
    navigate(-1);
  };

  if (!submission) return <p>Loading...</p>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{ fontSize: "13px", color: "#4361ee", background: "none", border: "none", marginBottom: "16px" }}
      >
        &larr; Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
            {student?.name || "Student"}'s Submission
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
            File: {submission.fileName}
          </p>
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              minHeight: "400px",
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            {submission.fileContent || "No content available"}
          </div>
        </div>

        <div>
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              position: "sticky",
              top: "32px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>Grading</h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>
                Grade (0-100)
              </label>
              <input
                style={inputStyle}
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade..."
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>
                Feedback
              </label>
              <textarea
                style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the student..."
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>
                Annotations / Notes
              </label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                value={annotations}
                onChange={(e) => setAnnotations(e.target.value)}
                placeholder="Add markup notes or annotations..."
              />
            </div>

            <button onClick={handleSave} style={{ ...btnStyle, width: "100%" }} disabled={saving}>
              {saving ? "Saving..." : submission.status === "graded" ? "Update Grade" : "Submit Grade"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
