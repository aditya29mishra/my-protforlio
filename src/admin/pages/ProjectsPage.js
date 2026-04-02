import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete, MdOpenInNew } from "react-icons/md";
import AdminLayout from "../components/AdminLayout";
import SmartImage from "../../components/SmartImage";
import { resolveMediaUrl } from "../../services/mediaUtils";
import { useAdminProjects, useDeleteProject } from "../hooks/useAdminProjects";
import "../../styles/AdminProjects.css";

const StatusBadge = memo(({ status }) => (
  <span className={`admin-projects__badge admin-projects__badge--${status}`}>
    {status}
  </span>
));

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useAdminProjects();
  const deleteMutation = useDeleteProject();

  const handleCreateNew = useCallback(() => {
    navigate("/admin/projects/new");
  }, [navigate]);

  const handleEdit = useCallback(
    (projectId) => {
      navigate(`/admin/projects/${projectId}`);
    },
    [navigate]
  );

  const handleDelete = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  if (isLoading) {
    return (
      <AdminLayout title="Projects">
        <div style={{ padding: "32px", color: "#888" }}>Loading projects...</div>
      </AdminLayout>
    );
  }

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
              {!projects.length ? (
                <tr>
                  <td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="admin-projects__row">
                    {/* Image thumbnail */}
                    <td className="admin-projects__td">
                      {project.media ? (
                        <div className="admin-projects__thumb" style={{ overflow: "hidden" }}>
                          <SmartImage
                            src={resolveMediaUrl(project.media)}
                            alt={project.title}
                            className="admin-projects__thumb-img"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <div className="admin-projects__thumb" aria-label="Project image placeholder" />
                      )}
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
                        onClick={() => handleDelete(project.id)}
                        aria-label={`Delete ${project.title}`}
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

export default memo(ProjectsPage);
