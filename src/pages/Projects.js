import React, { useState } from "react";
import projects from "./ProjectsData";
import ProjectPopup from "./ProjectPopup";
import "../styles/Projects.css";

const Projects = () => {

  const [activeProject,setActiveProject] = useState(null);

  return (

    <div className="projects-container">

      <div className="projects-grid">

        {projects.map((project,index)=>(
          
          <div
            key={index}
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