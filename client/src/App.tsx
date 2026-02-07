import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Assignments from "./pages/Assignments";
import AssignmentDetail from "./pages/AssignmentDetail";
import GradeSubmission from "./pages/GradeSubmission";
import Reports from "./pages/Reports";

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        background: isActive ? "#4361ee" : "transparent",
        color: isActive ? "#fff" : "#64748b",
        fontWeight: isActive ? 600 : 400,
        fontSize: "14px",
        transition: "all 0.2s",
        display: "block",
      }}
    >
      {children}
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav
        style={{
          width: "240px",
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <div style={{ marginBottom: "24px", padding: "0 16px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#4361ee" }}>
            TeachAssist
          </h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            Assignment Manager
          </p>
        </div>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/classes">Classes</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/assignments">Assignments</NavLink>
        <NavLink to="/reports">Reports</NavLink>
      </nav>
      <main style={{ flex: 1, marginLeft: "240px", padding: "32px" }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/students" element={<Students />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/assignments/:id" element={<AssignmentDetail />} />
          <Route path="/submissions/:id/grade" element={<GradeSubmission />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
