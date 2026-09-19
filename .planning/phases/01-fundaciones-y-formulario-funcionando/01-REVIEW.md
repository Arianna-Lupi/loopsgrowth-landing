---
phase: 01-fundaciones-y-formulario-funcionando
reviewed: 2026-09-18T00:00:00Z
depth: standard
files_reviewed: 37
files_reviewed_list:
  - .env.example
  - .gitignore
  - PENDING-COPY.md
  - README.md
  - astro.config.mjs
  - package.json
  - playwright.config.ts
  - scripts/check-contrast.mjs
  - scripts/check-copy.mjs
  - scripts/lib/contrast.mjs
  - scripts/lib/copy-rules.mjs
  - scripts/list-pending.mjs
  - scripts/verify-dev-lan.mjs
  - scripts/verify-env-surface.mjs
  - src/components/AgendaSection.astro
  - src/components/CtaLink.astro
  - src/components/HeroSkeleton.astro
  - src/components/SiteHeader.astro
  - src/components/SkipLinks.astro
  - src/content.config.ts
  - src/content/landing.es.yaml
  - src/layouts/BaseLayout.astro
  - src/lib/content.ts
  - src/lib/site.ts
  - src/pages/index.astro
  - src/pages/robots.txt.ts
  - src/scripts/cta-focus.ts
  - src/styles/global.css
  - src/styles/tokens.css
  - tests/e2e/a11y-base.spec.ts
  - tests/e2e/cta-focus.spec.ts
  - tests/e2e/form-live.spec.ts
  - tests/e2e/form-measure.spec.ts
  - tests/guards/contrast.test.mjs
  - tests/guards/copy.test.mjs
  - tests/guards/list-pending.test.mjs
  - tsconfig.json
findings:
  critical: 1
  warning: 15
  info: 7
  total: 23
status: issues_found
---

# Fase 1: Informe de revisión de código

**Reviewed:** 2026-09-18
**Depth:** standard
**Files Reviewed:** 37
**Status:** issues_found

## Structural Findings (fallow)

No se entregó bloque `<structural_findings>`; esta sección no aplica.

## Narrative Findings (AI reviewer)

## Summary

El sitio es pequeño y correcto en lo esencial: noindex por defecto, el CTA sin `aria-label`, el iframe con título y el fallback con `noscript`. Los problemas están en las guardas y en las pruebas.

- Hay una prueba de guarda en rojo: `npm run test:guards` da 46 pasan y 1 falla (CR-01).
- Las guardas de contraste y de copy tienen falsos "OK" reproducidos con scripts: contraste (WR-03, WR-04) y copy (WR-05, WR-06, WR-07).
- La lógica de `PUBLIC_ENV` tiene una contradicción entre lo documentado y lo implementado (WR-01) y su script de verificación no es hermético (WR-02).
- Con el iframe de ClickUp bloqueado, el foco de `/#agenda` se pierde en la mayoría de las corridas (WR-08).
- Varias pruebas dependen de contenido vivo o de la red (WR-13, WR-15).

## Critical Issues

### CR-01: La suite de guardas ya está en rojo por una aserción obsoleta y acoplada a un token de layout

**File:** `tests/guards/contrast.test.mjs:76`
**Issue:** La prueba `parseTokens lee @theme static...` afirma `theme['--form-min-h-sm'] === '1100px'`, pero el Plan 04 dejó `--form-min-h-sm: 1664px` en `src/styles/tokens.css:56`. `node --test tests/guards/*.test.mjs` da 47 pruebas, 46 pasan, 1 falla con `'1664px' !== '1100px'`. La aserción tampoco tiene relación con el contraste: acopla la guarda de color a una medida de layout que cambia cada vez que se vuelve a medir el formulario.

**Fix:**
```js
// tests/guards/contrast.test.mjs, línea 76: comprobación de forma, no de valor
assert.match(theme['--form-min-h-sm'], /^\d+px$/, 'el bloque @theme static debe exponer --form-min-h-sm');
```

## Warnings

### WR-01: `canonical` se emite fuera de producción, contradice el README y convive con `noindex`

