import React, { memo, useCallback, useMemo, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useProgressiveItems } from "../hooks/useProgressiveItems";
import ProjectPopup from "./ProjectPopup";
import SmartImage from "../components/SmartImage";
import "../styles/Projects.css";

const Projects = () => {
  const [activeProject,setActiveProject] = useState(null);
  const { projects, loading, error } = useProjects();
  const visibleProjects = useProgressiveItems(projects, 6, 6);
  const projectLookup = useMemo(
    () =>
      new Map(
        visibleProjects.map((project) => [project.id || project.slug, project])
      ),
    [visibleProjects]
  );
  const handleProjectOpen = useCallback(
    (event) => {
      const projectKey = event.currentTarget.dataset.projectKey;

      if (!projectKey) {
        return;
      }

      const project = projectLookup.get(projectKey);

      if (project) {
        setActiveProject(project);
      }
    },
    [projectLookup]
  );

  const handleProjectKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      handleProjectOpen(event);
    },
    [handleProjectOpen]
  );
  const handleProjectClose = useCallback(() => {
    setActiveProject(null);
  }, []);

  const projectCards = useMemo(
    () =>
      visibleProjects.map((project, index) => {
        const projectKey = project.id || project.slug || String(index);

        return (
          <div
            key={projectKey}
            data-project-key={projectKey}
            className="project-card"
            tabIndex="0"
            onClick={handleProjectOpen}
            onKeyDown={handleProjectKeyDown}
          >
            <SmartImage
              src={project.image}
              alt={project.title}
              className="project-image"
              aspectRatio="16 / 9"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 2}
            />

            <div className="project-title">
              {project.title}
            </div>
          </div>
        );
      }),
    [handleProjectKeyDown, handleProjectOpen, visibleProjects]
  );

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="projects-container">
      <div className="projects-grid">
        {projectCards}
      </div>

      {activeProject && (
        <ProjectPopup
          project={activeProject}
          close={handleProjectClose}
        />
      )}
    </div>
  );
};

export default memo(Projects);
