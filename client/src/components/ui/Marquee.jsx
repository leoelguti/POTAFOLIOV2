import { MARQUEE_TECHS } from '../../utils/constants';

/**
 * Infinite scrolling marquee of tech stack items.
 */
export default function Marquee() {
  const items = MARQUEE_TECHS.map((tech, i) => (
    <span className="m-item" key={`${tech}-${i}`}>
      <span className="d" style={{ background: 'var(--a1)' }} />
      {tech}
    </span>
  ));

  return (
    <div className="marquee-zone">
      <div className="m-track">
        {items}
        {items}
      </div>
    </div>
  );
}
