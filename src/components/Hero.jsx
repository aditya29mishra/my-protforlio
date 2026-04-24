import { motion } from "framer-motion";
import { styles } from "../styles";
import QuestCanvas from "./canvas/QuestCanvas";
import { useEffect, useState } from "react";
import { usePersona } from "../hooks/usePersona";

const TypewriterText = ({ texts }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isTyping) {
        const currentText = texts[currentIndex];
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(true);
            setDisplayText("");
            setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
          }, 2000);
        }
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentIndex, isTyping, texts, displayText]);

  return (
    <span className='text-accent font-bold'>
      {displayText}
      {isTyping && <span className='animate-pulse ml-1'>|</span>}
    </span>
  );
};

const Hero = () => {
  const { personas, loading } = usePersona();
  const persona = personas[0]; // Primary persona
  
  const titles = [
    "XR Engineer",
    "Full-Stack Developer",
    "3D Visualizer",
    "Unity Specialist"
  ];

  if (loading) return null;

  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-accent' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className='text-accent'>{persona?.label === "recruiter" ? "Aditya" : (persona?.label || "Aditya")}</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I'm a <TypewriterText texts={titles} /> <br className='sm:block hidden' />
            Specializing in immersive XR experiences <br className='sm:block hidden' />
            and high-performance web applications.
          </p>
        </div>
      </div>

      <div className='absolute inset-0 z-0 flex justify-end items-center pointer-events-none'>
        <div className="w-full h-full sm:w-1/2">
          <QuestCanvas />
        </div>
      </div>

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