**File:** `src/layouts/BaseLayout.astro:21-22`
**Issue:** `{canonical && <link rel="canonical" ...>}` depende solo de `PUBLIC_SITE_URL`, no de `isProduction`. El README:25 y `.env.example` prometen "sin canonical ni sitemap" fuera de producción. Un preview con `PUBLIC_ENV=preview` y `PUBLIC_SITE_URL=https://loopsgrowth.com` emite `noindex` y además `canonical` al dominio de producción. `verify-env-surface.mjs` no lo detecta: nunca prueba fuera de producción con URL.

**Fix:**
```astro
{isProduction && canonical && <link rel="canonical" href={canonical} />}
```
Añadir a `verify-env-surface.mjs` un caso (e): `PUBLIC_ENV: 'preview', PUBLIC_SITE_URL: SITE`, esperando noindex y ningún `rel="canonical"`.

### WR-02: `verify-env-surface.mjs` no es hermético: un `.env` local cambia el resultado

**File:** `scripts/verify-env-surface.mjs:18-25`
**Issue:** `build()` borra `PUBLIC_ENV` y `PUBLIC_SITE_URL` de `process.env`, pero `astro.config.mjs:9` lee además `.env` y `.env.local` con `loadEnv`. Un `.env` con `PUBLIC_SITE_URL` hace fallar el caso (a); uno con `PUBLIC_ENV=production` hace que (a) y (d) construyan en producción. `tests/guards/copy.test.mjs` sí resolvió esto con una raíz vacía (`EMPTY_ROOT`).

**Fix:** En `build()`, forzar valores explícitos porque `process.env` gana sobre los archivos `.env`:
```js
const env = { ...process.env, PUBLIC_ENV: '', PUBLIC_SITE_URL: '', ...envOverrides };
```

### WR-03: La guarda de contraste compara el ratio ya redondeado contra el umbral

**File:** `scripts/lib/contrast.mjs:26` (consumido en `scripts/check-contrast.mjs:51` y `:80`)
**Issue:** `contrastRatio` devuelve `Math.round(x * 100) / 100` y luego se evalúa `ratio >= pair.min`. WCAG no redondea. `#6473b6` sobre blanco tiene ratio real 4.4971 y devuelve 4.5, así que pasa el umbral 4.5 sin cumplirlo.

**Fix:**
```js
export const contrastRaw = (a, b) => { /* sin Math.round */ };
export const contrastRatio = (a, b) => Math.round(contrastRaw(a, b) * 100) / 100; // solo para mostrar
// check-contrast.mjs: usar contrastRaw en meetsThreshold y en `ok = raw >= min`
```

### WR-04: Un tono con comillas simples, anidado o ausente se ignora y la guarda sale con código 0

**File:** `scripts/lib/contrast.mjs:61` y `:68` (con `scripts/check-contrast.mjs:66`)
**Issue:** El parser exige `[data-tone="x"]` con comillas dobles y bloques sin llaves anidadas. `[data-tone='dark'] {...}` produce `tones = ['light']`; CSS anidado produce `tones = {}`. `check-contrast.mjs` itera solo sobre los tonos encontrados y no exige que existan `light` y `purple`. Un selector descendiente `[data-tone="purple"] .card {...}` se fusiona por error con el tono completo.

**Fix:**
```js
// regex: /\[data-tone\s*=\s*["']?([\w-]+)["']?\]/g, y exigir que el selector sea EXACTAMENTE ese atributo
// en check-contrast.mjs, después de parseTokens:
for (const required of ['light', 'purple']) {
  if (!tones[required]) results.push({ kind: 'tone', pair: `tono ${required}`, ok: false, ratio: null, threshold: 0, detail: 'el tono no se encontró en tokens.css' });
}
// y fallar si el CSS contiene llaves anidadas dentro de un bloque data-tone
```

### WR-05: La guarda de voseo se evade con formas no listadas y con Unicode no normalizado

**File:** `scripts/lib/copy-rules.mjs:14-18` y `:25`, usado en `:159`
**Issue:** La regla es una lista cerrada de 21 palabras, sin normalización Unicode. `Conocé cómo, completá el formulario y llamanos.` da 0 violaciones. `Tenés` en NFD (típico de un pegado desde macOS o Docs) y `Agen​dá` con espacio de ancho cero dan 0. Falso positivo: `Llamada SOS` se marca por `sos`. El copy va verbatim del doc de Ari, origen probable de texto NFD.

