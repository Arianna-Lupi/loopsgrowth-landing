/**
 * Acordeones del FAQ (`<details>`): abren y cierran animando la altura. El `<details>` nativo sigue siendo la fuente de
 * verdad (teclado, estado `open`, lectores de pantalla); aquí solo se retrasa el cierre hasta que acaba la animación y se
 * anima `height` con la Web Animations API. Con `prefers-reduced-motion: reduce` o sin Web Animations no se intercepta
 * nada y el comportamiento es el nativo, instantáneo.
 */
const DURATION = 280;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const SELECTOR = '.faq-item, .faq details, #faq details';

function settle(d: HTMLDetailsElement): void {
  d.style.height = '';
  d.style.overflow = '';
  d.classList.remove('is-closing', 'is-opening');
}

function toggle(d: HTMLDetailsElement): void {
  const summary = d.querySelector('summary') as HTMLElement;
  const running = d.getAnimations().find((a) => a.id === 'acc');
  running?.cancel();
  const from = d.getBoundingClientRect().height;
  const closing = d.open;
  if (closing) {
    d.classList.add('is-closing');
    d.style.overflow = 'hidden';
    const to = summary.getBoundingClientRect().height + (parseFloat(getComputedStyle(d).borderBlockWidth) || 0) * 2;
    const a = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: DURATION, easing: EASE });
    a.id = 'acc';
    a.onfinish = () => { d.open = false; settle(d); };
    a.oncancel = () => settle(d);
  } else {
    d.open = true;
    d.classList.add('is-opening');
    d.style.overflow = 'hidden';
    const to = d.getBoundingClientRect().height;
    const a = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: DURATION, easing: EASE });
    a.id = 'acc';
    a.onfinish = () => settle(d);
    a.oncancel = () => settle(d);
  }
}

function init(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof Element.prototype.animate !== 'function') return;
  const seen = new Set<Element>();
  for (const el of document.querySelectorAll(SELECTOR)) {
    if (!(el instanceof HTMLDetailsElement) || seen.has(el)) continue;
    seen.add(el);
    el.querySelector('summary')?.addEventListener('click', (event) => {
      event.preventDefault();
      toggle(el);
    });
  }
}

init();
