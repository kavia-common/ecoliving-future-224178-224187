import React from 'react';
import ParallaxLayer from './ParallaxLayer';

/**
 * PUBLIC_INTERFACE
 * Hero component with layered parallax background, accessible title and CTA.
 * Disables or reduces motion per user preference automatically in ParallaxLayer.
 */
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title" id="home" tabIndex={-1}>
      <ParallaxLayer speed={0.1} style={{ background: 'radial-gradient(600px 200px at 50% -50px, rgba(37,99,235,.15), transparent)' }} />
      <ParallaxLayer speed={0.25} style={{ backgroundImage: 'url(/assets/eco-city.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '1200px auto', backgroundPosition: 'center 110%' }} />
      <div className="content container">
        <h1 id="hero-title">Designing the cities of tomorrow</h1>
        <p>Minimal impact. Maximum life quality. Explore sustainable concepts and calculate your personal footprint.</p>
        <div className="cta">
          <a href="#gallery" className="btn" aria-label="View inspiration gallery">Explore Gallery</a>
          <a href="#lifestyle" className="btn secondary" aria-label="Open impact calculator">Impact Calculator</a>
        </div>
      </div>
    </section>
  );
}
