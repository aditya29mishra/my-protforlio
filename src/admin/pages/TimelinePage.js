import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import "../../styles/AdminTimeline.css";

// Placeholder rows — replaced by real data once hooks are wired (Phase 2)
const PLACEHOLDER_ROWS = [
  {
    id: "1",
    organization_name: "Acme Corp",
    role_title: "Frontend Developer",
    date_range: "2023 – Present",
    entry_type: "work",
  },
  {
    id: "2",
    organization_name: "State University",
    role_title: "B.Tech Computer Science",
    date_range: "2019 – 2023",
    entry_type: "education",
  },
  {
    id: "3",
    organization_name: "Startup Inc.",
    role_title: "Intern – Full Stack",
    date_range: "2022 – 2022",
    entry_type: "work",
  },
];

const EntryTypeBadge = memo(({ type }) => (
  <span className={`admin-timeline__badge admin-timeline__badge--${type}`}>
    {type}
  </span>
));

const TimelinePage = () => {
  const navigate = useNavigate();

  const handleCreateNew = useCallback(() => {
    navigate("/admin/timeline/new");
  }, [navigate]);

  const handleEdit = useCallback(
    (entryId) => {
      navigate(`/admin/timeline/${entryId}`);
    },
    [navigate]
  );

  return (
    <AdminLayout title="Timeline">
      <div className="admin-timeline">

        {/* ── Page Header ──────────────────────────────────── */}
        <div className="admin-timeline__header">
          <div>
            <h2 className="admin-timeline__title">Timeline</h2>
            <p className="admin-timeline__sub">Work and education history</p>
          </div>
          <button
            id="admin-add-timeline-btn"
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleCreateNew}
          >
            <MdAdd aria-hidden="true" />
            Add Entry
          </button>
        </div>

        {/* ── Table ────────────────────────────────────────── */}
        <div className="admin-timeline__table-wrap">
          <table className="admin-timeline__table">
            <thead>
              <tr>
                <th className="admin-timeline__th">Organization</th>
                <th className="admin-timeline__th">Role / Title</th>
                <th className="admin-timeline__th">Date Range</th>
                <th className="admin-timeline__th">Type</th>
                <th className="admin-timeline__th admin-timeline__th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_ROWS.map((entry) => (
                <tr key={entry.id} className="admin-timeline__row">

                  <td className="admin-timeline__td">
                    <span className="admin-timeline__org">{entry.organization_name}</span>
                  </td>

                  <td className="admin-timeline__td">
                    <span className="admin-timeline__role">{entry.role_title}</span>
                  </td>

                  <td className="admin-timeline__td">
                    <span className="admin-timeline__date">{entry.date_range}</span>
                  </td>

                  <td className="admin-timeline__td">
                    <EntryTypeBadge type={entry.entry_type} />
                  </td>

                  <td className="admin-timeline__td admin-timeline__td--actions">
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--edit"
                      onClick={() => handleEdit(entry.id)}
                      aria-label={`Edit ${entry.organization_name}`}
                    >
                      <MdEdit aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--delete"
                      aria-label={`Delete ${entry.organization_name}`}
                    >
                      <MdDelete aria-hidden="true" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
};

export default memo(TimelinePage);
