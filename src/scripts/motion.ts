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

  const ease = 'power3.out';
  const root = document.documentElement;
  const hidden = { opacity: 0 };
  const shown = { opacity: 1, clearProps: 'transform' };

  // Hero: entrada al cargar. El h1 y la imagen (candidatos a LCP) solo mueven transform; nunca se ocultan.
  // Espera a que la imagen del hero esté decodificada (máx. 1,2 s) para que la entrada no corra con el cuadro en blanco.
  const heroImg = document.querySelector<HTMLImageElement>('.hero-card-img');
  if (heroImg) await Promise.race([heroImg.decode().catch(() => undefined), new Promise((r) => setTimeout(r, 1200))]);
  const hero = gsap.timeline({ defaults: { ease, duration: 0.9 } });
  hero
    .from('#hero-title', { y: 32, duration: 0.8 })
    .fromTo('.hero-sub', { ...hidden, y: 24 }, { ...shown, y: 0, duration: 0.7 }, '-=0.5')
    .fromTo('.hero-cta', { ...hidden, y: 24 }, { ...shown, y: 0, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.45')
    .from('.hero-card--main', { y: 48, scale: 0.92, rotate: -2, duration: 1.1, ease: 'back.out(1.3)' }, 0.1)
    .fromTo('.hero-clients .client-card', { ...hidden, y: 24 }, { ...shown, y: 0, duration: 0.6, stagger: 0.07 }, '-=0.6');

  // Cabeceras de sección: suben y aparecen (el h1 queda fuera).
  gsap.utils.toArray<HTMLElement>('main section:not(#inicio) h2, main section:not(#inicio) h2 + p').forEach((el) => {
    gsap.fromTo(
      el,
      { ...hidden, y: 28 },
      { ...shown, y: 0, duration: 0.8, ease, scrollTrigger: { trigger: el, start: 'top 90%', once: true } },
    );
  });

  // Tarjetas y pasos: entran en cascada por grupo.
  ['.case-item', '.team-card', '.include-item', '.step', '.fw-item'].forEach((sel) => {
    const items = gsap.utils.toArray<HTMLElement>(sel);
    if (!items.length) return;
    ScrollTrigger.batch(items, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(batch, { ...hidden, y: 36, scale: 0.97 }, { ...shown, y: 0, scale: 1, duration: 0.7, ease, stagger: 0.09, overwrite: true }),
    });
  });

  root.setAttribute('data-motion-ready', '');

  // Parallax suave del arte del hero (solo transform, sin opacity).
  const art = document.querySelector<HTMLElement>('.hero-showcase');
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

  // FAQ: <details> nativo con apertura y cierre animados. El teclado y el lector de pantalla no cambian
  // (Enter y Espacio siguen disparando el clic del summary); sin JS se abre y cierra de golpe.
  document.querySelectorAll<HTMLDetailsElement>('.faq-item').forEach((item) => {
    const summary = item.querySelector<HTMLElement>('.faq-summary');
    const answer = item.querySelector<HTMLElement>('.faq-answer');
    const bar = item.querySelector<SVGElement>('.faq-icon-v');
    const disc = item.querySelector<SVGElement>('.faq-icon-disc');
    const icon = item.querySelector<SVGElement>('.faq-icon');
    if (!summary || !answer) return;
    gsap.set(bar, { transformOrigin: '50% 50%', rotation: item.open ? 90 : 0 });

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      gsap.killTweensOf([answer, answer.firstElementChild, bar, icon, disc]);
      gsap.set(answer, { clearProps: 'height,overflow,paddingTop,paddingBottom,borderTopWidth,boxSizing' });
      const cs = getComputedStyle(answer);
      const edge = { paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, borderTopWidth: cs.borderTopWidth };
      if (!item.open) {
        item.open = true;
        gsap.fromTo(answer, { height: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0, overflow: 'hidden', boxSizing: 'content-box' }, { height: 'auto', ...edge, duration: 0.45, ease: 'power3.out', clearProps: 'height,overflow,paddingTop,paddingBottom,borderTopWidth,boxSizing' });
        gsap.fromTo(answer.firstElementChild, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.08, ease, clearProps: 'opacity,transform' });
        gsap.to(bar, { rotation: 90, duration: 0.4, ease: 'back.out(2)' });
        gsap.fromTo(icon, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', transformOrigin: '50% 50%' });
      } else {
        gsap.to(answer.firstElementChild, { opacity: 0, y: -6, duration: 0.18, ease: 'power2.in' });
        gsap.to(bar, { rotation: 0, duration: 0.3, ease: 'power2.inOut' });
        const content = answer.getBoundingClientRect().height - parseFloat(edge.paddingTop) - parseFloat(edge.paddingBottom) - parseFloat(edge.borderTopWidth);
        gsap.fromTo(answer, { height: content, boxSizing: 'content-box', overflow: 'hidden' }, {
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            item.open = false;
            gsap.set([answer, answer.firstElementChild], { clearProps: 'height,overflow,opacity,transform,paddingTop,paddingBottom,borderTopWidth,boxSizing' });
          },
        });
      }
    });
  });

  // Lenis: inercia de scroll solo con ratón o trackpad.
  if (window.matchMedia('(pointer: fine)').matches) {
    const { default: Lenis } = await import('lenis');
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -24 }, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

if (query.matches) {
  void start();
}
