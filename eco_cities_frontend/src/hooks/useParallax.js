import React from 'react';

/**
 * PUBLIC_INTERFACE
 * useParallax
 * Returns a y offset based on scroll and speed. Respects reduced motion.
 */
export default function useParallax({ speed = 0.2 } = {}) {
  const [y, setY] = React.useState(0);

  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setY(0);
      return;
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setY(window.scrollY * speed);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return { y };
}
