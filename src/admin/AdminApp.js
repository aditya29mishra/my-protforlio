import React, { memo, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";

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

const AdminApp = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<AdminLoadingFallback />}>
        <AdminRoutes />
      </Suspense>
    </BrowserRouter>
  );
};

export default memo(AdminApp);

