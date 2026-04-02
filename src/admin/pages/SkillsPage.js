import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import { useAdminSkills, useDeleteSkill } from "../hooks/useAdminSkills";
import { toast } from "react-hot-toast";
import "../../styles/AdminSkills.css";

const SkillsPage = () => {
  const navigate = useNavigate();
  const { data: skills = [], isLoading } = useAdminSkills();
  const deleteMutation = useDeleteSkill();

  const handleCreateNew = useCallback(() => {
    navigate("/admin/skills/new");
  }, [navigate]);

  const handleEdit = useCallback(
    (skillId) => {
      navigate(`/admin/skills/${skillId}`);
    },
    [navigate]
  );
  
  const handleDelete = useCallback((id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span>Are you sure you want to delete this skill?</span>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button 
            onClick={() => {
              deleteMutation.mutate(id);
              toast.dismiss(t.id);
            }}
            style={{ padding: '4px 8px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Confirm
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ padding: '4px 8px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  }, [deleteMutation]);

  if (isLoading) {
    return (
      <AdminLayout title="Skills">
        <div style={{ padding: "32px", color: "#888" }}>Loading skills...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Skills">
      <div className="admin-skills">

        {/* ── Page Header ──────────────────────────────────── */}
        <div className="admin-skills__header">
          <div>
            <h2 className="admin-skills__title">Skills</h2>
            <p className="admin-skills__sub">Manage your active skills</p>
          </div>
          <button
            id="admin-add-skill-btn"
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleCreateNew}
          >
            <MdAdd aria-hidden="true" />
            Add Skill
          </button>
        </div>

        {/* ── Table ────────────────────────────────────────── */}
        <div className="admin-skills__table-wrap">
          <table className="admin-skills__table">
            <thead>
              <tr>
                <th className="admin-skills__th">Name</th>
                <th className="admin-skills__th">Category</th>
                <th className="admin-skills__th">Icon Key</th>
                <th className="admin-skills__th admin-skills__th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!skills.length ? (
                <tr>
                  <td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                    No skills found
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id} className="admin-skills__row">
                    <td className="admin-skills__td">
                      <span className="admin-skills__name">{skill.name}</span>
                    </td>

                    <td className="admin-skills__td">
                      <span className="admin-skills__category-badge">
                        {skill.category}
                      </span>
                    </td>

                    <td className="admin-skills__td">
                      <code className="admin-skills__icon-key">{skill.icon_key}</code>
                    </td>

                    <td className="admin-skills__td admin-skills__td--actions">
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--edit"
                        onClick={() => handleEdit(skill.id)}
                        aria-label={`Edit ${skill.name}`}
                      >
                        <MdEdit aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--delete"
                        onClick={() => handleDelete(skill.id)}
                        aria-label={`Delete ${skill.name}`}
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

export default memo(SkillsPage);
