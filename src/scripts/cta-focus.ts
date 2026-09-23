/**
 * Único JS propio de la página (FORM-02). El ancla nativa hace el desplazamiento;
 * este script mueve el foco al h2 de #agenda para que el teclado y el lector
 * de pantalla queden dentro de la sección, y carga de forma diferida el iframe
 * y el script de ClickUp cuando el usuario se acerca a la sección o interactúa
 * con un CTA, evitando 14 MB de descarga y 43 cookies en la carga inicial.
 */
const HASH = '#agenda';
const TITLE_ID = 'agenda-title';

function focusTitle(): void {
  document.getElementById(TITLE_ID)?.focus({ preventScroll: true });
}

let clickUpLoaded = false;

function loadClickUp(): void {
  if (clickUpLoaded) return;
  clickUpLoaded = true;

  const iframe = document.querySelector<HTMLIFrameElement>('iframe.clickup-embed[data-src]');
  if (iframe && iframe.dataset.src) {
    iframe.src = iframe.dataset.src;
  }

  const placeholderScript = document.querySelector<HTMLScriptElement>('script[data-src]');
  if (placeholderScript && placeholderScript.dataset.src) {
    const s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.src = placeholderScript.dataset.src;
    placeholderScript.parentNode?.replaceChild(s, placeholderScript);
  }
}

// El salto de ancla a un destino no enfocable vacía el foco: hay que enfocar
// después de la navegación por defecto, no durante el clic.
function focusAfterNavigation(): void {
  loadClickUp();
  setTimeout(focusTitle, 0);
}

document.addEventListener('click', (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (event.target instanceof Element && event.target.closest('a[href="#agenda"]')) {
    focusAfterNavigation();
  }
});

window.addEventListener('hashchange', () => {
  if (location.hash === HASH) focusAfterNavigation();
});

// Carga perezosa por proximidad a la sección #agenda
const agendaSection = document.getElementById('agenda');
if (agendaSection) {
  agendaSection.addEventListener('focusin', loadClickUp, { once: true });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadClickUp();
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(agendaSection);
  } else {
    loadClickUp();
  }
}

// Carga directa con #agenda: el navegador termina el salto de ancla más tarde (con ClickUp
// bloqueado o lento, después de `load`) y puede vaciar el foco que ya se había puesto. Se
// reintenta cada 150 ms durante 1,5 s, solo mientras el foco esté vacío, y se detiene si la
// persona empieza a usar el teclado o el puntero para no robarle el foco.
if (location.hash === HASH) {
  loadClickUp();
  const deadline = performance.now() + 1500;
  let userActed = false;
  const stop = () => {
    userActed = true;
  };
  window.addEventListener('keydown', stop, { once: true });
  window.addEventListener('pointerdown', stop, { once: true });
  const tick = () => {
    if (userActed) return;
    const active = document.activeElement;
    if (!active || active === document.body) focusTitle();
    if (performance.now() < deadline) setTimeout(tick, 150);
  };
  setTimeout(tick, 0);
}
