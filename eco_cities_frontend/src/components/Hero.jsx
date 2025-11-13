import React from 'react';
import ParallaxLayer from './ParallaxLayer';

/**
 * PUBLIC_INTERFACE
 * Hero component with layered parallax background, accessible title and CTA.
 * Disables or reduces motion per user preference automatically in ParallaxLayer.
 */
export default function Hero() {
  // mouse position ripple support for buttons (sets CSS vars)
  React.useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest('.btn');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      target.style.setProperty('--mx', x + '%');
      target.style.setProperty('--my', y + '%');
    };
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title" id="home" tabIndex={-1}>
      {/* Background glow */}
      <ParallaxLayer speed={0.1} style={{ background: 'radial-gradient(600px 200px at 50% -50px, rgba(37,99,235,.15), transparent)' }} />
      {/* Skyline mid layer */}
      <ParallaxLayer speed={0.25} style={{ backgroundImage: `url(${process.env.PUBLIC_URL || ''}/assets/eco-city.svg)`, backgroundRepeat: 'no-repeat', backgroundSize: '1200px auto', backgroundPosition: 'center 110%' }} />
      {/* Foreground leaves for added depth */}
      <ParallaxLayer speed={0.45} style={{ opacity: .3 }}>
        <div
          className="leaves float-slow"
          aria-hidden="true"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL || ''}/assets/leaf-texture.svg)` }}
        />
      </ParallaxLayer>

      <div className="content container">
        <h1 id="hero-title">Designing the cities of tomorrow</h1>
        <p>Minimal impact. Maximum life quality. Explore sustainable concepts and calculate your personal footprint.</p>
        <div className="cta">
          <a href="#gallery" className="btn" aria-label="View inspiration gallery">Explore Gallery</a>
          <a href="#lifestyle" className="btn secondary" aria-label="Open impact calculator">Impact Calculator</a>
        </div>
        {/* Key stats with gentle counters */}
        <div className="grid cols-3" style={{ marginTop: '1.25rem' }} aria-label="Key sustainability stats">
          <Counter target={120} duration={1200} label="Eco projects" />
          <Counter target={85} duration={1200} suffix="%" label="Renewables potential" />
          <Counter target={24} duration={1200} label="Smart districts" />
        </div>
      </div>
    </section>
  );
}

/**
 * PUBLIC_INTERFACE
 * Counter: animated numeric counter that respects reduced motion
 */
function Counter({ target = 0, duration = 1000, suffix = '', label = '' }) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(target);
      return;
    }
    let rafId;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // easeInOutQuad
      setValue(Math.round(target * eased));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return (
    <div className="card reveal" style={{ textAlign: 'center' }}>
      <div className="counter" aria-label={`${label}: ${value}${suffix}`}>
        {value}
        {suffix && <span className="unit"> {suffix}</span>}
      </div>
      <div className="small muted">{label}</div>
    </div>
  );
}
