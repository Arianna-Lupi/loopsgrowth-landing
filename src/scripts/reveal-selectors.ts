/** Selectores de las entradas del home (módulo puro: lo comparten reveal.ts y la lista blanca de las pruebas e2e). */

/** Hero: entra al cargar. reveal.css oculta estos mismos elementos hasta que reveal.ts los marca con `.rv-done`. */
export const HERO_SELECTOR = '#inicio .hero-copy > *:not([aria-hidden]), #inicio .hero-clients';

/** Secciones: entran al verse. Cada grupo escalona a sus hermanos directos. */
export const GROUPS: readonly string[] = [
  '.section-head > *',
  '.section-body > :is(ul, ol) > li:not([data-rv-tl])',
  '.section-body > :not(:is(ul, ol))',
  '.section-cta',
  '#agenda .agenda-copy > *',
  '#faq .faq-item',
  '#faq > .wrap > h2',
];

/** Todo lo que reveal.ts puede animar con la Web Animations API (opacity y transform, finito, sin iteraciones). */
/** Elementos que una landing marca a mano con `data-rv` (y `data-rv="count"` para cifras que cuentan). */
export const ATTR_SELECTOR = '[data-rv]';

/** Línea de tiempo: el `li` coordina punto, línea y texto (`data-rv-tl`). */
export const TIMELINE_SELECTOR = '[data-rv-tl]';

export const REVEAL_ANY = [HERO_SELECTOR, ...GROUPS, ATTR_SELECTOR, '[data-rv-tl] .dot', '[data-rv-tl] .line', '[data-rv-tl] .tl-body', '[data-rv-tl="h"] .step-body'].join(', ');

/** Cifras de los casos: cuentan de 0 a su valor al entrar (reveal.ts). */
export const COUNT_SELECTOR = '.metric-mark';
