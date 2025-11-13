import React from 'react';
import './App.css';
import './index.css';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import Section from './components/Section';
import Gallery from './components/Gallery';
import ImpactCalculator from './components/ImpactCalculator';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { ensureFocusAfterJump } from './utils/a11y';
import { isFeatureEnabled } from './components/FeatureFlags';

// PUBLIC_INTERFACE
function AppShell() {
  /**
   * SPA layout rendering sections and sticky footer.
   * Includes smooth scroll and active nav handling via NavBar.
   */
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    // Safari fallback for smooth scroll on anchor links
    const handler = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      const id = target.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        ensureFocusAfterJump(el);
        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', `#${id}`);
        }
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="app-root" data-theme={theme}>
      <a href="#home" className="skip-link">Skip to content</a>
      <NavBar onToggleTheme={toggleTheme} currentTheme={theme} />
      <main id="home" role="main" tabIndex={-1} aria-label="Eco Cities content">
        <Hero />
        <Section id="concepts" title="Eco-Architecture Concepts" variant="surface">
          <div className="card reveal">
            <p className="muted">
              Explore green roofs, passive solar designs, urban forests, and water-sensitive planning
              that make cities resilient and sustainable.
            </p>
          </div>
        </Section>
        <Section id="gallery" title="Inspiration Gallery" variant="default">
          <Gallery />
        </Section>
        <Section id="lifestyle" title="Personal Impact" variant="surface">
          {isFeatureEnabled('calculator') ? (
            <ImpactCalculator />
          ) : (
            <div className="card">
              <p className="muted">Impact calculator is disabled by feature flag.</p>
            </div>
          )}
        </Section>
        <Section id="cta" title="Join the movement" variant="default">
          <div className="card reveal" style={{ textAlign: 'center' }}>
            <p className="muted">Small steps lead to big change. Start today.</p>
            <div style={{ marginTop: '.5rem' }}>
              <a href="#home" className="btn" aria-label="Back to top">Back to top</a>
              <a href="#lifestyle" className="btn secondary" style={{ marginLeft: '.5rem' }}>Try Calculator</a>
            </div>
          </div>
        </Section>
      </main>
      <footer className="sticky-gradient" aria-label="Footer">
        <div className="container" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
          <span className="small">© {new Date().getFullYear()} Eco Cities</span>
          <nav aria-label="Footer navigation">
            <a href="#concepts" className="small">Concepts</a>
            <span aria-hidden="true" style={{ margin: '0 .5rem', color: 'var(--muted)' }}>•</span>
            <a href="#gallery" className="small">Gallery</a>
            <span aria-hidden="true" style={{ margin: '0 .5rem', color: 'var(--muted)' }}>•</span>
            <a href="#cta" className="small">Get Started</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root app wrapped in ThemeProvider. */
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

export default App;
