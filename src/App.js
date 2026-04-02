import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

const NetflixTitle = lazy(() => import("./pages/NetflixTitle"));
const Browse = lazy(() => import("./pages/Browse"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const Skills = lazy(() => import("./pages/Skills"));
const Projects = lazy(() => import("./pages/Projects"));
const WorkExperience = lazy(() => import("./pages/WorkExperience"));
const Contact = lazy(() => import("./pages/Contact"));
const Music = lazy(() => import("./pages/Music"));
const Reading = lazy(() => import("./pages/Reading"));
const ThreeDChess = lazy(() => import("./games/ThreeDChess"));
const SnakeGame = lazy(() => import("./games/snakegame/SnakeRaceGame"));
const VirtualShootingRange = lazy(() => import("./games/VirtualShootingRange"));
const SpaceExploration = lazy(() => import("./games/SpaceExploration"));

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Routes without Navbar */}
            <Route path="/" element={<NetflixTitle />} />
            <Route path="/browse" element={<Browse />} />

            {/* Routes with Layout */}
            <Route path="/profile/:profileName" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/skills" element={<Layout><Skills /></Layout>} />
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/work-experience" element={<Layout><WorkExperience /></Layout>} />
            <Route path="/contact-me" element={<Layout><Contact /></Layout>} />
            <Route path="/music" element={<Layout><Music /></Layout>} />
            <Route path="/reading" element={<Layout><Reading /></Layout>} />

            {/* Game Routes */}
            <Route path="/game/recruiter" element={<Layout><SnakeGame /></Layout>} />
            <Route path="/game/developer" element={<Layout><ThreeDChess /></Layout>} />
            <Route path="/game/stalker" element={<Layout><VirtualShootingRange /></Layout>} />
            <Route path="/game/adventure" element={<Layout><SpaceExploration /></Layout>} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
