import React from 'react';
import useIntersectionReveal from '../hooks/useIntersectionReveal';

/**
 * PUBLIC_INTERFACE
 * Generic content section with optional surface background and reveal on scroll.
 */
export default function Section({ id, title, children, variant = 'default' }) {
  const ref = React.useRef(null);
  const visible = useIntersectionReveal(ref);

  const surfaceStyle = variant === 'surface'
    ? { background: 'var(--surface)', borderRadius: '16px', boxShadow: 'var(--shadow)', border: '1px solid rgba(0,0,0,0.06)', padding: '1rem' }
    : {};

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="inner container">
        <h2 id={`${id}-title`} className={`reveal ${visible ? 'visible' : ''}`} ref={ref}>
          {title}
        </h2>
        <div className={`reveal ${visible ? 'visible' : ''}`} style={surfaceStyle}>
          {children}
        </div>
      </div>
    </section>
  );
}
