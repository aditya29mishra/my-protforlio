import React, { memo, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdUpload } from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import UploadModal from "../components/UploadModal";
import { useCreateProject, useUpdateProject } from "../hooks/useAdminProjects";
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

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Media system integration state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [imageMedia, setImageMedia] = useState(null);

  const handleCancel = useCallback(() => {
    navigate("/admin/projects");
  }, [navigate]);

  // Seed form with empty state (edit pre-fill comes from backend in Phase 2)
  const [form, setForm] = useState(EMPTY_FORM);

  const handleMediaSelect = useCallback((media) => {
    setImageMedia(media);
    setForm((prev) => ({
      ...prev,
      image_media_id: media.id,
    }));
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const payload = {
        title: form.title,
        description: form.description,
        image_media_id: form.image_media_id,
        github_url: form.github_url,
        youtube_video_id: form.youtube_video_id,
        status: form.status,
      };

      if (isEditing) {
        updateMutation.mutate(
          { id, projectData: payload },
          { onSuccess: () => navigate("/admin/projects") }
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => navigate("/admin/projects")
        });
      }
    },
    [form, isEditing, id, updateMutation, createMutation, navigate]
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

          {/* Image Upload Zone */}
          <div className="admin-form-field">
            <label className="admin-form-field__label">Project Image</label>
            {imageMedia ? (
              <img
                src={imageMedia.url}
                alt="Preview"
                style={{ width: "100%", borderRadius: "6px", border: "1px solid #2a2a2a" }}
              />
            ) : (
              <button 
                type="button" 
                className="admin-btn admin-btn--secondary" 
                onClick={() => setIsUploadOpen(true)}
              >
                <MdUpload aria-hidden="true" style={{ fontSize: "16px" }} />
                Upload Image
              </button>
            )}
            <span className="admin-form-field__hint">
              Selected image will be optimized to WebP automatically.
            </span>
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
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : (isEditing ? "Save Changes" : "Create Project")}
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

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSelect={handleMediaSelect}
        prefix={`projects/${form.title ? form.title.toLowerCase().replace(/[^a-z0-9]/g, "-") : "untitled"}`}
        defaultLabel={form.title || "Project Image"}
      />
    </AdminLayout>
  );
};

export default memo(ProjectForm);
