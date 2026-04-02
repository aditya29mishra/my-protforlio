import React, { memo, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import AdminRoutes from "./routes/AdminRoutes";
import ShimmerLoader from "../components/ShimmerLoader";

// Minimal fallback rendered while lazy admin pages resolve
const AdminLoadingFallback = () => (
  <div style={{ padding: "48px", background: "#0f0f0f", height: "100vh" }}>
    <ShimmerLoader height="60px" style={{ marginBottom: "24px" }} />
    <ShimmerLoader height="400px" />
  </div>
);

// NOTE: No BrowserRouter here — App.js owns the single router instance.
// AdminApp is mounted inside App.js's <Routes>, so it inherits the router context.
const AdminApp = () => {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <Toaster position="top-right" />
      <AdminRoutes />
    </Suspense>
  );
};

export default memo(AdminApp);

