import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import SectionWrapper from "../hoc/SectionWrapper";

const ServiceCard = ({ index, title, icon, description }) => (
  <Tilt className='xs:w-[280px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card group'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-8 min-h-[320px] flex justify-center items-center flex-col transition-all duration-300 group-hover:shadow-[0_0_20px_#915EFF]'
      >
        <div className='w-16 h-16 object-contain mb-4'>
          {icon}
        </div>

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
        
        <p className='mt-4 text-secondary text-[12px] text-center leading-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          {description}
        </p>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-4xl leading-[30px]'
      >
        I design and develop real-time XR (VR/MR) systems for industrial training and simulation. <br /><br />
        With hands-on experience building 20+ applications across Meta Quest, HTC VIVE, and KAT VR, 
        I specialize in performance-critical Unity architectures, interaction systems, and immersive workflows. <br /><br />
        My work focuses on solving real-world problems through simulation — from training environments to 
        interactive systems — where precision, performance, and usability matter.
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-10 justify-center'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
