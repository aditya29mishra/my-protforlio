import timelineEntries from "../data/timeline.json";

const timelineData = timelineEntries.map((entry) => ({
  name: entry.organization,
  timelineType: entry.type,
  title: entry.role,
  techStack: entry.techStack,
  summaryPoints: entry.summary,
  dateRange: entry.dateRange
}));

export async function getTimeline() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(timelineData), 500); // Simulating an API call with a delay
  });
}
