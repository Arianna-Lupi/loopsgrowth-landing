import { defineConfig, devices } from '@playwright/test';

// Chromium contra el build de producción servido por `astro preview`.
// Puerto 4322 para no chocar con `astro dev` (4321). Se usa `astro build` directo
// (sin el prebuild de guardas) para que las pruebas de navegador no dependan de ellas.
//
// Nota: si un agente de IA ejecuta esto, Astro 7 deja `astro preview` en segundo plano y
// Playwright ve que el proceso terminó. En ese caso levanta antes el servidor
// (`npx astro build && npx astro preview --port 4322`); `reuseExistingServer` lo reutiliza.
// Termínalo después con `npx astro preview stop`. En CI (`CI` definida) nunca se reutiliza:
// siempre construye y levanta uno propio. Reutilizar un servidor previo es solo para local, y
// `tests/global-setup.ts` falla si `dist` es más viejo que `src/`, para no validar un build viejo:
// reconstruye (`npx astro build`) y reinicia el preview tras cada cambio de código.
export default defineConfig({
  testDir: 'tests/e2e',
  reporter: 'list',
  globalSetup: './tests/global-setup.ts',
  use: {
    baseURL: 'http://localhost:4322',
    ...devices['Desktop Chrome'],
  },
  projects: [{ name: 'chromium', use: { viewport: { width: 1280, height: 800 } } }],
  webServer: {
    command: 'npx astro build && npx astro preview --port 4322',
    url: 'http://localhost:4322',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
