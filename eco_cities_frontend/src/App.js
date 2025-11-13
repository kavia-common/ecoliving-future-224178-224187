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

        <Section id="concepts" title="Eco-Architecture Concepts" variant="surface" revealVariant="fade-up">
          <div className="grid cols-2">
            <div className="card reveal fade-left">
              <h3>Bioclimatic design</h3>
              <p className="muted">Green roofs, passive ventilation, and daylighting reduce energy demand while improving comfort.</p>
            </div>
            <div className="card reveal fade-right">
              <h3>Blue–green corridors</h3>
              <p className="muted">Urban forests and water-sensitive design bolster biodiversity and manage stormwater naturally.</p>
            </div>
          </div>
        </Section>

        <Section id="innovations" title="Innovations" variant="default" revealVariant="fade-up">
          <div className="grid cols-3">
            {[
              { icon: '🔋', title: 'Microgrids', desc: 'Neighborhood-scale resilient energy with storage.' },
              { icon: '🚰', title: 'Greywater', desc: 'Reuse systems that cut potable demand.' },
              { icon: '🏗️', title: 'Modular', desc: 'Prefabricated timber reduces embodied carbon.' },
              { icon: '🚌', title: 'Mobility Hubs', desc: 'Seamless transit, bike, and e‑sharing nodes.' },
              { icon: '🌬️', title: 'Smart Air', desc: 'Sensors optimize ventilation and comfort.' },
              { icon: '♻️', title: 'Circular Loops', desc: 'Waste-to-resource ecosystems at district scale.' },
            ].map((c, i) => (
              <div className="card reveal scale-in" key={c.title} role="article" aria-label={c.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div className="icon-badge" aria-hidden="true">{c.icon}</div>
                  <h3 style={{ margin: 0 }}>{c.title}</h3>
                </div>
                <p className="small muted" style={{ marginTop: '.5rem' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="gallery" title="Inspiration Gallery" variant="default" revealVariant="fade-left">
          <Gallery />
        </Section>

        <Section id="lifestyle" title="Personal Impact" variant="surface" revealVariant="fade-right">
          {isFeatureEnabled('calculator') ? (
            <ImpactCalculator />
          ) : (
            <div className="card">
              <p className="muted">Impact calculator is disabled by feature flag.</p>
            </div>
          )}

          {/* Quick tips cards */}
          <div className="grid cols-3" style={{ marginTop: '1rem' }} aria-label="Lifestyle quick tips">
            {[
              { icon: '🚲', title: 'Active commute', tip: 'Swap short car trips with cycling or walking 2x/week.' },
              { icon: '🥗', title: 'Plant-forward', tip: 'Try 3 meat-free dinners weekly to cut food emissions.' },
              { icon: '💡', title: 'Efficient habits', tip: 'LED bulbs and smart plugs trim baseline energy.' },
            ].map(t => (
              <div className="card reveal fade-up" key={t.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div className="icon-badge" aria-hidden="true">{t.icon}</div>
                  <h3 style={{ margin: 0 }}>{t.title}</h3>
                </div>
                <p className="small muted" style={{ marginTop: '.5rem' }}>{t.tip}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="cta" title="Join the movement" variant="default" revealVariant="scale-in">
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
