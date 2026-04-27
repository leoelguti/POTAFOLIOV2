import WebGLAurora from './components/ui/WebGLAurora';
import CustomCursor from './components/ui/CustomCursor';
import NoiseOverlay from './components/ui/NoiseOverlay';
import Marquee from './components/ui/Marquee';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Stats from './components/sections/Stats';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';

/**
 * Main portfolio application.
 * Assembles all sections in the same order as the original HTML.
 */
export default function App() {
  return (
    <>
      {/* Global overlays */}
      <CustomCursor />
      <NoiseOverlay />
      <WebGLAurora />

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Tech Marquee */}
      <Marquee />

      {/* About */}
      <About />

      {/* Skills */}
      <Skills />

      <div className="divider" />

      {/* Stats */}
      <Stats />

      <div className="divider" />

      {/* Projects */}
      <Projects />

      <div className="divider" />

      {/* Experience */}
      <Experience />

      <div className="divider" />

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <Footer />
    </>
  );
}
