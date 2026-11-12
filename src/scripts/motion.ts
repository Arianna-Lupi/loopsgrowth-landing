/**
 * Movimiento de la página (GSAP + ScrollTrigger + Lenis). Mejora progresiva:
 * - Solo corre con `prefers-reduced-motion: no-preference`; con `reduce` no se descarga nada.
 * - Sin JavaScript todo se ve: el estado inicial oculto lo pone GSAP, nunca el CSS.
 * - Solo anima `transform` y `opacity`. El h1 y la imagen del hero no se ocultan (LCP).
 * - Sin bucles infinitos. Lenis solo con puntero fino (en táctil el desplazamiento nativo ya es suave).
 */
const query = window.matchMedia('(prefers-reduced-motion: no-preference)');

async function start(): Promise<void> {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);

  // Lenis: inercia de scroll solo con ratón o trackpad.
  if (window.matchMedia('(pointer: fine)').matches) {
    const { default: Lenis } = await import('lenis');
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -24 }, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const ease = 'power3.out';

  // Cabeceras de sección: suben y aparecen (el h1 queda fuera).
  gsap.utils.toArray<HTMLElement>('main section:not(#inicio) h2, main section:not(#inicio) h2 + p').forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Tarjetas y pasos: entran en cascada por grupo.
  const groups: string[] = ['.client-card', '.case-item', '.team-card', '.include-item', '.step', '.fw-item'];
  groups.forEach((sel) => {
    const items = gsap.utils.toArray<HTMLElement>(sel);
    if (!items.length) return;
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.from(batch, { y: 36, opacity: 0, scale: 0.97, duration: 0.7, ease, stagger: 0.09, overwrite: true }),
    });
  });

  // Parallax suave del arte del hero (solo transform, sin opacity).
  const art = document.querySelector<HTMLElement>('.hero-card--main');
  if (art && window.matchMedia('(min-width: 64em)').matches) {
    gsap.to(art, {
      y: 36,
      ease: 'none',
      scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
  }

  // Botones: leve rebote al pasar el puntero o enfocar con teclado.
  document.querySelectorAll<HTMLElement>('.header-cta, .hero-cta a, .lead-next, .lead-submit').forEach((btn) => {
    const up = () => gsap.to(btn, { y: -2, duration: 0.2, ease });
    const down = () => gsap.to(btn, { y: 0, duration: 0.3, ease: 'back.out(2)' });
    btn.addEventListener('pointerenter', up);
    btn.addEventListener('pointerleave', down);
  });
}

if (query.matches) {
  const run = () => void start();
  if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1500 });
  else setTimeout(run, 200);
}
