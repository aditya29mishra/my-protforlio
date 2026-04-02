import React, { memo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useCreateTimeline, useUpdateTimeline, useAdminTimeline } from "../hooks/useAdminTimeline";
import "../../styles/AdminTimeline.css";

const timelineSchema = z.object({
  organization_name: z.string().min(1, "Organization Name is required"),
  entry_type: z.enum(["work", "education"]),
  role_title: z.string().min(1, "Role and Title is required"),
  tech_stack: z.string().optional(),
  date_range: z.string().min(1, "Date Range is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
});

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      organization_name: "",
      entry_type: "work",
      role_title: "",
      tech_stack: "",
      date_range: "",
      summary: "",
    },
  });

  const existingEntry = timeline.find(t => t.id === id);

  useEffect(() => {
    if (existingEntry) {
      reset({
        organization_name: existingEntry.organization_name || "",
        entry_type:        existingEntry.entry_type || "work",
        role_title:        existingEntry.role_title || "",
        tech_stack:        existingEntry.tech_stack || "",
        date_range:        existingEntry.date_range || "",
        summary:           existingEntry.summary || "",
      });
    }
  }, [existingEntry, reset]);

  const onSubmit = useCallback(
    (payload) => {

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
    [isEditing, id, updateMutation, createMutation, navigate]
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
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >

          {/* Organization Name */}
          <div className="admin-form-field">
            <label htmlFor="timeline-org" className="admin-form-field__label">
              Organization Name <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="timeline-org"
              type="text"
              className={`admin-form-field__input ${errors.organization_name ? "admin-form-field__input--error" : ""}`}
              placeholder="e.g. Acme Corp, State University"
              autoComplete="off"
              {...register("organization_name")}
            />
            {errors.organization_name && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.organization_name.message}</span>}
          </div>

          {/* Entry Type */}
          <div className="admin-form-field">
            <label htmlFor="timeline-type" className="admin-form-field__label">
              Entry Type <span className="admin-form-field__required">*</span>
            </label>
            <select
              id="timeline-type"
              className="admin-form-field__select"
              {...register("entry_type")}
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
              type="text"
              className={`admin-form-field__input ${errors.role_title ? "admin-form-field__input--error" : ""}`}
              placeholder="e.g. Frontend Developer, B.Tech Computer Science"
              autoComplete="off"
              {...register("role_title")}
            />
            {errors.role_title && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.role_title.message}</span>}
          </div>

          {/* Tech Stack */}
          <div className="admin-form-field">
            <label htmlFor="timeline-tech" className="admin-form-field__label">
              Tech Stack
            </label>
            <input
              id="timeline-tech"
              type="text"
              className={`admin-form-field__input ${errors.tech_stack ? "admin-form-field__input--error" : ""}`}
              placeholder="e.g. React, Node.js, AWS"
              autoComplete="off"
              {...register("tech_stack")}
            />
            {errors.tech_stack && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.tech_stack.message}</span>}
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
              type="text"
              className={`admin-form-field__input ${errors.date_range ? "admin-form-field__input--error" : ""}`}
              placeholder="e.g. Jan 2022 – Mar 2024"
              autoComplete="off"
              {...register("date_range")}
            />
            {errors.date_range && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.date_range.message}</span>}
          </div>

          {/* Summary */}
          <div className="admin-form-field">
            <label htmlFor="timeline-summary" className="admin-form-field__label">
              Summary <span className="admin-form-field__required">*</span>
            </label>
            <textarea
              id="timeline-summary"
              className={`admin-form-field__textarea ${errors.summary ? "admin-form-field__input--error" : ""}`}
              placeholder="Key responsibilities or achievements..."
              rows={4}
              {...register("summary")}
            />
            {errors.summary && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.summary.message}</span>}
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
