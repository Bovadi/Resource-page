let tooltipEl = null;
let hideTimeout = null;
let longPressTimeout = null;
let activeTarget = null;

function getTooltipElement() {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'app-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.id = 'app-tooltip';
    document.body.appendChild(tooltipEl);
  }
  return tooltipEl;
}

function positionTooltip(target) {
  const tip = getTooltipElement();
  const rect = target.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const gap = 8;
  const viewportPadding = 12;

  let top = rect.top - tipRect.height - gap;
  let left = rect.left + rect.width / 2 - tipRect.width / 2;

  if (top < viewportPadding) {
    top = rect.bottom + gap;
    tip.classList.add('app-tooltip--below');
    tip.classList.remove('app-tooltip--above');
  } else {
    tip.classList.add('app-tooltip--above');
    tip.classList.remove('app-tooltip--below');
  }

  left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tipRect.width - viewportPadding));

  tip.style.top = `${top + window.scrollY}px`;
  tip.style.left = `${left + window.scrollX}px`;
}

function showTooltip(target) {
  clearTimeout(hideTimeout);
  const text = target.getAttribute('data-tooltip');
  if (!text) return;

  activeTarget = target;
  const tip = getTooltipElement();
  tip.textContent = text;
  tip.style.visibility = 'hidden';
  tip.classList.add('app-tooltip--visible');

  requestAnimationFrame(() => {
    positionTooltip(target);
    tip.style.visibility = '';
  });
}

function hideTooltip() {
  activeTarget = null;
  clearTimeout(hideTimeout);
  const tip = getTooltipElement();
  tip.classList.remove('app-tooltip--visible');
}

function handleMouseEnter(e) {
  const target = e.target.closest('[data-tooltip]');
  if (!target) return;
  showTooltip(target);
}

function handleMouseLeave(e) {
  const target = e.target.closest('[data-tooltip]');
  if (!target) return;
  hideTimeout = setTimeout(hideTooltip, 80);
}

function handleFocusIn(e) {
  const target = e.target.closest('[data-tooltip]');
  if (target) showTooltip(target);
}

function handleFocusOut(e) {
  const target = e.target.closest('[data-tooltip]');
  if (target) hideTooltip();
}

function handleTouchStart(e) {
  const target = e.target.closest('[data-tooltip]');
  if (!target) {
    hideTooltip();
    return;
  }
  clearTimeout(longPressTimeout);
  longPressTimeout = setTimeout(() => {
    e.preventDefault();
    showTooltip(target);
  }, 500);
}

function handleTouchEnd() {
  clearTimeout(longPressTimeout);
  if (activeTarget) {
    hideTimeout = setTimeout(hideTooltip, 1500);
  }
}

function handleTouchMove() {
  clearTimeout(longPressTimeout);
}

function handleScroll() {
  if (activeTarget) hideTooltip();
}

export function initTooltips() {
  document.addEventListener('mouseenter', handleMouseEnter, true);
  document.addEventListener('mouseleave', handleMouseLeave, true);
  document.addEventListener('focusin', handleFocusIn, true);
  document.addEventListener('focusout', handleFocusOut, true);
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, true);
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
}
