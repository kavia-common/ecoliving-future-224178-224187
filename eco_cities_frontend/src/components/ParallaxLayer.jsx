import React from 'react';
import useParallax from '../hooks/useParallax';

/**
 * PUBLIC_INTERFACE
 * ParallaxLayer
 * Renders a positioned layer that moves at a specified speed relative to scroll.
 * Respects prefers-reduced-motion and a global reducer class on body.
 */
export default function ParallaxLayer({ speed = 0.2, children, style }) {
  const ref = React.useRef(null);
  const { y } = useParallax({ speed });

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const transform = reduce ? undefined : `translate3d(0, ${y}px, 0)`;

  return (
    <div
      aria-hidden="true"
      className="parallax-layer"
      ref={ref}
      style={{ transform, ...style }}
    >
      {children}
    </div>
  );
}
