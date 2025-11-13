import React from 'react';
import { announce } from '../utils/a11y';

/**
 * PUBLIC_INTERFACE
 * Fixed top navigation with active link highlighting and theme toggle.
 * - Highlights the section in view
 * - Provides accessible keyboard navigation
 * - Renders a theme toggle button passed from parent
 */
export default function NavBar({ onToggleTheme, currentTheme }) {
  const [active, setActive] = React.useState('home');

  React.useEffect(() => {
    const sections = ['home', 'concepts', 'gallery', 'lifestyle', 'cta']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const onScroll = () => {
      const offset = window.scrollY + 120; // consider navbar height
      let current = 'home';
      for (const s of sections) {
        if (s.offsetTop <= offset) current = s.id;
      }
      setActive(current);
    };

    onScroll();
    let ticking = false;
    const throttled = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    };

    window.addEventListener('scroll', throttled, { passive: true });
    window.addEventListener('resize', throttled);
    return () => {
      window.removeEventListener('scroll', throttled);
      window.removeEventListener('resize', throttled);
    };
  }, []);

  const handleToggle = () => {
    onToggleTheme?.();
    announce(`Theme changed to ${currentTheme === 'light' ? 'dark' : 'light'} mode`);
  };

  return (
    <header className="navbar" role="banner">
      <div className="inner">
        <a href="#home" className="brand" aria-label="Eco Cities Home" style={{ fontWeight: 800 }}>
          🌿 Eco Cities
        </a>
        <nav aria-label="Primary">
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '.25rem' }}>
            {[
              { id: 'home', label: 'Home' },
              { id: 'concepts', label: 'Concepts' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'lifestyle', label: 'Lifestyle' },
              { id: 'cta', label: 'Get Started' }
            ].map(link => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={active === link.id ? 'active' : undefined}
                  aria-current={active === link.id ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <button className="btn" onClick={handleToggle} aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}>
            {currentTheme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </header>
  );
}
