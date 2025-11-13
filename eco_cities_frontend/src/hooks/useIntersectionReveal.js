import React from 'react';

/**
 * PUBLIC_INTERFACE
 * useIntersectionReveal
 * Returns boolean visible; if IntersectionObserver unsupported, returns true.
 * Also respects prefers-reduced-motion by returning true immediately to avoid delayed content.
 */
export default function useIntersectionReveal(ref) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref]);

  return visible;
}
