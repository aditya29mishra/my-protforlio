import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete, MdOpenInNew } from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import "../../styles/AdminProjects.css";

// Placeholder rows — replaced by real data once hooks are wired (Phase 2)
const PLACEHOLDER_ROWS = [
  {
    id: "1",
    title: "Portfolio Website",
    status: "published",
    github_url: "https://github.com/example/portfolio",
  },
  {
    id: "2",
    title: "Snake Race Game",
    status: "published",
    github_url: "",
  },
  {
    id: "3",
    title: "Space Exploration App",
    status: "draft",
    github_url: "https://github.com/example/space",
  },
];

const StatusBadge = memo(({ status }) => (
  <span className={`admin-projects__badge admin-projects__badge--${status}`}>
    {status}
  </span>
));

const ProjectsPage = () => {
  const navigate = useNavigate();

  const handleCreateNew = useCallback(() => {
    navigate("/admin/projects/new");
  }, [navigate]);

  const handleEdit = useCallback(
    (projectId) => {
      navigate(`/admin/projects/${projectId}`);
    },
    [navigate]
  );
  return (
    <AdminLayout title="Projects">
      <div className="admin-projects">

        {/* ── Page Header ──────────────────────────────────── */}
        <div className="admin-projects__header">
          <div>
            <h2 className="admin-projects__title">Projects</h2>
            <p className="admin-projects__sub">Manage your portfolio projects</p>
          </div>
          <button
            id="admin-create-project-btn"
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleCreateNew}
          >
            <MdAdd aria-hidden="true" />
            Create Project
          </button>
        </div>

        {/* ── Table ────────────────────────────────────────── */}
        <div className="admin-projects__table-wrap">
          <table className="admin-projects__table">
            <thead>
              <tr>
                <th className="admin-projects__th admin-projects__th--img">Image</th>
                <th className="admin-projects__th">Title</th>
                <th className="admin-projects__th">Status</th>
                <th className="admin-projects__th">GitHub</th>
                <th className="admin-projects__th admin-projects__th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_ROWS.map((project) => (
                <tr key={project.id} className="admin-projects__row">

                  {/* Image thumbnail */}
                  <td className="admin-projects__td">
                    <div
                      className="admin-projects__thumb"
                      aria-label="Project image placeholder"
                    />
                  </td>

                  {/* Title */}
                  <td className="admin-projects__td">
                    <span className="admin-projects__project-title">
                      {project.title}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="admin-projects__td">
                    <StatusBadge status={project.status} />
                  </td>

                  {/* GitHub */}
                  <td className="admin-projects__td">
                    {project.github_url ? (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-projects__link"
                      >
                        <MdOpenInNew aria-hidden="true" />
                        View
                      </a>
                    ) : (
                      <span className="admin-projects__empty">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="admin-projects__td admin-projects__td--actions">
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--edit"
                      onClick={() => handleEdit(project.id)}
                      aria-label={`Edit ${project.title}`}
                    >
                      <MdEdit aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--delete"
                      aria-label={`Delete ${project.title}`}
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

export default memo(ProjectsPage);
