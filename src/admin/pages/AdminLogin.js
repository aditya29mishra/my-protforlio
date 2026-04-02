import React, { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/admin/authAdminService";
import "../../styles/AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value);
    setError(""); // clear error on type
  }, []);

  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
    setError(""); // clear error on type
  }, []);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      
      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }

      setIsLoggingIn(true);
      setError("");

      try {
        await loginAdmin(email, password);
        navigate("/admin/dashboard", { replace: true });
      } catch (err) {
        setError(err.message || "Failed to sign in. Please check your credentials.");
        setIsLoggingIn(false);
      }
    },
    [email, password, navigate]
  );

  return (
    <div className="admin-login__backdrop">
      <div className="admin-login__card">

        <div className="admin-login__header">
          <div className="admin-login__logo-mark" aria-hidden="true" />
          <h1 className="admin-login__title">Admin Panel</h1>
          <p className="admin-login__subtitle">Sign in to continue</p>
        </div>

        <form className="admin-login__form" onSubmit={handleLogin} noValidate>
          <div className="admin-login__field">
            <label htmlFor="admin-email" className="admin-login__label">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="admin-login__input"
              placeholder="admin@example.com"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-login__field">
            <label htmlFor="admin-password" className="admin-login__label">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="admin-login__input"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="admin-login__error" style={{ color: "#e50914", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
              {error}
            </div>
          )}

          <button
            id="admin-login-submit"
            type="submit"
            className="admin-login__button"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Signing In..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default memo(AdminLogin);
