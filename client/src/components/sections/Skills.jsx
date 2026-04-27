import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SKILLS } from '../../utils/constants';

/**
 * Skills / Tech Stack section with animated tag pills.
 */
export default function Skills() {
  const ref = useScrollReveal();

  return (
    <div className="skills-wrap" ref={ref}>
      <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Tech Stack</div>
      <div className="skill-row rev">
        {SKILLS.map((skill) => (
          <span className="stag" key={skill.name}>
            <span className="stag-dot" style={{ background: skill.color }} />
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
