// Presupuesto de peso del HTML de `/`: UNA sola fuente para todas las pruebas que lo miden (los specs e2e y
// la guarda de Node `tests/guards/brand-assets.test.mjs`). ESM plano para que lo lean los dos.
//
// Justificación: 92160 bytes crudos (90 KiB) y, como condición dura,
// 25600 bytes con gzip -9 (17.6 KB medidos). Se ajustó para dar cabida a las 8 preguntas
// del FAQ y los 10 puntos de Para quién es sin recortar copy del cliente.
// La métrica que importa es la del gzip. Subir cualquiera
// de los dos valores se hace SOLO aquí y con la autorización del orquestador.

/** Bytes crudos: `dist/index.html` debe pesar MENOS que este valor (90 KiB). */
export const HTML_RAW_MAX = 92160;

/** Bytes con `gzip -9`: `dist/index.html` debe pesar MENOS que este valor (25 KiB). */
export const HTML_GZIP_MAX = 25600;
