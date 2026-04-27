import { useState, useCallback } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { PROJECTS, FILTER_CATEGORIES } from '../../utils/constants';
import ProjectCardCanvas from '../ui/ProjectCardCanvas';
import ProjectModal from '../ui/ProjectModal';

/**
 * Projects section with filter tabs, animated cards, and live preview modal.
 */
export default function Projects() {
  const sectionRef = useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  const openPreview = useCallback((url) => {
    setModalUrl(url);
    setModalOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleGlow = (e, card) => {
    const r = card.getBoundingClientRect();
    const glow = card.querySelector('.pcard-glow');
    if (glow) {
      glow.style.background = `radial-gradient(380px circle at ${
        ((e.clientX - r.left) / r.width) * 100
      }% ${((e.clientY - r.top) / r.height) * 100}%, rgba(108,99,255,.08), transparent 70%)`;
    }
  };

  return (
    <>
      <div className="sec" id="projects" ref={sectionRef}>
        <div className="eyebrow">Selected Work</div>
        <div className="sh rev">Live Applications</div>
        <p className="sp rev">
          Preview any app running in production — right here, no new tab required.
        </p>

        <div className="filter-tabs rev">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`ftab ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="proj-grid">
          {PROJECTS.map((project, i) => {
            const visible = activeFilter === 'All' || project.category === activeFilter;
            return (
              <div
                key={project.id}
                className={`pcard rev ${!visible ? 'hidden' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
                onMouseMove={(e) => handleGlow(e, e.currentTarget)}
              >
                <div className="pcard-glow" />
                <div className="pcard-thumb">
                  <ProjectCardCanvas hue={project.hue} seed={i * 77.3} />
                  <span className="pcard-emoji">{project.icon}</span>
                </div>
                <div className="pcard-body">
                  <div className="pcard-head">
                    <div className="pcard-title">{project.title}</div>
                    {project.isLive && <div className="live-badge">Live</div>}
                  </div>
                  <div className="pcard-desc">{project.description}</div>
                  <div className="pcard-tags">
                    {project.tags.map((tag) => (
                      <span className="ptag" key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="pcard-btns">
                    <button className="btn-pv" onClick={() => openPreview(project.url)}>
                      ⚡ Live Preview
                    </button>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ext"
                    >
                      ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ProjectModal isOpen={modalOpen} url={modalUrl} onClose={closePreview} />
    </>
  );
}
