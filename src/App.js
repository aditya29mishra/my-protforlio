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
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/profile/:profileName" element={<ProfilePage />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/work-experience" element={<WorkExperience />} />
                <Route path="/contact-me" element={<Contact />} />
                <Route path="/music" element={<Music />} />
                <Route path="/reading" element={<Reading />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
