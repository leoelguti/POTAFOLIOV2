import { useScrollReveal } from '../../hooks/useScrollReveal';
import { EXPERIENCE } from '../../utils/constants';

/**
 * Experience timeline section.
 */
export default function Experience() {
  const sectionRef = useScrollReveal();

  return (
    <div className="sec" id="experience" ref={sectionRef}>
      <div className="eyebrow">Experience</div>
      <div className="sh rev">Where I've Worked</div>
      <div className="timeline">
        {EXPERIENCE.map((exp, i) => (
          <div
            className="tl-item rev"
            key={exp.yearRange}
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <div className="tl-dot" />
            <div className="tl-year">{exp.yearRange}</div>
            <div className="tl-title">{exp.title}</div>
            <div className="tl-sub">{exp.company}</div>
            <div className="tl-desc">{exp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
