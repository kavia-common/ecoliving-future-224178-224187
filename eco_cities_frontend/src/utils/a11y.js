let liveRegion;

/**
 * PUBLIC_INTERFACE
 * ensureFocusAfterJump: set tabindex and focus target after in-page navigation
 */
export function ensureFocusAfterJump(el) {
  if (!el) return;
  if (!el.hasAttribute('tabindex')) {
    el.setAttribute('tabindex', '-1');
    const onBlur = () => {
      el.removeAttribute('tabindex');
      el.removeEventListener('blur', onBlur);
    };
    el.addEventListener('blur', onBlur);
  }
  el.focus({ preventScroll: true });
}

/**
 * PUBLIC_INTERFACE
 * announce: speak a polite message through a live region
 */
export function announce(message) {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = message;
}
