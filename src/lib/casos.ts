/** Páginas de casos: un slug por caso del YAML de la home (misma fuente y mismo orden). Sin copy aquí. */
export const CASO_SLUGS = ['ventas-ecommerce', 'conversiones-saas', 'clics-app-infantil', 'trafico-marca-personal'] as const;
export const CASOS_PATH = '/casos/';
export const casoPath = (slug: string) => `${CASOS_PATH}${slug}/`;
/** Tono propio de cada caso, para que cada ficha y cada banda se distingan. */
export const CASO_TONES = ['purple', 'yellow', 'dark', 'yellow'] as const;
