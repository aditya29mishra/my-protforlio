import React, { memo, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdUpload } from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import "../../styles/AdminProjects.css";

// Exact DB schema fields for public.projects (write layer)
const EMPTY_FORM = {
  title: "",
  description: "",
  image_media_id: null,   // resolved in Phase 2 via media upload service
  github_url: "",
  youtube_video_id: "",
  status: "draft",
};

const STATUS_OPTIONS = [
  { value: "draft",     label: "Draft" },
  { value: "published", label: "Published" },
];

const ProjectForm = () => {
  const { id } = useParams();            // present on /admin/projects/:id
  const navigate = useNavigate();
  const isEditing = Boolean(id);         // /projects/new → no id → create mode

  const handleCancel = useCallback(() => {
    navigate("/admin/projects");
  }, [navigate]);

  // Seed form with empty state (edit pre-fill comes from backend in Phase 2)
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      // Phase 2: call createProject / updateProject from admin service here
      console.log("Form submitted", form);
    },
    [form]
  );

  return (
    <AdminLayout title={isEditing ? "Edit Project" : "New Project"}>
      <div className="admin-project-form">

        {/* ── Form Header ──────────────────────────────────── */}
        <div className="admin-project-form__header">
          <h2 className="admin-project-form__title">
            {isEditing ? "Edit Project" : "Create Project"}
          </h2>
          <p className="admin-project-form__sub">
            {isEditing
              ? "Update the fields below and save."
              : "Fill in the details to add a new project."}
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────── */}
        <form
          id="admin-project-form"
          className="admin-project-form__body"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Title */}
          <div className="admin-form-field">
            <label htmlFor="project-title" className="admin-form-field__label">
              Title <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="project-title"
              name="title"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. Portfolio Website"
              value={form.title}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          {/* Description */}
          <div className="admin-form-field">
            <label htmlFor="project-description" className="admin-form-field__label">
              Description <span className="admin-form-field__required">*</span>
            </label>
            <textarea
              id="project-description"
              name="description"
              className="admin-form-field__textarea"
              placeholder="Brief description of the project..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          {/* Image Upload Placeholder (image_media_id) */}
          <div className="admin-form-field">
            <label className="admin-form-field__label">
              Project Image
            </label>
            <div className="admin-form-field__upload-zone" aria-label="Image upload zone">
              <MdUpload className="admin-form-field__upload-icon" aria-hidden="true" />
              <p className="admin-form-field__upload-text">
                Upload functionality — Phase 2 (media service)
              </p>
              <p className="admin-form-field__upload-hint">
                PNG, JPG, WebP · Max 5MB
              </p>
            </div>
          </div>

          {/* GitHub URL */}
          <div className="admin-form-field">
            <label htmlFor="project-github" className="admin-form-field__label">
              GitHub URL
            </label>
            <input
              id="project-github"
              name="github_url"
              type="url"
              className="admin-form-field__input"
              placeholder="https://github.com/username/repo"
              value={form.github_url}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          {/* YouTube Video ID */}
          <div className="admin-form-field">
            <label htmlFor="project-youtube" className="admin-form-field__label">
              YouTube Video ID
            </label>
            <input
              id="project-youtube"
              name="youtube_video_id"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. dQw4w9WgXcQ"
              value={form.youtube_video_id}
              onChange={handleChange}
              autoComplete="off"
            />
            <span className="admin-form-field__hint">
              The ID from youtube.com/watch?v=<strong>[ID]</strong>
            </span>
          </div>

          {/* Status */}
          <div className="admin-form-field">
            <label htmlFor="project-status" className="admin-form-field__label">
              Status <span className="admin-form-field__required">*</span>
            </label>
            <select
              id="project-status"
              name="status"
              className="admin-form-field__select"
              value={form.status}
              onChange={handleChange}
              required
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* ── Form Actions ──────────────────────────────── */}
          <div className="admin-project-form__actions">
            <button
              id="admin-project-save-btn"
              type="submit"
              className="admin-btn admin-btn--primary"
            >
              {isEditing ? "Save Changes" : "Create Project"}
            </button>
            <button
              id="admin-project-cancel-btn"
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

export default memo(ProjectForm);
