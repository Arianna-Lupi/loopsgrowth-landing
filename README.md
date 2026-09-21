# Loops Growth Landing

Landing page oficial de captación y crecimiento orgánico de **Loops Growth** (SEO y GEO / AEO: Google, ChatGPT y Gemini). Construida sobre **Astro**, **Tailwind CSS**, arquitectura estática (SSG) de cero JavaScript propio (salvo un micro-script accesible de foco para la agenda), diseño responsive mobile-first y validación estricta de accesibilidad (WCAG 2.2 AA/AAA) y consistencia de marca.

---

## 🚀 Inicio rápido

### Requisitos
- **Node.js**: `>= 22.12.0` (versiones pares LTS: 22 o 24)
- **npm**: `>= 10`

### Instalación y ejecución local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo en http://localhost:4321
npm run dev

# Servidor de desarrollo accesible en red local (para pruebas en dispositivos móviles)
npm run dev:lan

# Construcción estática para producción (en dist/)
npm run build

# Previsualización local del build generado
npm run preview
```

---

## 🛠️ Stack tecnológico y arquitectura

- **Framework principal**: [Astro](https://astro.build/) en modo estático puro (`output: "static"`).
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Custom Properties nativas con tokens de diseño (`src/styles/tokens.css`).
- **Accesibilidad y movimiento**: CSS `@media (prefers-reduced-motion)` nativo sin dependencias de animación (`src/styles/motion.css`).
- **Tipografía**: Fuentes locales optimizadas (`Outfit`) sin llamadas externas a Google Fonts.
- **Gestión de contenidos**: Contenido centralizado en [`src/content/landing.es.yaml`](src/content/landing.es.yaml) con validación mediante esquema tipado en [`src/content.config.ts`](src/content.config.ts).
- **Formulario de conversión**: Integración embebida y accesible de ClickUp en la sección `#agenda` con carga diferida (`lazy`, `defer`) y respaldo completo con `noscript` para usuarios sin JavaScript.

---

## 📐 Estructura del repositorio

```
├── public/                 # Archivos estáticos públicos (favicons, robots, etc.)
├── scripts/                # Scripts de automatización y guardas estáticas
│   ├── check-contrast.mjs  # Validador de ratios de contraste WCAG de la paleta
│   ├── check-copy.mjs      # Validador de reglas de copy y afirmaciones
│   ├── check-photos.mjs    # Validador de licencias, sha256 y fotos de equipo
│   └── list-pending.mjs    # Generador de tabla de textos pendientes
├── src/
│   ├── assets/             # SVGs de marca, avatares de Loopy y logos de clientes
│   ├── components/
│   │   ├── collage/        # Escenas decorativas de collage y fotos tratadas
│   │   ├── sections/       # Secciones de la landing (Hero, Cases, Team, FAQ, etc.)
│   │   └── ui/             # Componentes UI reusables (SectionShell, MetricCard, LangText)
│   ├── content/
│   │   └── landing.es.yaml # Fuente única de la verdad de todos los textos
│   ├── lib/                # Utilidades de contenido y marcado de idiomas (WCAG 3.1.2)
│   ├── pages/              # Rutas estáticas (/, /privacidad, /marca/hoja)
│   └── styles/             # Tokens de diseño, tipografía y movimiento
└── tests/
    ├── e2e/                # Pruebas End-to-End en Playwright (multi-viewport, a11y, foco)
    └── guards/             # Pruebas de guardas estáticas del build (node:test)
```

---

## ✍️ Gestión de textos y copy (Single Source of Truth)

Todo el copy visible en la landing reside en [`src/content/landing.es.yaml`](src/content/landing.es.yaml).

Cada fragmento de texto se modela como un objeto con su estado:
```yaml
hero:
  h1:
    text: "Crecemos tu tienda a través de Google, ChatGPT y Gemini."
    status: verified
  subtitle:
    text: "Un equipo dedicado y especializado que ejecuta tu {term}..."
    status: pending
    reason: "Pendiente de confirmación final de término"
```

- `verified`: Texto revisado y aprobado.
- `pending`: Texto borrador o sujeto a confirmación. Si el entorno es `production`, cualquier texto `pending` o marcador `FALTA CONFIRMAR` detiene el build para evitar publicar información no validada.
- Para inspeccionar rápidamente los textos pendientes:
  ```bash
  npm run pending
  ```

---

## 🧪 Calidad, guardas y pruebas automáticas

El proyecto implementa una batería doble de pruebas automáticas:

### 1. Guardas estáticas (`node:test`)
Verifican el cumplimiento del brandbook, ratios de contraste WCAG, ausencia de estilos inline prohibidos, integridad de hashes de fotos y reglas de copy antes de compilar:
```bash
npm run test:guards
```

### 2. Pruebas End-to-End (`Playwright`)
Validan la experiencia de usuario real en múltiples viewports (320px, 360px, 390px, 768px, 1024px, 1280px):
```bash
# Ejecutar todas las pruebas E2E en Chromium con aislamiento de red
npm run test:e2e:isolated

# Ejecutar pruebas E2E offline
npm run test:e2e:offline

# Ejecutar pruebas específicas de un componente o sección
npx playwright test tests/e2e/results-cases.spec.ts
```

---

## 🌐 Variables de entorno

Copia `.env.example` como `.env`:

| Variable | Valores posibles | Descripción |
|---|---|---|
| `PUBLIC_ENV` | `local`, `preview`, `production` | Controla la indexación. Solo en `production` emite etiquetas de indexación y sitemap canónico. |
| `PUBLIC_SITE_URL` | URL absoluta (ej: `https://loopsgrowth.com`) | URL canónica para metadatos SEO, Open Graph y `robots.txt`. Requerida para build en `production`. |

---

## ♿ Accesibilidad (A11y) y Rendimiento

- **WCAG 2.2 AA / AAA**: Contraste medido superior a 4.5:1 en texto regular y 3:1 en elementos gráficos interactivos.
- **Navegación por teclado**: Enlaces de salto (*skip links* `#main` y `#agenda`), orden de tabulación predecible y anillos de foco visibles de 3px con contraste comprobado.
- **Idioma de las partes**: Marcado automático de términos técnicos en inglés mediante `<span lang="en">` (WCAG 3.1.2) sin alterar el diseño visual.
- **Cero JavaScript innecesario**: La landing se visualiza y opera completamente incluso con JavaScript deshabilitado.
