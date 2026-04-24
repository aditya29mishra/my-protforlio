import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { useTimeline } from "../hooks/useTimeline";
import SectionWrapper from "../hoc/SectionWrapper";
import { textVariant } from "../utils/motion";
import { MdOutlineWork as WorkIcon } from 'react-icons/md';
import { IoSchool as SchoolIcon } from 'react-icons/io5';

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.dateRange}
      iconStyle={{ background: experience.timelineType === "work" ? "#383E56" : "#E6DEDD" }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          {experience.timelineType === "work" ? <WorkIcon className="text-white w-3/5 h-3/5" /> : <SchoolIcon className="text-black w-3/5 h-3/5" />}
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{experience.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {experience.name}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.summaryPoints && experience.summaryPoints.split('. ').map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
      
      {experience.techStack && (
        <p className="mt-4 text-accent text-[12px] font-mono">
          🔧 {experience.techStack}
        </p>
      )}
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { timeline, loading } = useTimeline();

  if (loading) return null;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          What I have done so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Work Experience.
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {timeline.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
