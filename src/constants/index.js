import { 
  FaVrCardboard, 
  FaBolt, 
  FaCube 
} from "react-icons/fa";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Experience",
  },
  {
    id: "skills",
    title: "Skills",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

export const services = [
  {
    title: "XR Development",
    description: "Building immersive VR/MR applications using Unity and real-time interaction systems.",
    icon: <FaVrCardboard className='text-accent w-full h-full' />,
  },
  {
    title: "Simulation Systems",
    description: "Designing industrial training simulations with physics, workflows, and user interaction.",
    icon: <FaCube className='text-accent w-full h-full' />,
  },
  {
    title: "Real-Time Optimization",
    description: "Ensuring high performance, stability, and scalability across XR platforms.",
    icon: <FaBolt className='text-accent w-full h-full' />,
  },
];
