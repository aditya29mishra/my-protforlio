const timelineData = [
  {
    name: "Aditya Mishra",
    timelineType: "work",
    title: "Game Devloper Intern at Algovation.in",
    techStack: "Unity3d, C# ",
    summaryPoints: "Developing engaging mobile-based games using Unity3D. Focused on optimizing gameplay mechanics, implementing interactive features, and delivering high-quality gaming experiences tailored for mobile platforms.",
    dateRange: "Dec 2024 -  Present",
  },
  {
    name: "Aditya Mishra",
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
    name: "Aditya Mishra",
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
