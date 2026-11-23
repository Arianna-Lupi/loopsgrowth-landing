/**
 * Entradas del home (prueba de Juan, 2026-11-23). Método del skill reanimate aplicado a skale.so: se midió su CSS y sus
 * entradas son fade-up de 8 a 12 px, 350 a 500 ms con ease-out, escalonadas de 100 a 140 ms por elemento, disparadas al
 * entrar en pantalla. Aquí: 12 px, 400 ms, ease-out de marca, 110 ms de escalón (tope de 5 escalones).
 *
 * Sin CSS que pise el hover de las tarjetas: se anima con la Web Animations API (`fill: backwards`), de modo que al
 * terminar cada elemento vuelve a su estilo estático y `getAnimations()` queda en 0. Con `prefers-reduced-motion:
 * reduce`, sin IntersectionObserver o sin JavaScript no ocurre nada y todo se ve desde el primer cuadro. El hero
 * parte oculto por reveal.css solo mientras `html.js-reveal` existe (lo pone un script en línea del head y lo quita aquí
 * o a los 1,5 s si este módulo no llegó a ejecutarse).
 */
import { COUNT_SELECTOR, GROUPS, HERO_SELECTOR } from './reveal-selectors';

const DURATION = 400;
const STEP = 110;
const MAX_STEPS = 5;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const FROM = { opacity: 0, transform: 'translateY(12px)' };
const TO = { opacity: 1, transform: 'none' };

function play(el: Element, index: number): void {
  el.classList.add('rv-done');
  el.animate([FROM, TO], { duration: DURATION, delay: Math.min(index, MAX_STEPS) * STEP, easing: EASE, fill: 'backwards' });
}

const ES_THOUSANDS = /^\d{1,3}(\.\d{3})+$/;

/** Cuenta de 0 al valor de una cifra como "+85%", "x3" o "+3.808%", sin saltos de ancho y con el valor final para lectores. */
function countUp(el: HTMLElement, delay: number): void {
  const text = el.textContent?.trim() ?? '';
  const m = text.match(/^([^\d]*)([\d.,]+)(.*)$/);
  el.classList.add('rv-done');
  if (!m) return;
  const [, prefix, raw, suffix] = m;
  const grouped = ES_THOUSANDS.test(raw);
  const target = Number(grouped ? raw.replace(/\./g, '') : raw.replace(',', '.'));
  if (!Number.isFinite(target)) return;
  const decimals = !grouped && /[.,]\d+$/.test(raw) ? (raw.split(/[.,]/)[1] ?? '').length : 0;
  const fmt = (v: number) => {
    const n = decimals ? v.toFixed(decimals).replace('.', ',') : String(Math.round(v));
    return prefix + (grouped ? n.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : n) + suffix;
  };
  // El ancho final se reserva antes de contar: la cifra no empuja a sus vecinas.
  el.style.display = 'inline-block';
  el.style.minWidth = `${el.offsetWidth}px`;
  const sr = document.createElement('span');
  sr.className = 'rv-sr';
  sr.textContent = text;
  el.after(sr);
  el.setAttribute('aria-hidden', 'true');
  el.textContent = fmt(0);
  const start = performance.now() + delay;
  const total = 1400;
  const tick = (now: number) => {
    const t = Math.min(Math.max((now - start) / total, 0), 1);
    el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = text;
  };
  requestAnimationFrame(tick);
}

function run(): void {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = [...document.querySelectorAll(HERO_SELECTOR)];
  if (reduce || !('IntersectionObserver' in window) || typeof Element.prototype.animate !== 'function') {
    hero.forEach((el) => el.classList.add('rv-done'));
    root.classList.remove('js-reveal');
    (window as unknown as { __rvReady?: boolean }).__rvReady = true;
    return;
  }
  hero.forEach((el, i) => play(el, i));

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        const index = Number((entry.target as HTMLElement).dataset.rvI ?? 0);
        if (entry.target.matches(COUNT_SELECTOR)) countUp(entry.target as HTMLElement, index * STEP);
        else play(entry.target, index);
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  );
  for (const selector of GROUPS) {
    const groups = new Map<Element | null, Element[]>();
    for (const el of document.querySelectorAll(selector)) {
      if (el.closest('#inicio')) continue;
      const parent = el.parentElement;
      groups.set(parent, [...(groups.get(parent) ?? []), el]);
    }
    for (const els of groups.values()) {
      els.forEach((el, i) => {
        (el as HTMLElement).dataset.rvI = String(i);
        io.observe(el);
      });
    }
  }
  // Las cifras de los casos cuentan al entrar, escalonadas igual que sus tarjetas.
  document.querySelectorAll(COUNT_SELECTOR).forEach((el, i) => {
    (el as HTMLElement).dataset.rvI = String(i);
    io.observe(el);
  });
  // Imprimir o buscar en la página no debe dejar texto oculto: al imprimir todo se muestra.
  addEventListener('beforeprint', () => document.querySelectorAll('[data-rv-i], .hero-copy > *, .hero-clients').forEach((el) => el.classList.add('rv-done')));
  (window as unknown as { __rvReady?: boolean }).__rvReady = true;
}

run();
