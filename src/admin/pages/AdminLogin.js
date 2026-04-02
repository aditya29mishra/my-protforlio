import React, { memo, useCallback, useState } from "react";
import "../../styles/AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  const handleLogin = useCallback(
    (event) => {
      event.preventDefault();
      // Phase 1C: auth logic will be connected here
      console.log("Login submitted", { email });
    },
    [email]
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

          <button
            id="admin-login-submit"
            type="submit"
            className="admin-login__button"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
};

export default memo(AdminLogin);
