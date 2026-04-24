import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";
import SectionWrapper from "../hoc/SectionWrapper";
import { useSkills } from "../hooks/useSkills";
import { 
  FaReact, FaNodeJs, FaAws, FaDocker, FaGithub, FaHtml5, FaJs 
} from 'react-icons/fa';
import { 
  SiBlender, SiUnity, SiKotlin, SiFirebase, SiAndroid, SiNetlify 
} from 'react-icons/si';
import SkillSphereCanvas from "./canvas/SkillSphere";

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

const Tech = () => {
  const { skills, loading, error } = useSkills();

  if (loading) return null;

  if (error) {
    return (
      <div className='w-full flex flex-col items-center justify-center min-h-[400px] border border-accent/20 rounded-2xl bg-tertiary/20 backdrop-blur-sm'>
        <p className='text-secondary text-lg mb-4 text-center px-4'>
           Technical Toolkit currently undergoing a maintenance scan. <br />
           <span className='text-sm opacity-50'>Please try refreshing the interface.</span>
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>My technical toolkit</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Skills.</h2>
      </motion.div>

      <div className='mt-14'>
        <SkillSphereCanvas skills={skills} iconMap={iconMap} />
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");
