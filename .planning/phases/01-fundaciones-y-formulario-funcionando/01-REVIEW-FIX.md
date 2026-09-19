---
phase: 01-fundaciones-y-formulario-funcionando
fixed_at: 2026-09-19T03:50:25Z
review_path: .planning/phases/01-fundaciones-y-formulario-funcionando/01-REVIEW.md
iteration: 1
findings_in_scope: 16
fixed: 16
skipped: 0
status: all_fixed
---

# Fase 1: Informe de corrección de la revisión de código

**Corregido:** 2026-09-19T03:50:25Z
**Revisión de origen:** .planning/phases/01-fundaciones-y-formulario-funcionando/01-REVIEW.md
**Iteración:** 1

**Resumen:**
- Hallazgos en alcance: 16 (CR-01 y WR-01 a WR-15; los siete Info quedaron fuera de alcance)
- Corregidos: 16
- Omitidos: 0

## Verificación final

Dónde corrieron las comprobaciones: en un worktree aislado (`.claude/worktrees/rf-01-40668-1789788252`, rama temporal `gsd-reviewfix/01-40668`), con `node_modules` enlazado al del checkout principal. No se recrearon dependencias ni se ejecutó ningún borrado recursivo sobre ese enlace. Los resultados se reproducen desde el checkout principal una vez que la rama avanza por fast-forward.

| Comprobación | Resultado |
|--------------|-----------|
| `node --test tests/guards/*.test.mjs` | 62 pruebas, 62 pasan, 0 fallan (antes: 47, 46 pasan, 1 falla) |
| `npm run build` (con `prebuild` y `postbuild`) | Pasa |
| `PUBLIC_ENV=production npm run build` | Falla solo por las 5 reclamaciones PENDING (`brand.term`, `call.duration`, `meta.title_template`, `hero.subtitle`, `agenda.intro`); 0 fallos estructurales |
| `npx playwright test` (proyectos `chromium` y `live`, contra `astro preview` en 4322) | 51 pasan, 0 fallan (42 sin red, 9 con el formulario real). `forms.clickup.com` respondía 200 |
| `node scripts/verify-env-surface.mjs` | 18 comprobaciones PASS, incluido el nuevo caso (e) |
| `node scripts/list-pending.mjs --check` | `PENDING-COPY.md` está al día (5 pendientes); no hizo falta `npm run pending` |

Ninguna prueba llenó ni envió el formulario de ClickUp, y no se leyó ningún archivo `.env` (para probar WR-02 se creó un archivo local de entorno temporal con valores no secretos y se eliminó después). Se detuvo el preview (`astro preview stop`) y no quedan servidores propios en marcha.

## Fixed Issues

### CR-01: La suite de guardas ya está en rojo por una aserción obsoleta y acoplada a un token de layout

**Files modified:** `tests/guards/contrast.test.mjs`
**Commit:** caf74c2
**Applied fix:** la aserción de `--form-min-h-sm` pasó de comparar `'1100px'` a comprobar la forma (`/^\d+px$/`). La guarda de color ya no depende de una medida de layout que cambia cada vez que se vuelve a medir el formulario.

### WR-01: `canonical` se emite fuera de producción

**Files modified:** `src/layouts/BaseLayout.astro`, `scripts/verify-env-surface.mjs`
**Commit:** e9837fa
**Applied fix:** `canonical` solo se emite con `isProduction && canonical`. Se añadió el caso (e) a `verify-env-surface.mjs` (`PUBLIC_ENV=preview` con `PUBLIC_SITE_URL`): espera `noindex`, ningún `rel="canonical"`, sin sitemap y `robots.txt` sin `Sitemap`.

### WR-02: `verify-env-surface.mjs` no es hermético

**Files modified:** `scripts/verify-env-surface.mjs`
**Commit:** 4d905bd
**Applied fix:** `build()` fuerza `PUBLIC_ENV` y `PUBLIC_SITE_URL` vacíos y luego aplica los valores del caso, porque `process.env` gana sobre los archivos de entorno locales. Comprobado: con un archivo local que pone `production` y una URL, el script sin el arreglo daba 4 FAIL y con el arreglo pasa.

### WR-03: La guarda de contraste compara el ratio ya redondeado

**Files modified:** `scripts/lib/contrast.mjs`, `scripts/check-contrast.mjs`, `tests/guards/contrast.test.mjs`
**Commit:** 7e3ad90
**Applied fix:** nueva `contrastRaw` sin redondeo, usada en los tres umbrales (aprobados, tonos y prohibidos). `contrastRatio` queda solo para mostrar y para contrastar con el ratio medido de UI-SPEC. El detalle del fallo ahora indica el valor real (`real 4.4971`). Pruebas nuevas con `#6473b6` sobre blanco.

### WR-04: Un tono con comillas simples, anidado o ausente se ignora y la guarda sale con código 0

