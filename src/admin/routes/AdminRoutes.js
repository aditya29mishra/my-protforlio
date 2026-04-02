import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

const AdminLogin    = lazy(() => import("../pages/AdminLogin"));
const Dashboard     = lazy(() => import("../pages/Dashboard"));
const ProjectsPage  = lazy(() => import("../pages/ProjectsPage"));
const ProjectForm   = lazy(() => import("../pages/ProjectForm"));
const SkillsPage    = lazy(() => import("../pages/SkillsPage"));
const SkillForm     = lazy(() => import("../pages/SkillForm"));
const TimelinePage  = lazy(() => import("../pages/TimelinePage"));
const TimelineForm  = lazy(() => import("../pages/TimelineForm"));

const AdminRoutes = () => {
  // IMPORTANT: These paths are RELATIVE to the parent route match in App.js.
  // App.js matches "/admin/*" and strips "/admin/" before passing the remainder
  // to this nested <Routes>. So "login" here matches the full URL "/admin/login".
  return (
    <Routes>
      {/* Default: /admin → redirect to /admin/login */}
      <Route index element={<Navigate to="login" replace />} />

      {/* /admin/login */}
      <Route path="login" element={<AdminLogin />} />

      {/* /admin/dashboard (ProtectedRoute wired in Phase 1F) */}
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />

        {/* ── Projects module ──────────────────────────────── */}
        <Route path="projects"     element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectForm />} />

        {/* ── Skills module ─────────────────────────────────── */}
        <Route path="skills"     element={<SkillsPage />} />
        <Route path="skills/new" element={<SkillForm />} />
        <Route path="skills/:id" element={<SkillForm />} />

        {/* ── Timeline module ───────────────────────────────── */}
        <Route path="timeline"     element={<TimelinePage />} />
        <Route path="timeline/new" element={<TimelineForm />} />
        <Route path="timeline/:id" element={<TimelineForm />} />
      </Route>

      {/* Catch-all: any unknown /admin/* path → login */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
