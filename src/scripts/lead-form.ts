/**
 * Formulario de leads conversacional (#agenda). Ocho pasos: contacto, negocio y seis preguntas de
 * opción única. Validación propia accesible (novalidate), foco al enunciado de cada paso, progreso
 * anunciado y envío JSON a /api/lead con Turnstile. Sin dependencias.
 */
const form = document.getElementById('lead-form') as HTMLFormElement | null;

if (form) {
  const summary = document.getElementById('lead-summary') as HTMLElement;
  const statusEl = document.getElementById('lead-status') as HTMLElement;
  const success = document.getElementById('lead-success') as HTMLElement;
  const progressText = document.getElementById('lead-progress-text') as HTMLElement;
  const bar = document.getElementById('lead-bar-fill') as HTMLElement;
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('.lead-step'));
  const nextBtn = form.querySelector<HTMLButtonElement>('.lead-next')!;
  const backBtn = form.querySelector<HTMLButtonElement>('.lead-back')!;
  const submitBtn = form.querySelector<HTMLButtonElement>('.lead-submit')!;
  const msg = form.dataset;
  const EMAIL_RE = /^[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
  let current = 0;
  let sending = false;

  // ---------- Turnstile (se carga al tocar el formulario; la carga inicial no pide nada externo) ----------
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

  // ---------- Validación por paso ----------
  type Field = HTMLInputElement | HTMLSelectElement;
  const textInputs = (step: HTMLElement) => Array.from(step.querySelectorAll<Field>('.lead-field input, .lead-field select'));
  const radios = (step: HTMLElement) => Array.from(step.querySelectorAll<HTMLInputElement>('input[type="radio"]'));

  function setError(target: HTMLElement, errId: string, text: string | null): void {
    const err = document.getElementById(errId);
    if (!err) return;
    if (text) {
      err.textContent = text;
      err.hidden = false;
      target.setAttribute('aria-invalid', 'true');
    } else {
      err.textContent = '';
      err.hidden = true;
      target.removeAttribute('aria-invalid');
    }
  }

  function checkText(el: Field): boolean {
    const v = el.value.trim();
    if (!v) return (setError(el, `${el.id}-err`, msg.msgRequired!), false);
    if (el.name === 'email' && !EMAIL_RE.test(v)) return (setError(el, `${el.id}-err`, msg.msgEmail!), false);
    setError(el, `${el.id}-err`, null);
    return true;
  }

  /** Valida el paso; devuelve el primer elemento inválido (o null si todo está bien). */
  function validateStep(step: HTMLFieldSetElement): HTMLElement | null {
    const texts = textInputs(step);
    if (texts.length) {
      const bad = texts.filter((el) => !checkText(el));
      return bad[0] ?? null;
    }
    const group = radios(step);
    const first = group[0];
    const ok = group.some((r) => r.checked);
    const errId = `${first.id}-err`;
    const radiogroup = step.querySelector<HTMLElement>('.lead-chips')!;
    setError(radiogroup, errId, ok ? null : msg.msgRequired!);
    return ok ? null : first;
  }

  textInputs(form as unknown as HTMLElement).forEach((el) => {
    el.addEventListener('blur', () => el.value && checkText(el));
    el.addEventListener('input', () => el.hasAttribute('aria-invalid') && checkText(el));
    el.addEventListener('change', () => el.hasAttribute('aria-invalid') && checkText(el));
  });
  radios(form as unknown as HTMLElement).forEach((r) =>
    r.addEventListener('change', () => {
      const step = r.closest<HTMLFieldSetElement>('.lead-step')!;
      validateStep(step);
      summary.hidden = true;
    }),
  );

  // ---------- Navegación ----------
  function render(moveFocus: boolean, dir: 'forward' | 'back' = 'forward'): void {
    steps.forEach((s, i) => (s.hidden = i !== current));
    const last = current === steps.length - 1;
    backBtn.hidden = current === 0;
    nextBtn.hidden = last;
    submitBtn.hidden = !last;
    progressText.textContent = `${msg.stepWord} ${current + 1} ${msg.stepOf} ${steps.length}`;
    bar.style.setProperty('--lead-progress', String((current + 1) / steps.length));
    summary.hidden = true;
    if (moveFocus) {
      const step = steps[current];
      const cls = dir === 'forward' ? 'is-forward' : 'is-back';
      step.classList.remove('is-forward', 'is-back');
      step.classList.add(cls);
      step.addEventListener('animationend', (e) => e.target === step && step.classList.remove(cls), { once: false });
      step.querySelector<HTMLElement>('.lead-legend')?.focus();
    }
  }

  function showSummary(target: HTMLElement | null): void {
    summary.textContent = msg.msgSummary!;
    summary.hidden = false;
    target?.focus();
  }

  function goNext(): void {
    const bad = validateStep(steps[current]);
    if (bad) return showSummary(bad);
    current += 1;
    render(true);
  }

  nextBtn.addEventListener('click', goNext);
  backBtn.addEventListener('click', () => {
    if (current === 0) return;
    current -= 1;
    render(true, 'back');
  });

  // ---------- Envío ----------
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    // Enter en un campo de un paso intermedio avanza en lugar de enviar.
    if (current < steps.length - 1) return goNext();

    const bad = validateStep(steps[current]);
    if (bad) return showSummary(bad);

    // Solo en `astro dev` y con ?demo en la URL: enseña el estado de éxito sin enviar nada (se elimina del build).
    if (import.meta.env.DEV && location.search.includes('demo')) {
      form.hidden = true;
      success.hidden = false;
      document.getElementById('agenda')?.setAttribute('data-sent', '');
      success.focus();
      return;
    }

    sending = true;
    submitBtn.setAttribute('aria-disabled', 'true');
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
      document.getElementById('agenda')?.setAttribute('data-sent', '');
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
      submitBtn.removeAttribute('aria-disabled');
      if (form.hidden) statusEl.textContent = '';
    }
  });

  render(false);
}
