import React, { memo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useCreateSkill, useUpdateSkill, useAdminSkills } from "../hooks/useAdminSkills";
import "../../styles/AdminSkills.css";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  icon_key: z.string().min(1, "Icon Key is required"),
});

const SkillForm = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: skills = [] } = useAdminSkills();
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleCancel = useCallback(() => {
    navigate("/admin/skills");
  }, [navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      icon_key: "",
    },
  });

  const existingSkill = skills.find(s => s.id === id);

  useEffect(() => {
    if (existingSkill) {
      reset({
        name: existingSkill.name || "",
        category: existingSkill.category || "",
        description: existingSkill.description || "",
        icon_key: existingSkill.icon_key || "",
      });
    }
  }, [existingSkill, reset]);

  const onSubmit = useCallback(
    (payload) => {

      if (isEditing) {
        updateMutation.mutate(
          { id, skillData: payload },
          { onSuccess: () => navigate("/admin/skills") }
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => navigate("/admin/skills")
        });
      }
    },
    [isEditing, id, updateMutation, createMutation, navigate]
  );

  if (id && !existingSkill) {
    return (
      <AdminLayout title="Edit Skill">
        <div style={{ padding: "32px", color: "#888" }}>Loading skill data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? "Edit Skill" : "New Skill"}>
      <div className="admin-skill-form">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="admin-skill-form__header">
          <h2 className="admin-skill-form__title">
            {isEditing ? "Edit Skill" : "Add Skill"}
          </h2>
          <p className="admin-skill-form__sub">
            {isEditing
              ? "Update skill details below."
              : "Fill in the details to add a new skill."}
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────── */}
        <form
          id="admin-skill-form"
          className="admin-skill-form__body"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >

          {/* Name */}
          <div className="admin-form-field">
            <label htmlFor="skill-name" className="admin-form-field__label">
              Name <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="skill-name"
              type="text"
              className={`admin-form-field__input ${errors.name ? "admin-form-field__input--error" : ""}`}
              placeholder="e.g. React"
              autoComplete="off"
              {...register("name")}
            />
            {errors.name && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.name.message}</span>}
          </div>

          {/* Category */}
          <div className="admin-form-field">
            <label htmlFor="skill-category" className="admin-form-field__label">
              Category <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="skill-category"
              type="text"
              className={`admin-form-field__input ${errors.category ? "admin-form-field__input--error" : ""}`}
              placeholder="e.g. Frontend, Backend, Cloud, 3D"
              autoComplete="off"
              {...register("category")}
            />
            {errors.category && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.category.message}</span>}
            <span className="admin-form-field__hint">
              Used to group skills on the public page.
            </span>
          </div>

          {/* Description */}
          <div className="admin-form-field">
            <label htmlFor="skill-description" className="admin-form-field__label">
              Description <span className="admin-form-field__required">*</span>
            </label>
            <textarea
              id="skill-description"
              className={`admin-form-field__textarea ${errors.description ? "admin-form-field__input--error" : ""}`}
              placeholder="Brief description of this skill..."
              rows={3}
              {...register("description")}
            />
            {errors.description && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.description.message}</span>}
          </div>

          {/* Icon Key */}
          <div className="admin-form-field">
            <label htmlFor="skill-icon-key" className="admin-form-field__label">
              Icon Key <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="skill-icon-key"
              type="text"
              className={`admin-form-field__input ${errors.icon_key ? "admin-form-field__input--error" : ""}`}
              placeholder="e.g. FaReact, FaNodeJs, SiBlender"
              autoComplete="off"
              {...register("icon_key")}
            />
            {errors.icon_key && <span style={{ color: "#ff4444", fontSize: "12px", marginTop: "4px" }}>{errors.icon_key.message}</span>}
            <span className="admin-form-field__hint">
              Must match a key in the public icon map (react-icons).
            </span>
          </div>

          {/* ── Actions ──────────────────────────────────────── */}
          <div className="admin-skill-form__actions">
            <button
              id="admin-skill-save-btn"
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : (isEditing ? "Save Changes" : "Add Skill")}
            </button>
            <button
              id="admin-skill-cancel-btn"
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

export default memo(SkillForm);