**Files modified:** `scripts/lib/contrast.mjs`, `scripts/check-contrast.mjs`, `tests/guards/contrast.test.mjs`
**Commit:** d49c21e
**Applied fix:** el selector de tono acepta comillas dobles, simples o ninguna. `parseTokens` devuelve además `problems`: selectores descendientes o compuestos (ya no se fusionan con el tono) y bloques con llaves anidadas. `check-contrast.mjs` falla si falta `light` o `purple` (`REQUIRED_TONES`) o si hay algún problema. Ojo: el selector real de `tokens.css` es `:root, [data-tone="light"]`, así que la regla exige que cada elemento de la lista sea exactamente el atributo (o `:root`), no que el selector completo lo sea.

### WR-05: La guarda de voseo se evade con formas no listadas y con Unicode no normalizado

**Files modified:** `scripts/lib/copy-rules.mjs`, `tests/guards/copy.test.mjs`
**Commit:** 829b3a2
**Estado:** fixed: requires human verification (la lista sigue siendo cerrada; conviene que alguien revise si cubre el copy de Ari)
**Applied fix:** `cleanText` (NFC y sin caracteres invisibles) se aplica al texto antes de todas las reglas de contenido. `VOSEO_WORDS` pasó de 21 a 88 formas (imperativos, presente de indicativo y formas con pronombre enclítico). `sos` solo se marca en minúscula, así que "Llamada SOS" ya no da falso positivo. Pruebas nuevas 4d, 4e y 4f (formas nuevas, NFD y ancho cero, y la sigla).

### WR-06: `FALTA CONFIRMAR` se evade con mayúsculas o espacios distintos

**Files modified:** `scripts/lib/copy-rules.mjs`, `tests/guards/copy.test.mjs`
**Commit:** 64887bd
**Applied fix:** `findMissingMark` usa `/falta\s+confirmar/giu` sobre el texto normalizado, sin distinguir mayúsculas, con cualquier espacio (varios, NBSP, U+2009) y con `&nbsp;` en HTML. Sirve también para `--dist`. Pruebas 10b y 11a-bis. Consecuencia asumida: una frase legítima "falta confirmar" en minúscula también bloquea producción; es lo que pedía el hallazgo.

### WR-07: Un placeholder sin resolver llega a la página si el campo no pasa por `fill()`

**Files modified:** `scripts/lib/copy-rules.mjs`, `tests/guards/copy.test.mjs`
**Commit:** 2b13dc2
**Applied fix:** nueva regla estructural `PLACEHOLDER` (falla en cualquier entorno). Rechaza variables que no sean `{term}` o `{duration}`, llaves sin pareja y cualquier llave en una ruta que la página imprime en bruto. Las rutas que sí pasan por `fill()` son las que terminan en `_template`, `hero.subtitle` y `agenda.intro` (`PLACEHOLDER_PATHS`, exportada y comentada: al añadir una ruta hay que llamar a `fill()` en su componente). Se eligió la regla estructural y no el helper `t()` en los componentes por ser el cambio más pequeño. Pruebas 13a, 13b y 13c.

### WR-08: Con el iframe de ClickUp bloqueado, el foco de `/#agenda` se pierde

**Files modified:** `src/scripts/cta-focus.ts`, `tests/e2e/cta-focus.spec.ts`
**Commit:** a10df0f
**Estado:** fixed: requires human verification (comportamiento de temporización en navegador; conviene probarlo a mano con un bloqueador de terceros y con lector de pantalla)
**Applied fix:** en la carga directa se reintenta cada 150 ms durante 1,5 s, pero solo mientras el foco esté vacío (`body` o nulo), y se detiene si la persona pulsa una tecla o el puntero. Se desvió del código sugerido (que reenfocaba siempre) para no robar el foco a quien ya empezó a tabular. Prueba nueva `(d2)` con las rutas de ClickUp abortadas (3 corridas). Se reprodujo el fallo con el código anterior (falló en la corrida 2) y con el arreglo pasa 3 de 3 varias veces. El script propio pesa 666 bytes, muy por debajo del límite de 3 KB.

### WR-09: `reuseExistingServer: true` incondicional permite validar un build viejo

**Files modified:** `playwright.config.ts`, `tests/global-setup.ts` (archivo nuevo)
**Commit:** 7cd107e
**Applied fix:** `reuseExistingServer: !process.env.CI`. Además, un `globalSetup` nuevo falla si `dist/index.html` es más viejo que cualquier archivo de `src/`, `public/` o `astro.config.mjs` (es la variante opcional del hallazgo; sin ella, en local el arreglo por sí solo no cambia nada, porque `CI` no está definida). Comprobado: tras tocar `src/pages/index.astro` el setup falla con un mensaje accionable, y tras reconstruir pasa. Decisión de criterio: se creó un archivo nuevo porque es la única forma de cubrir el caso de reutilización local, que es el flujo obligatorio de un agente.

### WR-10: Dependencias no declaradas o mal ubicadas

