const timelineData = [
  {
    name: "ELEKTRO LABs",
    timelineType: "work",
    titile:"Junior Unity Developer",
    techStack: "Unity3D, C#, AR/VR/MR",
    summaryPoints: "I create VR training modules for DOJO, including Fire Safety Training, Screwing Process Training, Terminal & Holder Fixing, and PDI Training. My responsibilities include programming, designing training flows, and managing client interactions and deployments.",
    dateRange: "Feb 2025 - Present",
  },
  {
    name: "Algovation.in",
    timelineType: "work",
    title: "Game Devloper Intern",
    techStack: "Unity3d, C# ",
    summaryPoints: "Developing engaging mobile-based games using Unity3D. Focused on optimizing gameplay mechanics, implementing interactive features, and delivering high-quality gaming experiences tailored for mobile platforms.",
    dateRange: "Dec 2024 -  JAN 2025",
  },
  {
    name: "IIT Jodhpur",
    timelineType: "work",
    title: "Intern at TIH iHUB Drishti",
    techStack: "Unity, C#, ARCore, Android SDKs",
    summaryPoints: "Developed high-performance AR/VR software solutions, optimized real-time performance, and collaborated with interdisciplinary teams for interactive XR experiences.",
    dateRange: "July 2024 - Sep 2024",
  },
  {
    name: "Aditya Mishra",
    timelineType: "work",
    title: "Hackathon Achievements",
    techStack: "Problem-Solving, AR/VR, Team Collaboration",
    summaryPoints: "Winner of Kumbh Mela Hackathon (IIITA, 2024), InnoHacks’23 Hackathon, and Innotech’22 KIET annual technical fest.",
    dateRange: "2022 - 2024",
  },
  {
    name: "KIET Gruop of institution",
    timelineType: "education",
    title: "B.Tech in Computer Science",
    summaryPoints: "Pursuing final year with a strong focus on Machine Learning, AI, and AR/VR projects. Actively involved in hands-on projects and internships to enhance technical and practical knowledge.",
    dateRange: "Aug 2021 - May 2025",
  }

];

export async function getTimeline() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(timelineData), 500); // Simulating an API call with a delay
  });
}
