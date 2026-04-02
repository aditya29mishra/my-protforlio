import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import { useAdminTimeline, useDeleteTimeline } from "../hooks/useAdminTimeline";
import "../../styles/AdminTimeline.css";

const EntryTypeBadge = memo(({ type }) => (
  <span className={`admin-timeline__badge admin-timeline__badge--${type}`}>
    {type}
  </span>
));

const TimelinePage = () => {
  const navigate = useNavigate();
  const { data: timeline = [], isLoading } = useAdminTimeline();
  const deleteMutation = useDeleteTimeline();

  const handleCreateNew = useCallback(() => {
    navigate("/admin/timeline/new");
  }, [navigate]);

  const handleEdit = useCallback(
    (entryId) => {
      navigate(`/admin/timeline/${entryId}`);
    },
    [navigate]
  );

  const handleDelete = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  if (isLoading) {
    return (
      <AdminLayout title="Timeline">
        <div style={{ padding: "32px", color: "#888" }}>Loading timeline...</div>
      </AdminLayout>
    );
  }

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
              {!timeline.length ? (
                <tr>
                  <td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                    No entries found
                  </td>
                </tr>
              ) : (
                timeline.map((entry) => (
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
                        onClick={() => handleDelete(entry.id)}
                        aria-label={`Delete ${entry.organization_name}`}
                        disabled={deleteMutation.isPending}
                      >
                        <MdDelete aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
};

export default memo(TimelinePage);
