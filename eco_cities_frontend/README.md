# Eco Cities Frontend (SPA)

This frontend is a single‑page React application showcasing sustainable living and future eco‑cities. It delivers smooth scrolling, section reveals, parallax effects, an inspiration gallery, and an interactive personal impact calculator. The UI follows the Ocean Professional theme with accessible color contrast, keyboard support, and reduced‑motion considerations.

## Architecture and SPA Structure

The app is a single page with fixed top navigation and section anchors. Navigation highlights the section in view and uses smooth scroll with focus management for accessibility.

- Entry: `src/index.js` renders `<App />` via React 18 root API.
- App shell: `src/App.js`
  - Layout composition and in‑page anchor handling (smooth scroll + focus via `ensureFocusAfterJump`).
  - Sections: `#home` (Hero), `#concepts`, `#gallery`, `#lifestyle`, `#cta`.
  - Sticky gradient footer.
  - Theme management provided via `ThemeProvider` with a toggle button in the navbar.
- Components:
  - `components/NavBar.jsx` — fixed top nav, active link highlighting, theme toggle, ARIA attributes.
  - `components/Hero.jsx` — hero with layered parallax background and CTAs.
  - `components/Section.jsx` — generic section wrapper with reveal‑on‑scroll.
  - `components/Gallery.jsx` — horizontally scrolling, snap‑based gallery with keyboard hints.
  - `components/ImpactCalculator.jsx` — interactive calculator with validation and live results.
  - `components/ParallaxLayer.jsx` — parallax layer respecting prefers‑reduced‑motion.
  - `components/FeatureFlags.js` — helpers to check feature flags and experiments.
  - `components/ThemeProvider.jsx` — light/dark theme context and localStorage persistence.
- Hooks:
  - `hooks/useParallax.js` — computes y offset from scroll with throttling and reduced‑motion guard.
  - `hooks/useIntersectionReveal.js` — IntersectionObserver‑based reveal with fallback.
- Utilities:
  - `utils/a11y.js` — focus management and polite live region announcements.
  - `utils/env.js` — safe accessors for environment variables and feature flags.
- Styles:
  - `src/index.css` — global reset, variables, base components, and utilities.
  - `src/App.css` — component styles, cards, gallery, calculator, and parallax helpers.

## Environment Configuration

React (CRA) exposes environment vars prefixed with REACT_APP_. This project reads its configuration via `src/utils/env.js`.

Supported variables:
- REACT_APP_API_BASE — base path for API requests (string, optional).
- REACT_APP_BACKEND_URL — absolute backend origin (string, optional).
- REACT_APP_FRONTEND_URL — absolute frontend origin (string, optional).
- REACT_APP_WS_URL — WebSocket URL (string, optional).
- REACT_APP_NODE_ENV — application environment name (default: development).
- REACT_APP_NEXT_TELEMETRY_DISABLED — disable Next.js telemetry (not used by CRA; kept for parity).
- REACT_APP_ENABLE_SOURCE_MAPS — enable/disable source maps (CRA uses GENERATE_SOURCEMAP; see note below).
- REACT_APP_PORT — port number used by the container (default: 3000).
- REACT_APP_TRUST_PROXY — reverse proxy trust flag (not used by CRA runtime; optional).
- REACT_APP_LOG_LEVEL — one of silent|error|warn|info|debug|trace (default: info).
- REACT_APP_HEALTHCHECK_PATH — health endpoint path (default: /health).
- REACT_APP_FEATURE_FLAGS — JSON object or CSV list. Example: `{"calculator":true}` or `calculator,advancedParallax`.
- REACT_APP_EXPERIMENTS_ENABLED — toggle experiments (true|false, default: false).

How they are used:
- `utils/env.js` exposes getters like `getApiBase`, `getLogLevel`, `getFeatureFlags`, and more.
- `components/FeatureFlags.js` calls `getFeatureFlags()` and `getExperimentsEnabled()` to gate features such as the Impact Calculator (flag: `calculator`).

Notes on CRA specifics:
- CRA only injects variables starting with `REACT_APP_` at build time.
- Disabling source maps follows CRA’s `GENERATE_SOURCEMAP=false` convention during build. The provided `REACT_APP_ENABLE_SOURCE_MAPS` can be mirrored by setting `GENERATE_SOURCEMAP` accordingly in your build environment.

See `.env.example` for a full template.

## Feature Flags

Feature flags are parsed from `REACT_APP_FEATURE_FLAGS`:
- JSON form: `{"calculator": true}`.
- CSV form: `calculator,advancedParallax`.

Checking a flag:
```js
import { isFeatureEnabled } from './components/FeatureFlags';
if (isFeatureEnabled('calculator')) {
  // render calculator
}
```

Global experiments switch:
```js
import { experimentsEnabled } from './components/FeatureFlags';
if (experimentsEnabled()) {
  // enable experimental UI paths
}
```

## Accessibility

The application emphasizes accessible interactions and content:
- Skip link to jump to `#home` with proper focusing.
- Smooth scrolling enhanced with `ensureFocusAfterJump`, ensuring screen readers and keyboard users land correctly.
- Live region announcements via `announce()` for non-visual feedback (e.g., theme change).
- Reduced motion: all parallax and animations honor `prefers-reduced-motion` and disable or minimize movement.
- ARIA: semantic regions, labeled navigation, and `aria-live` updates in dynamic areas such as calculator results.

## Responsiveness and Performance

The layout adapts from mobile to desktop with fluid typography and spacing:
- The gallery uses horizontal scroll with scroll‑snap and accessible keyboard interaction hints.
- Cards and sections scale via CSS clamps and responsive grids.
- Throttled scroll handlers via `requestAnimationFrame` minimize jank.
- Images are lazy‑loaded where applicable.

## Local Development

- Install dependencies:
  - `npm install`
- Start dev server:
  - `npm start` (default: http://localhost:3000)
- Run tests:
  - `npm test`
- Build production bundle:
  - `npm run build`

To customize environment variables for local runs, create a `.env` based on `.env.example`. Remember that CRA reads env at build time.

## Testing

Tests are implemented with React Testing Library and Jest:
- Location: `src/App.test.js`
- Coverage includes:
  - Rendering of SPA sections and footer
  - Theme toggle accessibility label updates
  - Skip link and anchor navigation presence

Run tests:
- `npm test` (watch mode)
- CI mode: `CI=true npm test`

## Theming

`ThemeProvider` provides a `theme` state and `toggleTheme()` for light/dark modes:
- Theme is persisted in `localStorage`.
- The current theme is reflected via `data-theme` attribute and used by CSS variables.

## Security and Secrets

Do not hardcode secrets. All configuration must be provided via environment variables at build/deploy time. Avoid logging sensitive data. This SPA uses HTTPS when deployed behind a secure proxy; ensure appropriate headers and TLS termination are configured at the edge.

## Folder Structure (excerpt)

- `src/index.js` — React entry point
- `src/App.js` — SPA composition and scrolling behavior
- `src/components/*` — UI components, feature flags, and theme provider
- `src/hooks/*` — parallax and intersection reveal
- `src/utils/*` — accessibility and environment utilities
- `src/index.css`, `src/App.css` — styles for base and components