**Files modified:** `package.json`, `package-lock.json`
**Commit:** 912321f
**Applied fix:** `vite` se declara en `dependencies` con el pin exacto `8.3.0` (la misma versión que ya resuelve Astro 7.3.3 y que sigue el estilo de pines exactos del proyecto) y `yaml` pasa de `devDependencies` a `dependencies`. El lockfile se editó a mano (raíz y quitar `devOptional` de `yaml`) porque `npm install --package-lock-only` añadía entradas ajenas de paquetes wasm empaquetados. `npm ls` confirma `vite@8.3.0` deduplicado.

### WR-11: `z.url()` acepta cualquier esquema para un `<script src>` editable por el equipo

**Files modified:** `src/content.config.ts`
**Commit:** f286ee6
**Applied fix:** `form_url` exige `https:` y el host exacto `forms.clickup.com`; `form_script_src` exige `https:` y `app-cdn.clickup.com`. Es coherente con 01-UI-SPEC ("origen fijo"), así que no rompe ninguna decisión bloqueada; si un día se cambia de proveedor, se actualiza el host aquí a propósito. Comprobado con cuatro valores malos (`javascript:`, `http:`, otro host y `data:`): el build falla con "debe ser una URL https://app-cdn.clickup.com/...". El build con los valores reales pasa.

### WR-12: `verify-dev-lan.mjs` detiene el servidor del usuario cuando el puerto está ocupado

**Files modified:** `scripts/verify-dev-lan.mjs`
**Commit:** 16d7525
**Applied fix:** `fail()` solo llama a `cleanup()` si el script lanzó el servidor (`child` definido). Comprobado con un servidor ajeno en 4321: el script sale con 1 y el servidor sigue respondiendo. La ruta normal sigue pasando (localhost y la IP de red local).

### WR-13: Pruebas atadas al contenido vivo

**Files modified:** `tests/guards/copy.test.mjs`, `tests/guards/list-pending.test.mjs`, `tests/e2e/a11y-base.spec.ts`
**Commit:** 8d5b13f
**Applied fix:** la prueba 9b ahora exige que todas las violaciones sean PENDING y que sus rutas coincidan con las `pending` del propio YAML (vía `walkClaims`), con estado 1 solo si hay alguna. Se quitó la aserción `expected.length === 5` de list-pending. En el e2e, `H1_TEXT`, `SUBTITLE_TEXT`, `INTRO_TEXT` y `FORM_URL` se leen del YAML y se resuelven igual que `fill()`. `PENDING-COPY.md` no cambió.

### WR-14: El anillo de foco del skip link es morado fijo y puede quedar invisible sobre `#agenda`

**Files modified:** `src/components/SkipLinks.astro`, `tests/e2e/a11y-base.spec.ts`
**Commit:** 6aff082
**Estado:** fixed: requires human verification (decisión visual distinta a la sugerida; Juan debería revisar la captura `test-results/skip-link-focused-agenda.png`)
**Applied fix:** se desvió de la sugerencia del hallazgo, que cambiaba el contorno a amarillo interior y contradecía 01-UI-SPEC ("contorno de foco `3px solid #73187F` con offset 2 px"). Se conservó el contorno morado de la especificación y se añadió un anillo amarillo de dos tonos con `box-shadow: 0 0 0 var(--focus-offset) var(--color-brand-yellow)`, que rellena el hueco del offset. Sobre blanco se ve el morado (9.69); sobre morado, el amarillo (6.15) contra el morado y 10.22 contra el fondo oscuro del enlace. Los tres pares ya están aprobados. Prueba nueva `(f2)`: con `/#agenda`, el enlace enfocado queda parcialmente sobre la sección morada y conserva ambos colores. La captura confirma que el anillo se ve.

### WR-15: La suite e2e depende de la red viva sin degradación

**Files modified:** `playwright.config.ts`, `package.json`, `tests/e2e/a11y-base.spec.ts`
**Commit:** 7f72893
**Applied fix:** dos proyectos de Playwright: `chromium` (ignora `form-live` y `form-measure`, no toca ClickUp) y `live` (solo esos dos specs). Nuevos scripts `test:e2e:offline` y `test:e2e:live`; `test:e2e` sigue ejecutando ambos. La prueba `(e)` ya no espera 20 s al script de ClickUp: pone `style.overflow = 'auto'` a mano y comprueba que nuestro CSS (`overflow: visible !important`) lo vence. El caso `(d)` de cta-focus queda cubierto sin red por `(d2)` (WR-08). Se descartó mockear con `page.route` el resto de las pruebas porque el `chromium` actual ya no depende del contenido del formulario y conservar la carga real del iframe sigue siendo útil.

## Skipped Issues

Ninguno. Todos los hallazgos en alcance se aplicaron y se confirmaron con pruebas o comprobaciones ejecutables.

## Notas para el orquestador

- Los 7 hallazgos Info (IN-01 a IN-07) quedaron fuera de alcance (`fix_scope: critical_warning`).
- Cada corrección tiene su propio commit atómico con el formato `fix(01): {ID} ...`; ninguno incluye este informe.
- Si un cambio futuro de código no va seguido de `npx astro build` y de reiniciar el preview, el nuevo `globalSetup` (WR-09) avisará antes de validar un build viejo.

---

_Fixed: 2026-09-19T03:50:25Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
