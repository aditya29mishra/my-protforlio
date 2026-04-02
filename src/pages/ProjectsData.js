import projectsData from "../data/projects.json";
import localAssetMap from "../data/localAssetMap";

const projects = projectsData.map((project) => ({
  title: project.title,
  description: project.description,
  techUsed: project.techStack.join(", "),
  image: localAssetMap[project.media.imageAssetKey],
  github: project.links?.github,
  video: project.video?.youtubeId
}));

export default projects;
