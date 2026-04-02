import React, { memo, useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { MdUpload } from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import UploadModal from "../components/UploadModal";
import { useCreateProject, useUpdateProject, useAdminProjects } from "../hooks/useAdminProjects";
import "../../styles/AdminProjects.css";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  github_url: z.string().url("Must be a valid URL").or(z.literal("")),
  youtube_video_id: z.string().optional(),
  status: z.enum(["draft", "published"]),
  image_media_id: z.string().uuid().nullable().optional(),
});

const STATUS_OPTIONS = [
  { value: "draft",     label: "Draft" },
  { value: "published", label: "Published" },
];

const ProjectForm = () => {
  const { id } = useParams();            // present on /admin/projects/:id
  const navigate = useNavigate();
  const isEditing = Boolean(id);         // /projects/new → no id → create mode

  const { data: projects = [] } = useAdminProjects();
  const existingProject = projects.find((p) => p.id === id);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Media system integration state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [imageMedia, setImageMedia] = useState(null);

  const handleCancel = useCallback(() => {
    navigate("/admin/projects");
  }, [navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      image_media_id: null,
      github_url: "",
      youtube_video_id: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (existingProject) {
      reset({
        title: existingProject.title || "",
        description: existingProject.description || "",
        image_media_id: existingProject.image_media_id || null,
        github_url: existingProject.github_url || "",
        youtube_video_id: existingProject.youtube_video_id || "",
        status: existingProject.status || "draft",
      });
      if (existingProject.media) {
        setImageMedia({ id: existingProject.image_media_id, url: existingProject.media.storage_path }); 
      }
    }
  }, [existingProject, reset]);

  const handleMediaSelect = useCallback(
    (media) => {
      setImageMedia(media);
      setValue("image_media_id", media.id, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = useCallback(
    (payload) => {

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
    [isEditing, id, updateMutation, createMutation, navigate]
  );

  if (id && !existingProject) {
    return (
      <AdminLayout title="Edit Project">
        <div style={{ padding: "32px", color: "#888" }}>Loading project data...</div>
      </AdminLayout>
    );
  }

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
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >

          {/* Title */}
          <div className="admin-form-field">
            <label htmlFor="project-title" className="admin-form-field__label">
              Title <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="project-title"
              type="text"
              className={`admin-form-field__input ${errors.title ? "admin-form-field__input--error" : ""}`}
              placeholder="e.g. Portfolio Website"
              autoComplete="off"
              {...register("title")}
            />
            {errors.title && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="admin-form-field">
            <label htmlFor="project-description" className="admin-form-field__label">
              Description <span className="admin-form-field__required">*</span>
            </label>
            <textarea
              id="project-description"
              className={`admin-form-field__textarea ${errors.description ? "admin-form-field__input--error" : ""}`}
              placeholder="Brief description of the project..."
              rows={4}
              {...register("description")}
            />
            {errors.description && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.description.message}</span>}
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
              type="url"
              className={`admin-form-field__input ${errors.github_url ? "admin-form-field__input--error" : ""}`}
              placeholder="https://github.com/username/repo"
              autoComplete="off"
              {...register("github_url")}
            />
            {errors.github_url && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.github_url.message}</span>}
          </div>

          {/* YouTube Video ID */}
          <div className="admin-form-field">
            <label htmlFor="project-youtube" className="admin-form-field__label">
              YouTube Video ID
            </label>
            <input
              id="project-youtube"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. dQw4w9WgXcQ"
              autoComplete="off"
              {...register("youtube_video_id")}
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
              className="admin-form-field__select"
              {...register("status")}
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
        prefix="projects/media"
        defaultLabel="Project Image"
      />
    </AdminLayout>
  );
};

export default memo(ProjectForm);
