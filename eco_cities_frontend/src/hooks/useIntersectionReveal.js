import React from 'react';

/**
 * PUBLIC_INTERFACE
 * useIntersectionReveal
 * Returns boolean visible; if IntersectionObserver unsupported, returns true.
 */
export default function useIntersectionReveal(ref) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) {
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
/**
 * PUBLIC_INTERFACE
 * getEnv: generic safe getter for env variables
 */
export function getEnv(key, defaultValue = '') {
  return safe(process.env[key], defaultValue);
}

/**
 * PUBLIC_INTERFACE
 * getLogLevel: maps to supported values with default
 */
export function getLogLevel() {
  const lvl = getEnv('REACT_APP_LOG_LEVEL', 'info').toLowerCase();
  const allowed = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];
  return allowed.includes(lvl) ? lvl : 'info';
}

/**
 * PUBLIC_INTERFACE
 * getFeatureFlags: parse JSON or CSV map from REACT_APP_FEATURE_FLAGS
 */
export function getFeatureFlags() {
  const raw = getEnv('REACT_APP_FEATURE_FLAGS', '');
  try {
    if (!raw) return {};
    if (raw.trim().startsWith('{')) {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed ? parsed : {};
    }
    // CSV like "calculator,advancedParallax"
    return raw.split(',').map(s => s.trim()).filter(Boolean).reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

/**
 * PUBLIC_INTERFACE
 * getExperimentsEnabled
 */
export function getExperimentsEnabled() {
  return getEnv('REACT_APP_EXPERIMENTS_ENABLED', 'false') === 'true';
}

/**
 * PUBLIC_INTERFACE
 * specific getters with defaults
 */
export const getApiBase = () => getEnv('REACT_APP_API_BASE', '');
export const getBackendUrl = () => getEnv('REACT_APP_BACKEND_URL', '');
export const getFrontendUrl = () => getEnv('REACT_APP_FRONTEND_URL', '');
export const getWsUrl = () => getEnv('REACT_APP_WS_URL', '');
export const getNodeEnv = () => getEnv('REACT_APP_NODE_ENV', 'development');
export const getPort = () => Number(getEnv('REACT_APP_PORT', '3000')) || 3000;
export const getHealthPath = () => getEnv('REACT_APP_HEALTHCHECK_PATH', '/health');
