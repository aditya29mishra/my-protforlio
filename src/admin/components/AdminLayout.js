import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdFolderOpen,
  MdBuild,
  MdTimeline,
  MdArticle,
  MdLogout,
} from "react-icons/md";
import "../../styles/AdminLayout.css";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard", Icon: MdDashboard },
  { label: "Projects",  to: "/admin/projects",  Icon: MdFolderOpen },
  { label: "Skills",    to: "/admin/skills",    Icon: MdBuild },
  { label: "Timeline",  to: "/admin/timeline",  Icon: MdTimeline },
  { label: "Content",   to: "/admin/content",   Icon: MdArticle },
];

const AdminLayout = ({ children, title = "Admin Panel" }) => {
  return (
    <div className="admin-layout">

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="admin-layout__sidebar">

        <div className="admin-layout__brand">
          <div className="admin-layout__logo-mark" aria-hidden="true" />
          <span className="admin-layout__brand-name">CMS</span>
        </div>

        <nav className="admin-layout__nav" aria-label="Admin navigation">
          <ul className="admin-layout__nav-list">
            {NAV_ITEMS.map(({ label, to, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `admin-layout__nav-link${isActive ? " admin-layout__nav-link--active" : ""}`
                  }
                >
                  <Icon className="admin-layout__nav-icon" aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-layout__sidebar-footer">
          <button
            id="admin-logout-btn"
            className="admin-layout__logout-btn"
            type="button"
            disabled
            title="Logout (Phase 1F)"
          >
            <MdLogout className="admin-layout__nav-icon" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* ── Body = Topbar + Content ───────────────────────── */}
      <div className="admin-layout__body">

        <header className="admin-layout__topbar">
          <h1 className="admin-layout__page-title">{title}</h1>
          <div className="admin-layout__topbar-meta">
            <span className="admin-layout__topbar-badge">Admin</span>
          </div>
        </header>

        <main className="admin-layout__content">
          {children}
        </main>

      </div>
    </div>
  );
};

export default memo(AdminLayout);
