# Procedencia de los logos de clientes

Registro de los 12 logos de marcas que aparecen en el hero (`Hero.astro`, bloque de clientes). Lo leen `scripts/lib/photo-licenses.mjs` y `scripts/check-photos.mjs` (que corre en prebuild). Los logos son decorativos (`alt` vacío): el nombre del cliente va como texto visible junto a cada uno. Los archivos son webp de 128x128.

## Estado

Los logos salen de https://ariannalupi.com/ y de recursos de marca oficiales de clientes (Felipe Vergara, Ambl, Flodesk, Sendlane, ChartMogul, Piktochart). Juan Carlos Angulo autorizó su uso, pero la aprobación de Ari y la confirmación final de clientes siguen PENDIENTES. La puerta de producción (`PUBLIC_ENV=production`) bloquea mientras cualquier fila esté pendiente; fuera de producción solo advierte.

## Cómo cerrar la aprobación

1. Ari confirma que puede usar cada logo y cada nombre de cliente en la landing de Loops Growth (por escrito, por ejemplo un mensaje).
2. En la tabla "Registro" de este archivo: escribir en la columna de aprobación `aprobada por <nombre> el <AAAA-MM-DD>`. Ninguna fecha puede ser anterior a la descarga.
3. Si un cliente no se aprueba: borrar su fila, su archivo `src/assets/clients/<id>.webp`, su id en `src/components/sections/hero-clients.mjs` y su entrada en `hero.clients.items` del YAML (el esquema exige 12, ajústalo en `src/content.config.ts`).
4. Comprobar: `node --test tests/guards/hero-clients.test.mjs`, `PUBLIC_ENV=production node scripts/check-photos.mjs` (debe salir 0) y `npx astro build`.

## Registro

| id | archivo | fuente | descargada | dimensiones | sha256 | autorizó | aprobación de Ari | nota |
|----|---------|--------|------------|-------------|--------|----------|-------------------|------|
| `holafly` | `holafly.webp` | https://ariannalupi.com/assets/brands/holafly.webp | 2026-09-20 | 128x128 | c8c5d8fe9613c58f49f9a69d569203a1f7e4ca3415416d96571379b8389e39d6 | Juan Carlos Angulo, 2026-09-20 | pendiente | Holafly. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `hubspot` | `hubspot.webp` | https://ariannalupi.com/assets/brands/hubspot.webp | 2026-09-20 | 128x128 | ee188980de0fcc5db12d26e3a0ec7b07728a9ad6178bec7c312dfbedf203944f | Juan Carlos Angulo, 2026-09-20 | pendiente | HubSpot. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `unilever` | `unilever.webp` | https://ariannalupi.com/assets/brands/unilever.webp | 2026-09-20 | 128x128 | 19e9b70a0e07c12fe747a4cf7546ebb2f75dfbc2e80ec1c86339506cd23a580c | Juan Carlos Angulo, 2026-09-20 | pendiente | Unilever. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `alchemy` | `alchemy.webp` | https://ariannalupi.com/assets/brands/alchemy.webp | 2026-09-20 | 128x128 | 5611eb000a4c3576bb213073da983309d3714d4cc5876ae4837754d81287c88d | Juan Carlos Angulo, 2026-09-20 | pendiente | Alchemy. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `ambl` | `ambl.webp` | https://ariannalupi.com/assets/brands/ambl.webp | 2026-09-20 | 128x128 | 1189ce7f86bd30b2edd9cad52acf24d6770797938dd33defcb3196df0fc93aee | Juan Carlos Angulo, 2026-09-20 | pendiente | Ambl. Marca registrada de un tercero, recurso de marca oficial adaptado a 128x128. |
| `felipe-vergara` | `felipe-vergara.webp` | https://felipevergara.co/wp-content/uploads/Favicon-felipe-vergara.png | 2026-09-22 | 128x128 | 64f5032e57cf85aaa7977a24d863fc57b8406953c82a9d39cf9611b692e86f40 | Juan Carlos Angulo, 2026-09-22 | pendiente | Felipe Vergara. Marca comercial del cliente, favicon descargado de su sitio oficial. |
| `skale` | `skale.webp` | https://ariannalupi.com/assets/brands/skale.webp | 2026-09-20 | 128x128 | a6840a71d3c0abf27665f845771eef57061ff082d6684457221215e62a9bf5ca | Juan Carlos Angulo, 2026-09-20 | pendiente | Skale. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `sendlane` | `sendlane.webp` | https://ariannalupi.com/assets/brands/sendlane.webp | 2026-09-20 | 128x128 | 72f37aae8c394e2e4f3523d067dbc87a69eb0bdb94002816ed286127effb173a | Juan Carlos Angulo, 2026-09-20 | pendiente | Sendlane. Marca registrada de un tercero, recurso de marca oficial adaptado a 128x128. |
| `chartmogul` | `chartmogul.webp` | https://ariannalupi.com/assets/brands/chartmogul.webp | 2026-09-20 | 128x128 | f5cb2195ce044e591e168b7786a57bb31dec0c0118907e4a88959a9e1a93bb09 | Juan Carlos Angulo, 2026-09-20 | pendiente | ChartMogul. Marca registrada de un tercero, recurso de marca oficial adaptado a 128x128. |
| `holded` | `holded.webp` | https://ariannalupi.com/assets/brands/holded.webp | 2026-09-20 | 128x128 | 289a4282d73ba3570d45448b5e735ac924a842d6fe4e7af8c539215cbfe6021f | Juan Carlos Angulo, 2026-09-20 | pendiente | Holded. Marca registrada de un tercero, copiada del sitio de Ari sin licencia declarada. |
| `flodesk` | `flodesk.webp` | https://ariannalupi.com/assets/brands/flodesk.webp | 2026-09-20 | 128x128 | 0f51f0e13c86f176096447f4740003ca113cae7d81503f6e41a528d9600a1918 | Juan Carlos Angulo, 2026-09-20 | pendiente | Flodesk. Marca registrada de un tercero, recurso de marca oficial adaptado a 128x128. |
| `piktochart` | `piktochart.webp` | https://ariannalupi.com/assets/brands/piktochart.webp | 2026-09-20 | 128x128 | 1709eb9e25161bf286daf23fc79264da33c8c49374506a58bab5c2ed5aa9e373 | Juan Carlos Angulo, 2026-09-20 | pendiente | Piktochart. Marca registrada de un tercero, recurso de marca oficial adaptado a 128x128. |
