import React, { memo } from "react";
import {
  MdFolderOpen,
  MdBuild,
  MdTimeline,
  MdArticle,
} from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import "../../styles/Dashboard.css";

const STAT_CARDS = [
  {
    id: "stat-projects",
    label: "Projects",
    description: "Published portfolio projects",
    Icon: MdFolderOpen,
  },
  {
    id: "stat-skills",
    label: "Skills",
    description: "Active skills on display",
    Icon: MdBuild,
  },
  {
    id: "stat-timeline",
    label: "Timeline Entries",
    description: "Work & education history",
    Icon: MdTimeline,
  },
  {
    id: "stat-content",
    label: "Content Items",
    description: "Music & reading records",
    Icon: MdArticle,
  },
];

const QUICK_LINKS = [
  { label: "Manage Projects",  to: "/admin/projects",  description: "Add, edit or remove projects" },
  { label: "Manage Skills",    to: "/admin/skills",    description: "Update your skills list" },
  { label: "Manage Timeline",  to: "/admin/timeline",  description: "Edit work and education entries" },
  { label: "Manage Content",   to: "/admin/content",   description: "Update music and reading items" },
];

const Dashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">

        {/* ── Welcome ──────────────────────────────────────── */}
        <section className="admin-dashboard__welcome">
          <div>
            <h2 className="admin-dashboard__welcome-title">Welcome back</h2>
            <p className="admin-dashboard__welcome-sub">
              Manage your portfolio content from the sections below.
            </p>
          </div>
        </section>

        {/* ── Stat Cards ───────────────────────────────────── */}
        <section className="admin-dashboard__section">
          <h3 className="admin-dashboard__section-title">Overview</h3>
          <div className="admin-dashboard__stat-grid">
            {STAT_CARDS.map(({ id, label, description, Icon }) => (
              <div key={id} id={id} className="admin-dashboard__stat-card">
                <div className="admin-dashboard__stat-icon-wrap">
                  <Icon className="admin-dashboard__stat-icon" aria-hidden="true" />
                </div>
                <div className="admin-dashboard__stat-body">
                  <span className="admin-dashboard__stat-label">{label}</span>
                  <span className="admin-dashboard__stat-desc">{description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Links ──────────────────────────────────── */}
        <section className="admin-dashboard__section">
          <h3 className="admin-dashboard__section-title">Quick Access</h3>
          <div className="admin-dashboard__quick-grid">
            {QUICK_LINKS.map(({ label, to, description }) => (
              <div key={to} className="admin-dashboard__quick-card">
                <span className="admin-dashboard__quick-label">{label}</span>
                <span className="admin-dashboard__quick-desc">{description}</span>
                <span className="admin-dashboard__quick-arrow" aria-hidden="true">→</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AdminLayout>
  );
};

export default memo(Dashboard);
