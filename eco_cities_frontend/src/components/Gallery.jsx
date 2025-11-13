import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Horizontally scrolling eco-architecture gallery with scroll-snap,
 * lazy-loaded images, and keyboard controls for small screens.
 */
export default function Gallery() {
  const scrollerRef = React.useRef(null);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9 * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const base = process.env.PUBLIC_URL || '';
  const items = [
    { src: `${base}/assets/leaf-texture.svg`, alt: 'Leaf texture background', caption: 'Biophilic patterns' },
    { src: `${base}/assets/eco-city.svg`, alt: 'Eco city skyline silhouette', caption: 'Green roofs & skylines' },
    { src: `${base}/assets/leaf-texture.svg`, alt: 'Organic leaf pattern', caption: 'Organic facades' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.5rem' }}>
        <span className="small muted">Hint: Use mouse wheel shift-scroll or buttons</span>
        <div aria-label="Scroll controls">
          <button className="btn secondary" onClick={() => scrollBy(-1)} aria-label="Scroll left">
            <span aria-hidden="true">←</span> <span className="small">Prev</span>
          </button>
          <button className="btn" onClick={() => scrollBy(1)} aria-label="Scroll right" style={{ marginLeft: '.5rem' }}>
            <span className="small">Next</span> <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="gallery snap-x"
        role="list"
        aria-label="Eco-architecture inspiration gallery"
        tabIndex={0}
      >
        {items.map((it, idx) => (
          <figure className="item snap-start" key={idx} role="listitem" style={{ margin: 0 }}>
            <img src={it.src} alt={it.alt} loading="lazy" />
            <figcaption className="caption">{it.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="small muted" style={{ marginTop: '.5rem' }}>
        Tip: Use <kbd className="k">Tab</kbd> to focus the gallery and arrow keys to navigate on some devices.
      </div>
    </div>
  );
}
