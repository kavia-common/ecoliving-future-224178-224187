import { getFeatureFlags, getExperimentsEnabled } from '../utils/env';

/**
 * PUBLIC_INTERFACE
 * isFeatureEnabled: check feature flag map for specific feature
 */
export function isFeatureEnabled(flagName) {
  const flags = getFeatureFlags();
  return Boolean(flags[flagName]);
}

/**
 * PUBLIC_INTERFACE
 * experimentsEnabled: global experiment switch
 */
export function experimentsEnabled() {
  return getExperimentsEnabled();
}
