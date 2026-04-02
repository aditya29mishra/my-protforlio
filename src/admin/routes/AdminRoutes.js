import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default: redirect /admin to /admin/login */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Auth entry point */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected area (auth guard added in later phase) */}
      <Route path="/admin/dashboard" element={<Dashboard />} />

      {/* Fallback: any unknown /admin/* path → login */}
      <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
