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
        <div className="eyebrow">Trabajo destacado</div>
        <div className="sh rev">Aplicaciones en vivo</div>
        <p className="sp rev">
          Previsualiza cualquier app en producción — aquí mismo, sin abrir otra pestaña.
        </p>

        <div className="filter-tabs rev" role="tablist" aria-label="Filtrar proyectos">
          {FILTER_CATEGORIES.map((cat) => {
            const labels = { All: 'Todos', fullstack: 'Full-stack', backend: 'Backend', frontend: 'Frontend' };
            return (
              <button
                key={cat}
                className={`ftab ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
                role="tab"
                aria-selected={activeFilter === cat}
                type="button"
              >
                {labels[cat] || cat}
              </button>
            );
          })}
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
                    {project.isLive && <div className="live-badge">En vivo</div>}
                  </div>
                  <div className="pcard-desc">{project.description}</div>
                  <div className="pcard-tags">
                    {project.tags.map((tag) => (
                      <span className="ptag" key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="pcard-btns">
                    <button className="btn-pv" onClick={() => openPreview(project.url)} aria-label={`Vista previa de ${project.title}`}>
                      ⚡ Vista previa
                    </button>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ext"
                      aria-label={`Abrir ${project.title} en nueva pestaña`}
                    >
                      ↗
                    </a>
                    {project.altUrl && (
                      <button
                        className="btn-pv"
                        onClick={() => openPreview(project.altUrl)}
                        aria-label={`${project.altLabel || 'Vista alternativa'} de ${project.title}`}
                        style={{ flexBasis: '100%' }}
                      >
                        🎯 {project.altLabel || 'Vista alternativa'}
                      </button>
                    )}
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