**Fix:**
```js
const clean = (t) => t.normalize('NFC').replace(/[​-‍⁠﻿]/g, '');
// aplicar clean(text) antes de todas las reglas de contenido en checkCopy
// ampliar VOSEO_WORDS: conocé, completá, solicitá, pedí, consultá, elegí, probá, comenzá, aprovechá,
//   llamanos, hablanos, dejanos, avisanos, decime, hacés, pensás, buscás, vendés...
// quitar 'sos' o exigir minúscula (sin flag i) para no marcar "SOS"
// añadir a copy.test.mjs un caso NFD y uno con "conocé/completá"
```

### WR-06: `FALTA CONFIRMAR` se evade con mayúsculas o espacios distintos

**File:** `scripts/lib/copy-rules.mjs:6` y `:47-57`
**Issue:** `findMissingMark` usa `indexOf('FALTA CONFIRMAR')`, sensible a mayúsculas y a un único espacio ASCII. `Falta confirmar`, `FALTA  CONFIRMAR` (dos espacios) y NBSP dan 0 violaciones. Es el único bloqueo de producción para "dato faltante" y también se usa en `--dist`.

**Fix:**
```js
const MISSING_RE = /falta[\s ]+confirmar/giu;
// findMissingMark: recorrer text.matchAll(MISSING_RE) sobre text.normalize('NFC')
```

### WR-07: Un placeholder sin resolver llega a la página si el campo no pasa por `fill()`

**File:** `src/lib/content.ts:25-37`, con usos en bruto en `src/components/HeroSkeleton.astro:17`, `src/components/AgendaSection.astro:19,22,24,52,60`, `src/components/SkipLinks.astro:13-15` y `src/components/SiteHeader.astro:17`
**Issue:** Solo `hero.subtitle`, `agenda.intro`, `meta.title_template` y `cta.label_template` pasan por `fill()`, que lanza si queda una llave. `hero.h1`, `agenda.title`, `fallback_*`, `iframe_title`, `noscript`, `skip.*` y `brand.name` se imprimen con `.text` directo. `checkCopy` sobre `Hola {term}` devuelve 0 violaciones. Si se edita `hero.h1` a `Crecemos tu {term}...` el build pasa y la página publica el literal.

**Fix:** Añadir una regla estructural `PLACEHOLDER` en `checkCopy` (toda `{...}` debe ser `{term}` o `{duration}` y solo en claves `*_template`, `intro` y `subtitle`). Alternativa: que los componentes lean todo con un helper `t(claim)` que siempre llame a `fill`.

### WR-08: Con el iframe de ClickUp bloqueado, el foco de `/#agenda` se pierde en la mayoría de las corridas

**File:** `src/scripts/cta-focus.ts:33-42`
**Issue:** La carga directa enfoca con `setTimeout(0)` y reintenta una sola vez en `load`, y solo si `activeElement` es `body`. Con `forms.clickup.com` y `app-cdn.clickup.com` abortados, en 5 de 6 corridas `document.activeElement` era `BODY` a los 800 ms. Con red, 6 de 6 enfocaron el h2. Es el caso para el que existe el enlace de respaldo (bloqueadores o fallos de red).

**Fix:**
```ts
if (location.hash === HASH) {
  const t0 = performance.now();
  const tick = () => {
    if (document.activeElement !== document.getElementById(TITLE_ID)) focusTitle();
    if (performance.now() - t0 < 1500) setTimeout(tick, 150);
  };
  tick();
}
```
Añadir una prueba con las rutas de ClickUp abortadas (`page.route(..., r => r.abort())`).

### WR-09: `reuseExistingServer: true` incondicional permite validar un build viejo

**File:** `playwright.config.ts:22`
**Issue:** Si ya hay un `astro preview` en 4322, Playwright lo reutiliza sin reconstruir. Se cambia `cta-focus.ts`, se ejecuta `npm run test:e2e` y las pruebas corren contra el `dist` viejo.

**Fix:**
```ts
reuseExistingServer: !process.env.CI,
```
En el flujo del agente, documentar reconstruir antes (`astro build`) y matar el preview previo. Opcionalmente, un `globalSetup` que compare el mtime de `dist/index.html` con `src/`.

### WR-10: Dependencias no declaradas o mal ubicadas rompen `prebuild` y `astro.config.mjs` en instalaciones estrictas

