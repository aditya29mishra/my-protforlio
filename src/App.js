import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NetflixTitle from "./components/NetflixTitle";
import Browse from "./components/Browse";
import ProfilePage from "./components/ProfilePage";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import WorkExperience from "./components/WorkExperience";
import Contact from "./components/Contact";
import Music from "./components/Music";
import Reading from "./components/Reading";

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
      </Routes>
    </Router>
  );
};

export default App;
