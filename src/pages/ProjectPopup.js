import React, { useState, useEffect, useCallback } from "react";
import SmartImage from "../components/SmartImage";
import "../styles/ProjectPopup.css";

const ProjectPopup = ({ project, close }) => {

  const [showVideo,setShowVideo] = useState(false);
  const handlePlayVideo = useCallback(() => {
    window.open(
      `https://youtube.com/watch?v=${project.video}`,
      "_blank"
    );
  }, [project.video]);

  useEffect(()=>{

    const escHandler = (e)=>{
      if(e.key==="Escape"){
        close();
      }
    };

    window.addEventListener("keydown",escHandler);

    if(project.video){
      const timer=setTimeout(()=>{
        setShowVideo(true);
      },2000);

      return ()=>{
        clearTimeout(timer);
        window.removeEventListener("keydown",escHandler);
      };
    }

  },[project,close]);

  return(

    <div className="popup-overlay" onClick={close}>

      <div
        className="popup-container"
        onClick={(e)=>e.stopPropagation()}
      >

        <button
          className="popup-close"
          onClick={close}
        >
          ✕
        </button>

        <div className="popup-banner">

          {!showVideo && (
            <SmartImage
              src={project.image}
              alt={project.title}
              wrapperClassName="popup-banner-image"
              style={{ width: "100%", height: "100%" }}
              priority
            />
          )}

          {showVideo && project.video && (
            <iframe
              src={`https://www.youtube.com/embed/${project.video}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1`}
              title={project.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="popup-video"
            />
          )}

          <div className="popup-banner-content">

            <h1 className="popup-title">
              {project.title}
            </h1>

            <div className="popup-buttons">

              {project.video && (
                <button
                  className="play-button"
                  onClick={handlePlayVideo}
                >
                  ▶ Play
                </button>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="github-button"
                >
                  GitHub
                </a>
              )}

            </div>

          </div>

        </div>

        <div className="popup-content">

          <div className="popup-left">

            <p className="popup-description">
              {project.description}
            </p>

          </div>

          <div className="popup-right">

            <h3>Tech Stack</h3>

            <div className="tech-stack">

              {project.techUsed
                .split(",")
                .map((tech,i)=>(
                  <span key={i}>
                    {tech.trim()}
                  </span>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProjectPopup;