**File:** `package.json:22-34`, `astro.config.mjs:5`, `scripts/check-copy.mjs:7-8`
**Issue:** `astro.config.mjs` y `check-copy.mjs` importan `vite` directamente, pero `vite` no está declarado (funciona por hoisting de npm). `yaml` está en `devDependencies` pero lo usa el `prebuild` de producción. Con `npm ci --omit=dev` o pnpm estricto, `prebuild` falla con `ERR_MODULE_NOT_FOUND`.

**Fix:** Declarar `"vite"` (misma major que usa Astro 7) en `dependencies` y mover `yaml` a `dependencies`, o documentar y forzar que el build instale devDependencies.

### WR-11: `z.url()` acepta cualquier esquema para un `<script src>` editable por el equipo

**File:** `src/content.config.ts:37-40`, usado en `src/components/AgendaSection.astro:23,51,56,61`
**Issue:** `form_url` y `form_script_src` solo pasan `z.url()`, que acepta `javascript:`, `data:` y `http:`. `form_script_src` se emite como `<script async src=...>` y el README:30 indica que el equipo edita ese YAML, incluso desde la web de GitHub. No hay SRI ni allowlist.

**Fix:**
```ts
const https = (host: string) => z.url().refine((u) => { const x = new URL(u); return x.protocol === 'https:' && x.hostname === host; }, `debe ser https://${host}`);
config: z.strictObject({ form_url: https('forms.clickup.com'), form_script_src: https('app-cdn.clickup.com') }),
```

### WR-12: `verify-dev-lan.mjs` detiene el servidor del usuario cuando el puerto está ocupado

**File:** `scripts/verify-dev-lan.mjs:17-28` y `:67-71`
**Issue:** Si el puerto 4321 ya responde, `fail()` llama a `cleanup()`, que ejecuta `npx astro dev stop`. Si Juan tiene su `astro dev` en segundo plano (Astro 7 lo hace con agentes), el script sale con error y mata ese servidor. `cleanup()` también corre `astro dev stop` (hasta 20 s) aunque nunca lanzó `child`.

**Fix:**
```js
const fail = (msg, { clean = true } = {}) => { console.error(`FAIL: ${msg}`); if (clean && child) cleanup(); process.exit(1); };
if (busy) fail(`el puerto ${PORT} ya está ocupado ...`, { clean: false });
```

### WR-13: Pruebas atadas al contenido vivo se rompen cuando Ari confirma un texto

**File:** `tests/guards/copy.test.mjs:200-215` (9b), `tests/guards/list-pending.test.mjs:167`, `tests/e2e/a11y-base.spec.ts:7-11`
**Issue:** Las pruebas fijan que hay exactamente 5 `pending` con esas rutas y los textos resueltos con `SEO/GEO` y `30 minutos`, escritos a mano. En cuanto Ari confirme uno, la suite de guardas y el e2e se rompen aunque el código esté bien.

**Fix:** Derivar lo esperado del YAML (`walkClaims` + `fill`) o usar fixtures propios. Para 9b, verificar "todas las violaciones son PENDING" y "las rutas coinciden con las `pending` del YAML", no una lista literal.

### WR-14: El anillo de foco del skip link es morado fijo y puede quedar invisible sobre `#agenda`

**File:** `src/components/SkipLinks.astro:44`
**Issue:** El anillo usa `var(--color-brand-purple)` sin tono, pero el enlace es `position: fixed` mientras tiene foco. Con el usuario en `#agenda` (fondo morado) que vuelve arriba con Shift+Tab, el skip link aparece sobre la sección morada con anillo morado sobre morado. La prueba (f) solo revisa el enlace arriba sobre fondo claro. No se verificó en navegador; es razonamiento sobre el CSS.

**Fix:**
```css
.skip a:focus-visible { outline: var(--focus-width) solid var(--color-brand-yellow); outline-offset: calc(var(--focus-width) * -1); }
```
Amarillo sobre `#212121` da 10.22, ya es un par aprobado.

### WR-15: La suite e2e depende de la red viva sin degradación

