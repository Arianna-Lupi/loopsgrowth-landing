/**
 * Formulario de leads (#agenda). Validación propia accesible (novalidate), envío JSON a /api/lead y
 * estados anunciados: errores por campo con aria-invalid + aria-describedby, resumen con foco y
 * éxito con foco. Sin dependencias.
 */
const form = document.getElementById('lead-form') as HTMLFormElement | null;

if (form) {
  const summary = document.getElementById('lead-summary') as HTMLElement;
  const statusEl = document.getElementById('lead-status') as HTMLElement;
  const success = document.getElementById('lead-success') as HTMLElement;
  const submit = form.querySelector<HTMLButtonElement>('.lead-submit')!;
  const msg = form.dataset;
  const EMAIL_RE = /^[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.lead-field input, .lead-field select'));
  let sending = false;

  // Turnstile (anti-bot). El script de Cloudflare solo se pide cuando la persona toca el formulario,
  // así la carga inicial de la landing no hace ninguna petición externa.
  type TurnstileApi = {
    render: (el: HTMLElement, opts: Record<string, unknown>) => string;
    reset: (id?: string) => void;
  };
  const tsHost = document.getElementById('lead-turnstile') as HTMLElement;
  let tsApi: TurnstileApi | undefined;
  let tsId: string | undefined;
  let tsToken = '';
  let tsWaiter: ((t: string) => void) | null = null;
  let tsLoading = false;

  function loadTurnstile(): void {
    if (tsLoading) return;
    tsLoading = true;
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => {
      tsApi = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (!tsApi) return;
      tsId = tsApi.render(tsHost, {
        sitekey: form.dataset.sitekey,
        language: 'es',
        appearance: 'interaction-only',
        callback: (t: string) => {
          tsToken = t;
          tsWaiter?.(t);
          tsWaiter = null;
        },
        'expired-callback': () => {
          tsToken = '';
        },
        'error-callback': () => {
          tsToken = '';
        },
      });
    };
    document.head.appendChild(s);
  }

  function getToken(timeoutMs = 15000): Promise<string> {
    if (tsToken) return Promise.resolve(tsToken);
    loadTurnstile();
    return new Promise((resolve) => {
      tsWaiter = resolve;
      setTimeout(() => resolve(''), timeoutMs);
    });
  }

  form.addEventListener('focusin', loadTurnstile, { once: true });
  form.addEventListener('pointerenter', loadTurnstile, { once: true });

  const errorEl = (el: Element) => document.getElementById(`${el.id}-err`)!;

  function setError(el: HTMLInputElement | HTMLSelectElement, text: string | null): void {
    const err = errorEl(el);
    if (text) {
      err.textContent = text;
      err.hidden = false;
      el.setAttribute('aria-invalid', 'true');
    } else {
      err.textContent = '';
      err.hidden = true;
      el.removeAttribute('aria-invalid');
    }
  }

  function check(el: HTMLInputElement | HTMLSelectElement): boolean {
    const v = el.value.trim();
    if (!v) return (setError(el, msg.msgRequired!), false);
    if (el.name === 'email' && !EMAIL_RE.test(v)) return (setError(el, msg.msgEmail!), false);
    setError(el, null);
    return true;
  }

  fields.forEach((el) => el.addEventListener('blur', () => el.value && check(el)));
  fields.forEach((el) => el.addEventListener('input', () => el.hasAttribute('aria-invalid') && check(el)));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;

    const invalid = fields.filter((el) => !check(el));
    if (invalid.length) {
      summary.textContent = msg.msgSummary!;
      summary.hidden = false;
      invalid[0].focus();
      return;
    }
    summary.hidden = true;

    sending = true;
    submit.setAttribute('aria-disabled', 'true');
    statusEl.textContent = msg.msgSending!;

    const payload: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      payload[key] = String(value).trim();
    });
    payload.turnstileToken = await getToken();

    try {
      const res = await fetch(form.dataset.endpoint!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      statusEl.textContent = '';
      // El token de Turnstile es de un solo uso: se pide uno nuevo para el reintento.
      tsToken = '';
      if (tsApi) tsApi.reset(tsId);
      summary.textContent = msg.msgSend!;
      summary.hidden = false;
      summary.focus();
    } finally {
      sending = false;
      submit.removeAttribute('aria-disabled');
      if (form.hidden) statusEl.textContent = '';
    }
  });
}
