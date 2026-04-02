import React, { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import ProjectPopup from "./ProjectPopup";
import "../styles/Projects.css";

const Projects = () => {

  const [activeProject,setActiveProject] = useState(null);
  const { projects, loading, error } = useProjects();

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects</div>;

  return (

    <div className="projects-container">

      <div className="projects-grid">

        {projects.map((project,index)=>(
          
          <div
            key={project.id || project.slug || index}
            className="project-card"
            tabIndex="0"

            onClick={()=>setActiveProject(project)}

            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                setActiveProject(project);
              }
            }}

          >

            <img
              src={project.image}
              alt={project.title}
              className="project-image"
              loading="lazy"
            />

            <div className="project-title">
              {project.title}
            </div>

          </div>

        ))}

      </div>

      {activeProject && (
        <ProjectPopup
          project={activeProject}
          close={()=>setActiveProject(null)}
        />
      )}

    </div>

  );

};

export default Projects;
