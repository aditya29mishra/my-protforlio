import React, { memo, useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAdminSession } from "../../services/admin/authAdminService";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const checkSession = useCallback(async () => {
    try {
      const activeSession = await getAdminSession();

      if (!activeSession) {
        navigate("/admin/login", { replace: true });
        return;
      }

      setSession(activeSession);
    } catch {
      // Session check failed — treat as unauthenticated
      navigate("/admin/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Hold render until session state is known — prevents flicker
  if (loading) {
    return null;
  }

  // session is guaranteed non-null here (null case navigates away above)
  return session ? <Outlet /> : null;
};

export default memo(ProtectedRoute);
