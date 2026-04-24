// Redesign Initialized - SPS Layout
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import StarsCanvas from "./components/canvas/StarsCanvas";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Tech from "./components/Tech";
import Works from "./components/Works";
import Contact from "./components/Contact";

// Lazy load secondary routes
const Music = lazy(() => import("./pages/Music"));
const Reading = lazy(() => import("./pages/Reading"));
const DummyBento = lazy(() => import("./pages/DummyBento"));

const App = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <Router basename="/">
        <div className="relative z-0 bg-primary">
          <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
            <Navbar />
            <Hero />
          </div>
          
          <About />
          <Experience />
          <Tech />
          <Works />
          
          <div className="relative z-0">
            <Contact />
          </div>

          {/* Secondary Routes / Misc */}
          <Suspense fallback={null}>
            <Routes>
              <Route path="/music" element={<Music />} />
              <Route path="/reading" element={<Reading />} />
              <Route path="/dummy-bento" element={<DummyBento />} />
              {/* Catch-all or Home could be defined here if needed, 
                  but our main landing is static above the Routes */}
            </Routes>
          </Suspense>
          <StarsCanvas />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
