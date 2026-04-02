import React, { memo, Suspense } from "react";
import AdminRoutes from "./routes/AdminRoutes";

// Minimal fallback rendered while lazy admin pages resolve
const AdminLoadingFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0f0f0f",
      color: "#ffffff",
      fontFamily: "sans-serif",
      fontSize: "14px",
      letterSpacing: "0.05em",
    }}
  >
    Loading admin...
  </div>
);

// NOTE: No BrowserRouter here — App.js owns the single router instance.
// AdminApp is mounted inside App.js's <Routes>, so it inherits the router context.
const AdminApp = () => {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminRoutes />
    </Suspense>
  );
};

export default memo(AdminApp);

