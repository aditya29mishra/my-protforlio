import React, { memo, useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useCreateTimeline, useUpdateTimeline, useAdminTimeline } from "../hooks/useAdminTimeline";
import "../../styles/AdminTimeline.css";

// Exact DB schema fields for public.timeline_entries (write layer)
const EMPTY_FORM = {
  organization_name: "",
  entry_type:        "work",    // CHECK (entry_type in ('work', 'education'))
  role_title:        "",
  tech_stack:        "",
  date_range:        "",
  summary:           "",
};

const ENTRY_TYPE_OPTIONS = [
  { value: "work",      label: "Work"      },
  { value: "education", label: "Education" },
];

const TimelineForm = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isEditing = Boolean(id);

  const { data: timeline = [] } = useAdminTimeline();
  const createMutation = useCreateTimeline();
  const updateMutation = useUpdateTimeline();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleCancel = useCallback(() => {
    navigate("/admin/timeline");
  }, [navigate]);

  const [form, setForm] = useState(EMPTY_FORM);

  const existingEntry = timeline.find(t => t.id === id);

  useEffect(() => {
    if (existingEntry) {
      setForm({
        organization_name: existingEntry.organization_name || "",
        entry_type:        existingEntry.entry_type || "work",
        role_title:        existingEntry.role_title || "",
        tech_stack:        existingEntry.tech_stack || "",
        date_range:        existingEntry.date_range || "",
        summary:           existingEntry.summary || "",
      });
    }
  }, [existingEntry]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const payload = { ...form };

      if (isEditing) {
        updateMutation.mutate(
          { id, timelineData: payload },
          { onSuccess: () => navigate("/admin/timeline") }
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => navigate("/admin/timeline")
        });
      }
    },
    [form, isEditing, id, updateMutation, createMutation, navigate]
  );

  if (id && !existingEntry) {
    return (
      <AdminLayout title="Edit Entry">
        <div style={{ padding: "32px", color: "#888" }}>Loading entry data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? "Edit Entry" : "New Entry"}>
      <div className="admin-timeline-form">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="admin-timeline-form__header">
          <h2 className="admin-timeline-form__title">
            {isEditing ? "Edit Timeline Entry" : "Add Timeline Entry"}
          </h2>
          <p className="admin-timeline-form__sub">
            {isEditing
              ? "Update the entry details below."
              : "Add a new work or education entry."}
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────── */}
        <form
          id="admin-timeline-form"
          className="admin-timeline-form__body"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Organization Name */}
          <div className="admin-form-field">
            <label htmlFor="timeline-org" className="admin-form-field__label">
              Organization Name <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="timeline-org"
              name="organization_name"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. Acme Corp, State University"
              value={form.organization_name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          {/* Entry Type */}
          <div className="admin-form-field">
            <label htmlFor="timeline-type" className="admin-form-field__label">
              Entry Type <span className="admin-form-field__required">*</span>
            </label>
            <select
              id="timeline-type"
              name="entry_type"
              className="admin-form-field__select"
              value={form.entry_type}
              onChange={handleChange}
              required
            >
              {ENTRY_TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Role / Title */}
          <div className="admin-form-field">
            <label htmlFor="timeline-role" className="admin-form-field__label">
              Role / Title <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="timeline-role"
              name="role_title"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. Frontend Developer, B.Tech Computer Science"
              value={form.role_title}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          {/* Tech Stack */}
          <div className="admin-form-field">
            <label htmlFor="timeline-tech" className="admin-form-field__label">
              Tech Stack
            </label>
            <input
              id="timeline-tech"
              name="tech_stack"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. React, Node.js, AWS"
              value={form.tech_stack}
              onChange={handleChange}
              autoComplete="off"
            />
            <span className="admin-form-field__hint">
              Comma-separated list of technologies used.
            </span>
          </div>

          {/* Date Range */}
          <div className="admin-form-field">
            <label htmlFor="timeline-date" className="admin-form-field__label">
              Date Range <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="timeline-date"
              name="date_range"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. Jan 2022 – Mar 2024"
              value={form.date_range}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          {/* Summary */}
          <div className="admin-form-field">
            <label htmlFor="timeline-summary" className="admin-form-field__label">
              Summary <span className="admin-form-field__required">*</span>
            </label>
            <textarea
              id="timeline-summary"
              name="summary"
              className="admin-form-field__textarea"
              placeholder="Key responsibilities or achievements..."
              value={form.summary}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          {/* ── Actions ──────────────────────────────────────── */}
          <div className="admin-timeline-form__actions">
            <button
              id="admin-timeline-save-btn"
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : (isEditing ? "Save Changes" : "Add Entry")}
            </button>
            <button
              id="admin-timeline-cancel-btn"
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default memo(TimelineForm);
