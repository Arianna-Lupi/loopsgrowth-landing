# Procedencia de los logos de clientes

Registro de los 6 logos de marcas que aparecen en el hero (`Hero.astro`, bloque de clientes). Lo leen `scripts/lib/photo-licenses.mjs` y `scripts/check-photos.mjs` (que corre en prebuild). Los logos son decorativos (`alt` vacío): el nombre del cliente va como texto visible junto a cada uno. Los archivos son webp de 128x128.

## Estado

Los logos salen de https://ariannalupi.com/ y de sitios oficiales de clientes (Felipe Vergara). Juan Carlos Angulo autorizó su uso, pero la aprobación de Ari y la confirmación final de clientes siguen PENDIENTES. La puerta de producción (`PUBLIC_ENV=production`) bloquea mientras cualquier fila esté pendiente; fuera de producción solo advierte.

## Cómo cerrar la aprobación

1. Ari confirma que puede usar cada logo y cada nombre de cliente en la landing de Loops Growth (por escrito, por ejemplo un mensaje).
2. En la tabla "Registro" de este archivo: escribir en la columna de aprobación `aprobada por <nombre> el <AAAA-MM-DD>`. Ninguna fecha puede ser anterior a la descarga.
3. Si un cliente no se aprueba: borrar su fila, su archivo `src/assets/clients/<id>.webp`, su id en `src/components/sections/hero-clients.mjs` y su entrada en `hero.clients.items` del YAML (el esquema exige 6, ajústalo en `src/content.config.ts`).
4. Comprobar: `node --test tests/guards/hero-clients.test.mjs`, `PUBLIC_ENV=production node scripts/check-photos.mjs` (debe salir 0) y `npx astro build`.

## Registro

| id | archivo | fuente | descargada | dimensiones | sha256 | autorizó | aprobación de Ari | nota |
|----|---------|--------|------------|-------------|--------|----------|-------------------|------|
| `flodesk` | `flodesk.webp` | https://ariannalupi.com/assets/brands/flodesk.webp | 2026-09-20 | 128x128 | 9cb7869bb1fe8e892831ca2206f756f2a06a4ca8415235d312a33930d48c1e31 | Juan Carlos Angulo, 2026-09-20 | pendiente | Flodesk. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `piktochart` | `piktochart.webp` | https://ariannalupi.com/assets/brands/piktochart.webp | 2026-09-20 | 128x128 | 2f798d2841f6f85ce49134e3dc9fbb2a2f9da6c88fb892b82e60c185850cdf05 | Juan Carlos Angulo, 2026-09-20 | pendiente | Piktochart. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `sendlane` | `sendlane.webp` | https://ariannalupi.com/assets/brands/sendlane.webp | 2026-09-20 | 128x128 | 4324056728d94792aa4d1cec681af7ae9cc8d3a5f8792c81954005439210dc6e | Juan Carlos Angulo, 2026-09-20 | pendiente | Sendlane. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `ambl` | `ambl.webp` | https://ariannalupi.com/assets/brands/ambl.webp | 2026-09-20 | 128x128 | f78c5d7f8d0bdaa95a004513b05ba78b553ec6423c08962a180536a1632bf4dd | Juan Carlos Angulo, 2026-09-20 | pendiente | Ambl. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `chartmogul` | `chartmogul.webp` | https://ariannalupi.com/assets/brands/chartmogul.webp | 2026-09-20 | 128x128 | 94664add2803f1d8d217254e3ecae6e03913a1bf117d882af69dd1eb8a6e3b82 | Juan Carlos Angulo, 2026-09-20 | pendiente | ChartMogul. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `felipe-vergara` | `felipe-vergara.webp` | https://felipevergara.co/wp-content/uploads/Favicon-felipe-vergara.png | 2026-09-22 | 128x128 | 64f5032e57cf85aaa7977a24d863fc57b8406953c82a9d39cf9611b692e86f40 | Juan Carlos Angulo, 2026-09-22 | pendiente | Felipe Vergara. Marca comercial del cliente, favicon descargado de su sitio oficial. |
