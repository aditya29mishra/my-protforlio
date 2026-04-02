import React, { memo, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import "../../styles/AdminSkills.css";

// Exact DB schema fields for public.skills (write layer)
const EMPTY_FORM = {
  name:        "",
  category:    "",
  description: "",
  icon_key:    "",
};

const SkillForm = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const handleCancel = useCallback(() => {
    navigate("/admin/skills");
  }, [navigate]);

  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      // Phase 2: call createSkill / updateSkill from admin service here
      console.log("Skill form submitted", form);
    },
    [form]
  );

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
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Name */}
          <div className="admin-form-field">
            <label htmlFor="skill-name" className="admin-form-field__label">
              Name <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="skill-name"
              name="name"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. React"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          {/* Category */}
          <div className="admin-form-field">
            <label htmlFor="skill-category" className="admin-form-field__label">
              Category <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="skill-category"
              name="category"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. Frontend, Backend, Cloud, 3D"
              value={form.category}
              onChange={handleChange}
              required
              autoComplete="off"
            />
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
              name="description"
              className="admin-form-field__textarea"
              placeholder="Brief description of this skill..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          {/* Icon Key */}
          <div className="admin-form-field">
            <label htmlFor="skill-icon-key" className="admin-form-field__label">
              Icon Key <span className="admin-form-field__required">*</span>
            </label>
            <input
              id="skill-icon-key"
              name="icon_key"
              type="text"
              className="admin-form-field__input"
              placeholder="e.g. FaReact, FaNodeJs, SiBlender"
              value={form.icon_key}
              onChange={handleChange}
              required
              autoComplete="off"
            />
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
            >
              {isEditing ? "Save Changes" : "Add Skill"}
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
