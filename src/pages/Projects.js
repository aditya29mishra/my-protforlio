import React, { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useProgressiveItems } from "../hooks/useProgressiveItems";
import ProjectPopup from "./ProjectPopup";
import SmartImage from "../components/SmartImage";
import "../styles/Projects.css";

const Projects = () => {

  const [activeProject,setActiveProject] = useState(null);
  const { projects, loading, error } = useProjects();
  const visibleProjects = useProgressiveItems(projects, 6, 6);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects</div>;

  return (

    <div className="projects-container">

      <div className="projects-grid">

        {visibleProjects.map((project,index)=>(
          
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

            <SmartImage
              src={project.image}
              alt={project.title}
              className="project-image"
              aspectRatio="16 / 9"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