**File:** `tests/e2e/a11y-base.spec.ts:271-275`, `tests/e2e/cta-focus.spec.ts:42-45`, `tests/e2e/form-live.spec.ts`, `tests/e2e/form-measure.spec.ts`
**Issue:** El test "(e) la tarjeta vence el overflow" espera hasta 20 s a que el script de `app-cdn.clickup.com` ponga `overflow:auto`. form-live y form-measure esperan campos visibles del formulario real. Sin red o con ClickUp caído, `npm run test:e2e` falla en pruebas ajenas al código propio. El (d) de cta-focus solo pasa con red (ver WR-08), ocultando ese bug. `playwright.config.ts` no define `retries` ni separa un proyecto "sin red" de otro "con red".

**Fix:** Separar las pruebas que necesitan ClickUp en un proyecto o tag `@live`. Para las demás, mockear con `page.route`. Para (e), inyectar `style.overflow='auto'` a mano en vez de esperar al script.

## Info

### IN-01: `fill()` usa `replaceAll` con una cadena de reemplazo

**File:** `src/lib/content.ts:28`
**Issue:** Un valor con `$&`, `$1` o `$$` se interpreta como patrón de reemplazo. Tampoco se protege un valor `undefined` en `Partial<Vars>`, que insertaría "undefined".
**Fix:** `out = out.replaceAll(`{${name}}`, () => value ?? '')`.

### IN-02: La resolución de entorno está triplicada y usa modos de Vite distintos

**File:** `astro.config.mjs:9-24`, `src/lib/site.ts:4-20`, `scripts/check-copy.mjs:23`
**Issue:** `parseSiteUrl` está duplicado; la config y las guardas usan `loadEnv('production', ...)` mientras `site.ts` usa `import.meta.env` del modo real. Sin aviso de build si `PUBLIC_ENV` falta: un deploy productivo que olvide la variable sale con `noindex` en silencio.
**Fix:** Un único módulo `scripts/lib/env.mjs` compartido, y un mensaje de consola explícito con el modo resuelto.

### IN-03: `canonicalUrl('/')` descarta una ruta base, y producción acepta `http:`

**File:** `src/lib/site.ts:23-25` y `:13`
**Issue:** Con `PUBLIC_SITE_URL=https://x.com/landing/`, `new URL('/', siteUrl)` devuelve `https://x.com/`. `parseSiteUrl` acepta `http:` en producción.
**Fix:** `new URL(path.replace(/^\//, ''), siteUrl)` y exigir `https:` cuando `isProduction`.

### IN-04: Parseo frágil de opciones en las CLI

**File:** `scripts/check-copy.mjs:13-18`, `scripts/list-pending.mjs:13-19`
**Issue:** `check-copy.mjs --dist` sin valor hace que `opt` devuelva `undefined` y el script valide el YAML en modo normal y salga 0 sin escanear `dist`. `list-pending.mjs --out --check` escribe un archivo llamado `--check`. No se ejecutó.
**Fix:** Validar que el valor exista y no empiece por `--`; salir con 1 si falta.

### IN-05: `PENDING-COPY.md` puede quedar desactualizado y el módulo exporta desde un script ejecutable

**File:** `scripts/list-pending.mjs:9-10` y `:52-62`, `package.json:16-19`
**Issue:** `--check` existe y está probado, pero ningún script npm ni `prebuild` lo invoca. `DEFAULT_REASON` y `DEFAULT_CONFIRM_BY` se exportan desde un script con efectos secundarios de nivel superior.
**Fix:** Añadir `"check:pending": "node scripts/list-pending.mjs --check"` al `prebuild` y mover las constantes a `scripts/lib/`.

### IN-06: La regla DASH solo cubre U+2014 y U+2013

**File:** `scripts/lib/copy-rules.mjs:28`
**Issue:** `‒` (figura), `―` (barra horizontal) y `−` (menos) pasan sin violación.
**Fix:** `/[‒-―−]/g` si la intención es prohibir todos los guiones largos.

### IN-07: `tabUntilIframe` no comprueba que se llegó al iframe

**File:** `tests/e2e/a11y-base.spec.ts:42-51` y `:66`
**Issue:** Si tras 12 Tab no aparece un `IFRAME`, la función devuelve las paradas igualmente. (c) y (d) solo exigen `stops.length >= 6` y filtran el iframe, así que pasarían sin haberlo alcanzado.
**Fix:** Que `tabUntilIframe` lance un error si no termina en `IFRAME`, o que (c) y (d) afirmen `stops.at(-1)?.tag === 'IFRAME'`.

---

_Reviewed: 2026-09-18_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
