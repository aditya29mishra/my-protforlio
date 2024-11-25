import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NetflixTitle from "./pages/NetflixTitle";
import Browse from "./pages/Browse";
import ProfilePage from "./components/ProfilePage";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import WorkExperience from "./pages/WorkExperience";
import Contact from "./pages/Contact";
import Music from "./pages/Music";
import Reading from "./pages/Reading";

import ThreeDChess from "./games/ThreeDChess";
import MazeRunner from "./games/MazeRunner";
import VirtualShootingRange from "./games/VirtualShootingRange";
import SpaceExploration from "./games/SpaceExploration";

const App = () => {
  return (
    <Router>
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
        <Route path="/game/recruiter" element={<Layout><MazeRunner /></Layout>} />
        <Route path="/game/developer" element={<Layout><ThreeDChess /></Layout>} />
        <Route path="/game/stalker" element={<Layout><VirtualShootingRange /></Layout>} />
        <Route path="/game/adventure" element={<Layout><SpaceExploration /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
