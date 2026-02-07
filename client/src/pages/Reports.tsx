import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Reports() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [report, setReport] = useState<any[] | null>(null);

  useEffect(() => {
    api.getClasses().then(setClasses);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      api.getClassReport(selectedClass).then(setReport);
    } else {
      setReport(null);
    }
  }, [selectedClass]);

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Reports</h2>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "4px" }}>
          Select a Class
        </label>
        <select
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "14px",
            outline: "none",
            minWidth: "250px",
          }}
          value={selectedClass || ""}
          onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Choose class...</option>
          {classes.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {report && (
        <div>
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Student</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Submissions</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Graded</th>
                  <th style={{ padding: "14px 20px", textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Average Grade</th>
                </tr>
              </thead>
              <tbody>
                {report.map((r: any) => (
                  <tr key={r.student.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 500 }}>{r.student.name}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "14px" }}>{r.totalSubmissions}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "14px" }}>{r.gradedSubmissions}</td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      {r.averageGrade !== null ? (
                        <span
                          style={{
                            padding: "4px 14px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: 600,
                            background: r.averageGrade >= 70 ? "#d1fae5" : r.averageGrade >= 50 ? "#fef3c7" : "#fecaca",
                            color: r.averageGrade >= 70 ? "#065f46" : r.averageGrade >= 50 ? "#92400e" : "#991b1b",
                          }}
                        >
                          {r.averageGrade}%
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "13px" }}>N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
                {report.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                      No students in this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedClass && (
        <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>
          Select a class to view student performance reports.
        </p>
      )}
    </div>
  );
}
