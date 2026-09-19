/**
 * Único JS propio de la página (FORM-02). El ancla nativa hace el desplazamiento;
 * este script solo mueve el foco al h2 de #agenda para que el teclado y el lector
 * de pantalla queden dentro de la sección. Sin ancla ni script la página sigue
 * funcionando. Solo compara location.hash con el literal `#agenda` y usa un id fijo.
 */
const HASH = '#agenda';
const TITLE_ID = 'agenda-title';

function focusTitle(): void {
  document.getElementById(TITLE_ID)?.focus({ preventScroll: true });
}

// El salto de ancla a un destino no enfocable vacía el foco: hay que enfocar
// después de la navegación por defecto, no durante el clic.
function focusAfterNavigation(): void {
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

// Carga directa con #agenda: el navegador termina el salto de ancla más tarde y
// puede vaciar el foco. Se enfoca ya y se reintenta al cargar solo si el foco quedó vacío.
if (location.hash === HASH) {
  focusAfterNavigation();
  window.addEventListener(
    'load',
    () =>
      setTimeout(() => {
        if (!document.activeElement || document.activeElement === document.body) focusTitle();
      }, 0),
    { once: true },
  );
}
