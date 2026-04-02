import React from 'react';
import '../styles/Skills.css';
import { useSkills } from '../hooks/useSkills';
import { FaReact, FaNodeJs, FaAws, FaDocker, FaGithub, FaHtml5, FaJs } from 'react-icons/fa';
import { SiBlender, SiUnity, SiKotlin, SiFirebase, SiAndroid, SiNetlify } from 'react-icons/si';

// Map of icons for skills
const iconMap = {
  FaReact: <FaReact />,
  FaNodeJs: <FaNodeJs />,
  FaAws: <FaAws />,
  FaDocker: <FaDocker />,
  FaGithub: <FaGithub />,
  FaHtml5: <FaHtml5 />,
  FaJs: <FaJs />,
  SiBlender: <SiBlender />,
  SiUnity: <SiUnity />,
  SiKotlin: <SiKotlin />,
  SiFirebase: <SiFirebase />,
  SiAndroid: <SiAndroid />,
  SiNetlify: <SiNetlify />,
};

const Skills = () => {
  const { skills, loading, error } = useSkills();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="skills-container">
      <h1 className="skills-title">My Skills</h1>
      {Object.keys(skillsByCategory).map((category, index) => (
        <div key={index} className="skill-category">
          <h3 className="category-title">{category}</h3>
          <div className="skills-grid">
            {skillsByCategory[category].map((skill, idx) => (
              <div key={idx} className="skill-card">
                <div className="icon">{iconMap[skill.iconKey] || <FaReact />}</div>
                <h3 className="skill-name">
                  {skill.name.split('').map((letter, i) => (
                    <span
                      key={i}
                      className="letter"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </h3>
                <p className="skill-description">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
