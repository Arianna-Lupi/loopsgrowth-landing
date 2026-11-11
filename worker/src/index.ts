/**
 * Worker de leads de Loops Growth.
 * POST /  (JSON) -> crea la tarea en la Lista Onboarding de ClickUp y avisa por email a LEAD_TO_EMAIL.
 * El lead no se pierde: si falla ClickUp o el email, basta con que funcione uno de los dos.
 */
import opts from '../../src/lib/lead-options.json';

interface Env {
  CLICKUP_API_TOKEN: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET?: string;
  ALLOWED_ORIGINS: string;
  LEAD_TO_EMAIL: string;
  LEAD_FROM_EMAIL: string;
}

const LABEL_KEYS = ['country', 'structure', 'revenue', 'doingSeo', 'budget', 'source'] as const;
const TEXT_KEYS = ['name', 'email', 'company', 'website', 'sector'] as const;

const EMAIL_RE = /^[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

const LABELS_ES: Record<string, string> = {
  name: 'Nombre',
  email: 'Correo electrónico',
  company: 'Compañía',
  website: 'Sitio web',
  sector: 'Sector / Industria',
  country: 'País',
  structure: 'Tipo de estructura',
  revenue: 'Facturación anual',
  doingSeo: '¿Hacen SEO actualmente?',
  budget: 'Presupuesto SEO/GEO mensual',
  source: '¿De dónde nos conoce?',
};

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
  const ok = origin && (allowed.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin));
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors },
  });
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

type Lead = Record<(typeof TEXT_KEYS)[number] | (typeof LABEL_KEYS)[number], string>;

function validate(input: any): { lead?: Lead; errors?: Record<string, string> } {
  const errors: Record<string, string> = {};
  const lead = {} as Lead;
  for (const k of TEXT_KEYS) {
    const v = typeof input?.[k] === 'string' ? input[k].trim() : '';
    if (!v) errors[k] = 'required';
    else if (v.length > 200) errors[k] = 'too_long';
    else lead[k] = v;
  }
  if (lead.email && !EMAIL_RE.test(lead.email)) errors.email = 'invalid';
  for (const k of LABEL_KEYS) {
    const v = typeof input?.[k] === 'string' ? input[k] : '';
    if (!opts.labels[k].options.some(([label]) => label === v)) errors[k] = v ? 'invalid' : 'required';
    else lead[k] = v;
  }
  return Object.keys(errors).length ? { errors } : { lead };
}

async function verifyTurnstile(token: unknown, env: Env, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true;
  if (typeof token !== 'string' || !token) return false;
  const body = new FormData();
  body.set('secret', env.TURNSTILE_SECRET);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = (await r.json()) as { success?: boolean };
  return data.success === true;
}

async function createClickUpTask(lead: Lead, env: Env): Promise<string> {
  const idFor = (k: (typeof LABEL_KEYS)[number]) =>
    opts.labels[k].options.find(([label]) => label === lead[k])![1];
  const custom_fields = [
    { id: opts.text.company, value: lead.company },
    { id: opts.text.email, value: lead.email },
    { id: opts.text.website, value: lead.website },
    { id: opts.text.sector, value: lead.sector },
    ...LABEL_KEYS.map((k) => ({ id: opts.labels[k].fieldId, value: [idFor(k)] })),
  ];
  const markdown = [...TEXT_KEYS, ...LABEL_KEYS].map((k) => `**${LABELS_ES[k]}:** ${lead[k]}`).join('\n');
  const r = await fetch(`https://api.clickup.com/api/v2/list/${opts.listId}/task`, {
    method: 'POST',
    headers: { Authorization: env.CLICKUP_API_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `${lead.company} - ${lead.name}`,
      markdown_description: `Lead desde loopsgrowth.com\n\n${markdown}`,
      tags: ['lead-web'],
      custom_fields,
    }),
  });
  if (!r.ok) throw new Error(`ClickUp ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return ((await r.json()) as { url?: string }).url ?? '';
}

async function sendEmail(lead: Lead, taskUrl: string, env: Env): Promise<void> {
  const rows = [...TEXT_KEYS, ...LABEL_KEYS]
    .map((k) => `<tr><td style="padding:4px 12px 4px 0;color:#555"><b>${esc(LABELS_ES[k])}</b></td><td>${esc(lead[k])}</td></tr>`)
    .join('');
  const html = `<h2>Nuevo lead: ${esc(lead.company)}</h2><table>${rows}</table>${
    taskUrl ? `<p><a href="${esc(taskUrl)}">Abrir tarea en ClickUp</a></p>` : ''
  }`;
  const text = [...TEXT_KEYS, ...LABEL_KEYS].map((k) => `${LABELS_ES[k]}: ${lead[k]}`).join('\n') + (taskUrl ? `\n\n${taskUrl}` : '');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_FROM_EMAIL,
      to: [env.LEAD_TO_EMAIL],
      reply_to: lead.email,
      subject: `Nuevo lead: ${lead.company} (${lead.name})`,
      html,
      text,
    }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(req.headers.get('Origin'), env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, cors);

    let input: any;
    try {
      input = await req.json();
    } catch {
      return json({ ok: false, error: 'bad_json' }, 400, cors);
    }

    // Honeypot: un bot rellena el campo oculto. Respuesta de éxito falsa para no darle señal.
    if (typeof input?.hp === 'string' && input.hp !== '') return json({ ok: true }, 200, cors);

    if (!(await verifyTurnstile(input?.turnstileToken, env, req.headers.get('CF-Connecting-IP')))) {
      return json({ ok: false, error: 'captcha' }, 400, cors);
    }

    const { lead, errors } = validate(input);
    if (!lead) return json({ ok: false, error: 'validation', fields: errors }, 422, cors);

    let taskUrl = '';
    const [task, mail] = await (async () => {
      const t = await Promise.allSettled([createClickUpTask(lead, env)]);
      if (t[0].status === 'fulfilled') taskUrl = t[0].value;
      const m = await Promise.allSettled([sendEmail(lead, taskUrl, env)]);
      return [t[0], m[0]] as const;
    })();

    if (task.status === 'rejected') console.error('clickup_failed', String(task.reason));
    if (mail.status === 'rejected') console.error('email_failed', String(mail.reason));
    if (task.status === 'rejected' && mail.status === 'rejected') {
      return json({ ok: false, error: 'upstream' }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  },
};
