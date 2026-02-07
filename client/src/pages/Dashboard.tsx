import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0",
};

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: "Classes", value: stats.classes, color: "#4361ee" },
    { label: "Students", value: stats.students, color: "#7209b7" },
    { label: "Assignments", value: stats.assignments, color: "#f72585" },
    { label: "Submissions", value: stats.submissions, color: "#4cc9f0" },
    { label: "Graded", value: stats.graded, color: "#06d6a0" },
    { label: "Avg Grade", value: stats.averageGrade ?? "N/A", color: "#ffd166" },
  ];

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Dashboard</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {cards.map((card) => (
          <div key={card.label} style={cardStyle}>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>{card.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
